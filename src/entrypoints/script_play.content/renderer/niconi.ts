import type { Options, V1Thread } from '@xpadev-net/niconicomments';
import NiconiComments from '@xpadev-net/niconicomments';
import { getConfig, watchConfig } from '@/config/storage';
import type { Result } from '@/lib/types';
import type { Threads } from '@/types/api';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './core/constants';
import { mountOverlay, queryVideoElement } from './core/dom';
import type { RendererController } from './types';

export const createNiconiRenderer = async (): Promise<Result<RendererController, string>> => {
  const video = queryVideoElement();
  if (!video) return { error: 'Video element not found', ok: false };

  const { overlay } = mountOverlay(video);
  let canvas = overlay.querySelector<HTMLCanvasElement>('#d-comments-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'd-comments-canvas';
  }
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  Object.assign(canvas.style, {
    display: 'block',
    height: '100%',
    left: '0',
    objectFit: 'contain',
    pointerEvents: 'none',
    position: 'absolute',
    top: '0',
    width: '100%',
    zIndex: '2',
  });
  if (canvas.parentElement !== overlay) overlay.appendChild(canvas);

  const initialOpacity = await getConfig('comment_area_opacity_percentage');
  const initialScale = await getConfig('nicoarea_scale');
  const initialFps = await getConfig('comment_renderer_fps');
  const initialOffset = await getConfig('comment_timing_offset');
  const initialVisibility = await getConfig('show_comments_in_niconico_style');

  let offsetMs = initialOffset;
  let isVisible = initialVisibility;
  const options: Options = {
    format: 'v1',
    keepCA: true,
    scale: Math.max(initialScale / 100, 0),
  };
  const clampFps = (value: number) => Math.min(120, Math.max(15, Math.round(Number.isFinite(value) ? value : 60)));
  let frameIntervalMs = 1000 / clampFps(initialFps);
  let lastDrawAt = performance.now();

  canvas.style.opacity = (initialOpacity / 100).toString();
  canvas.style.display = isVisible ? 'block' : 'none';
  overlay.style.display = isVisible ? 'block' : 'none';

  let renderer: NiconiComments | null = null;
  let rendererReady = false;
  let rafId: number | null = null;
  let currentThreads: Threads = [];
  let disposed = false;

  const stopLoop = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  };
  const startLoop = () => {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  };

  const tick = (): number => {
    if (disposed) return 0;
    if (!renderer) {
      rafId = requestAnimationFrame(tick);
      return 0;
    }
    const videoNow = queryVideoElement();
    if (!videoNow) {
      rafId = requestAnimationFrame(tick);
      return 0;
    }
    const now = performance.now();
    if (now - lastDrawAt < frameIntervalMs) {
      rafId = requestAnimationFrame(tick);
      return 0;
    }
    lastDrawAt = now;
    if (!canvas.isConnected) {
      stopLoop();
      return 0;
    }
    if (rendererReady && renderer) {
      const vpos = Math.max(0, Math.floor((videoNow.currentTime * 1000 + offsetMs) / 10));
      (renderer as unknown as { drawCanvas: (frame: number) => void }).drawCanvas(vpos);
    }
    rafId = requestAnimationFrame(tick);
    return 1;
  };

  const clearRenderer = () => {
    stopLoop();
    if (renderer) renderer.clear();
    renderer = null;
    rendererReady = false;
  };

  const rebuild = () => {
    if (!isVisible || currentThreads.length === 0) return clearRenderer();
    clearRenderer();
    if (!canvas.isConnected) return;
    renderer = new NiconiComments(canvas, currentThreads as V1Thread[], options);
    rendererReady = true;
    lastDrawAt = performance.now();
    startLoop();
  };

  const applyVisibility = (visible: boolean) => {
    isVisible = visible;
    canvas.style.display = visible ? 'block' : 'none';
    overlay.style.display = visible ? 'block' : 'none';
    (visible ? rebuild : clearRenderer)();
  };

  const stops: (() => void)[] = [];
  watchConfig('comment_area_opacity_percentage', (value) => {
    canvas.style.opacity = (value / 100).toString();
  }).then((stop) => stops.push(stop));
  watchConfig('nicoarea_scale', (value) => {
    options.scale = Math.max(value / 100, 0);
    rebuild();
  }).then((stop) => stops.push(stop));
  watchConfig('comment_renderer_fps', (value) => {
    frameIntervalMs = 1000 / clampFps(value);
    lastDrawAt = performance.now();
  }).then((stop) => stops.push(stop));
  watchConfig('show_comments_in_niconico_style', (value) => {
    applyVisibility(value);
  }).then((stop) => stops.push(stop));
  watchConfig('comment_timing_offset', (value) => {
    offsetMs = value;
  }).then((stop) => stops.push(stop));

  const setThreads = (threads: Threads): Threads => {
    currentThreads = threads;
    rebuild();
    return currentThreads;
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    clearRenderer();
    for (const stop of stops) stop();
    canvas.style.display = 'none';
    overlay.style.display = 'none';
  };

  return { ok: true, value: { dispose, setThreads } };
};
