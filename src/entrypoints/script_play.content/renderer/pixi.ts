import { Container, type RenderTexture, type TextStyle } from 'pixi.js';
import { getConfig, watchConfig } from '@/config/storage';
import type { Result } from '@/lib/types';
import type { Threads } from '@/types/api';
import { buildTimeline } from './core/comments';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COMMENT_DRAW_PADDING,
  COMMENT_DRAW_RANGE,
  SCROLL_SPEED_FACTOR,
} from './core/constants';
import { mountOverlay, queryVideoElement } from './core/dom';
import { createNodeOps, type Node } from './core/node';
import { createPixiScene } from './core/scene';
import type { CommentLocation, TimelineComment } from './core/types';
import type { RendererController } from './types';

type ActiveItem = {
  comment: TimelineComment;
  node: Node;
  anchorVpos: number;
  location: CommentLocation;
  scrollSpeed: number;
  staticX: number;
};

const computeScrollSpeed = (width: number, durationVpos: number) =>
  (COMMENT_DRAW_RANGE + width * SCROLL_SPEED_FACTOR) / (durationVpos + 100);

export const createPixiRenderer = async (): Promise<Result<RendererController, string>> => {
  const video = queryVideoElement();
  if (!video) return { error: 'Video element not found', ok: false };

  const { overlay } = mountOverlay(video);
  const { app, layer } = await createPixiScene(overlay);
  const commentLayer = new Container();
  commentLayer.eventMode = 'none';
  commentLayer.interactiveChildren = false;
  layer.addChild(commentLayer);

  const initialOpacity = await getConfig('comment_area_opacity_percentage');
  const initialScale = await getConfig('nicoarea_scale');
  const initialFps = await getConfig('comment_renderer_fps');
  const initialOffset = await getConfig('comment_timing_offset');
  const initialVisibility = await getConfig('show_comments_in_niconico_style');

  let offsetMs = initialOffset;
  let fontScale = Math.max(initialScale / 100, 0);
  let cachedThreads: Threads | null = null;
  let currentVideo: HTMLVideoElement | null = video;
  let clockVideo: HTMLVideoElement | null = null;
  let renderVpos = Number.NaN;
  let clockVpos = Number.NaN;
  let clockAt = 0;
  let targetFps = initialFps;

  const styleCache = new Map<string, TextStyle>();
  const textureCache = new Map<string, RenderTexture>();
  const nodeOps = createNodeOps({
    getResolution: () => app.renderer.resolution,
    renderer: app.renderer,
    styleCache,
    textureCache,
  });
  const nodeCache = new Map<string, Node>();
  const pool = new Map<string, Node[]>();

  const setFps = (value: number) => {
    app.ticker.maxFPS = Math.max(60, value);
    app.ticker.minFPS = 0;
    targetFps = Math.max(1, value);
  };
  setFps(initialFps);
  app.ticker.autoStart = false;
  app.ticker.stop();

  const opacity = (value: number) => {
    app.canvas.style.opacity = Math.max(value / 100, 0).toString();
  };

  let isVisible = initialVisibility;
  const updateTickerState = () => {
    const shouldRun = isVisible && Boolean(cachedThreads);
    if (shouldRun) {
      if (!app.ticker.started) app.ticker.start();
    } else if (app.ticker.started) {
      app.ticker.stop();
    }
  };

  const visible = (value: boolean) => {
    isVisible = value;
    commentLayer.visible = value;
    const display = value ? 'block' : 'none';
    overlay.style.display = display;
    app.canvas.style.display = display;
    updateTickerState();
  };

  const offset = (value: number) => {
    offsetMs = value;
    if (!cachedThreads) return;
    resetActive();
  };

  function scale(value: number) {
    const nextScale = Math.max(value / 100, 0);
    if (nextScale === fontScale) return;
    fontScale = nextScale;
    styleCache.clear();
    nodeCache.clear();
    pool.clear();
    nodeOps.clearTextures();
    if (cachedThreads) setThreads(cachedThreads);
  }

  const detach = (container: Container) => container.parent?.removeChild(container);

  const getVideo = () => {
    if (currentVideo?.isConnected) return currentVideo;
    currentVideo = queryVideoElement();
    return currentVideo;
  };

  const getNode = (comment: TimelineComment): ReturnType<(typeof nodeOps)['makeNode']> => {
    const cached = nodeCache.get(comment.id);
    if (cached) {
      nodeOps.updateNode(cached, comment);
      return cached;
    }
    const signature = nodeOps.nodeSignature(comment);
    const bucket = pool.get(signature);
    const node = bucket?.pop();
    if (node) nodeOps.updateNode(node, comment);
    const created = node ?? nodeOps.makeNode(comment);
    nodeCache.set(comment.id, created);
    if (!bucket?.length) pool.delete(signature);
    return created;
  };

  const releaseNode = (id: string): void => {
    const node = nodeCache.get(id);
    if (!node) return;
    detach(node.container);
    nodeCache.delete(id);
    // Drop unused textures to avoid WebGPU memory growth.
    const texture = node.sprite.texture;
    let used = false;
    for (const item of nodeCache.values()) {
      if (item.sprite.texture === texture) {
        used = true;
        break;
      }
    }
    if (!used) {
      for (const [key, cached] of textureCache.entries()) {
        if (cached !== texture) continue;
        texture.destroy(true);
        textureCache.delete(key);
        break;
      }
    }
    let bucket = pool.get(node.signature);
    if (!bucket) {
      bucket = [];
      pool.set(node.signature, bucket);
    }
    bucket.push(node);
  };

  let timeline: Record<number, TimelineComment[]> = {};
  let lastVposInt = Number.NEGATIVE_INFINITY;
  const active: ActiveItem[] = [];
  let activeSet = new Set<string>();
  let nextActive = new Set<string>();

  const updateOne = (item: ActiveItem, nowVpos: number) => {
    if (item.location !== 'middle') return;
    item.node.container.x =
      COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE - (nowVpos - item.anchorVpos + 100) * item.scrollSpeed;
  };

  const placeItem = (item: ActiveItem, nowVpos: number) => {
    const { comment, node } = item;
    node.container.y = comment.loc === 'bottom' ? CANVAS_HEIGHT - comment.height - comment.posY : comment.posY;
    if (item.location === 'middle') updateOne(item, nowVpos);
    else node.container.x = item.staticX;
  };

  const addActive = (comment: TimelineComment, nowVpos: number) => {
    const node = getNode(comment);
    commentLayer.addChild(node.container);
    const isMiddle = comment.loc === 'middle';
    const speed = isMiddle ? computeScrollSpeed(comment.width, comment.durationVpos || 1) : 0;
    const staticX = isMiddle ? 0 : (CANVAS_WIDTH - comment.width) / 2;
    const item: ActiveItem = {
      anchorVpos: comment.vpos,
      comment,
      location: comment.loc,
      node,
      scrollSpeed: speed,
      staticX,
    };
    active.push(item);
    placeItem(item, nowVpos);
  };

  const tick = (): number => {
    const video = getVideo();
    if (!video) return 0;
    const rawVpos = video.currentTime * 100 + offsetMs / 10;
    if (!Number.isFinite(rawVpos) || rawVpos < 0) return 0;
    const rate = Number.isFinite(video.playbackRate) ? video.playbackRate : 1;
    const playing = video.readyState >= 2 && !video.paused && !video.ended;
    const fps = Math.max(1, targetFps);
    const dt = Math.min(app.ticker.deltaMS || 1000 / fps, 100);
    const alpha = 1 - Math.exp(-dt / ((1000 / fps) * 6));
    const now = performance.now();
    const sync = (hard = false) => {
      if (hard) resetActive();
      clockVideo = video;
      clockVpos = rawVpos;
      clockAt = now;
      renderVpos = rawVpos;
    };
    if (video !== clockVideo || !Number.isFinite(renderVpos)) sync();
    const clocked = clockVpos + ((now - clockAt) * rate) / 10;
    if (!playing) sync();
    else {
      const drift = rawVpos - clocked;
      if (Math.abs(drift) > 60) sync(true);
      else if (Math.abs(drift) > 0.5) {
        clockVpos = rawVpos;
        clockAt = now;
      }
    }
    let target = clockVpos + ((playing ? now - clockAt : 0) * rate) / 10;
    if (playing) {
      const diff = target - renderVpos;
      if (Math.abs(diff) > 60) {
        sync(true);
        target = renderVpos;
      } else renderVpos += diff * alpha;
    } else renderVpos = target;
    const nowVpos = renderVpos;
    let nowVposInt = Math.floor(target);
    if (playing && rate >= 0 && nowVposInt < lastVposInt) nowVposInt = lastVposInt;
    const rangeChanged = nowVposInt !== lastVposInt;
    if (rangeChanged) {
      nextActive.clear();
      const timelineRange = timeline[nowVposInt];
      if (timelineRange) {
        for (const comment of timelineRange) {
          if (!activeSet.has(comment.id)) addActive(comment, nowVpos);
          nextActive.add(comment.id);
        }
      }
    }

    for (let index = active.length - 1; index >= 0; index--) {
      const item = active[index];
      if (rangeChanged && !nextActive.has(item.comment.id)) {
        releaseNode(item.comment.id);
        active[index] = active[active.length - 1];
        active.pop();
      } else updateOne(item, nowVpos);
    }

    if (rangeChanged) {
      [activeSet, nextActive] = [nextActive, activeSet];
      lastVposInt = nowVposInt;
    }
    return 1;
  };

  app.ticker.add(tick);

  const stops: (() => void)[] = [];

  const clearAll = () => {
    for (const layer of active) releaseNode(layer.comment.id);
    active.length = 0;
    activeSet.clear();
    updateTickerState();
  };

  const resetActive = () => {
    clearAll();
    lastVposInt = Number.NEGATIVE_INFINITY;
    renderVpos = Number.NaN;
    clockVpos = Number.NaN;
    clockAt = 0;
    clockVideo = null;
    updateTickerState();
  };

  function setThreads(threads: Threads) {
    cachedThreads = threads;
    timeline = buildTimeline(threads, fontScale);
    resetActive();
    const ids = new Set<string>();
    const keys = new Set<string>();
    const textures = new Set<string>();
    for (const list of Object.values(timeline)) {
      for (const comment of list) {
        ids.add(comment.id);
        keys.add(comment.styleKey);
        textures.add(nodeOps.textureKey(comment));
      }
    }
    for (const id of nodeCache.keys()) if (!ids.has(id)) releaseNode(id);
    for (const key of styleCache.keys()) if (!keys.has(key)) styleCache.delete(key);
    for (const [key, texture] of textureCache.entries()) {
      if (textures.has(key)) continue;
      texture.destroy(true);
      textureCache.delete(key);
    }
    return threads;
  }

  watchConfig('comment_area_opacity_percentage', (value) => opacity(value)).then((stop) => stops.push(stop));
  watchConfig('nicoarea_scale', (value) => scale(value)).then((stop) => stops.push(stop));
  watchConfig('comment_renderer_fps', (value) => setFps(value)).then((stop) => stops.push(stop));
  watchConfig('show_comments_in_niconico_style', (value) => visible(value)).then((stop) => stops.push(stop));
  watchConfig('comment_timing_offset', (value) => offset(value)).then((stop) => stops.push(stop));

  opacity(initialOpacity);
  visible(initialVisibility);
  offset(initialOffset);
  scale(initialScale);

  updateTickerState();

  const dispose = () => {
    app.ticker.remove(tick);
    clearAll();
    nodeOps.clearTextures();
    for (const stop of stops) stop();
    app.destroy(true, { children: true, texture: true, textureSource: true });
  };

  return { ok: true, value: { dispose, setThreads } };
};
