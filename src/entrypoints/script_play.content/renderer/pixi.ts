import {
  Container,
  Graphics,
  Text,
  TextStyle,
  type TextStyleFontWeight,
} from "pixi.js";
import type { Result } from "@/lib/types";
import type { Threads } from "@/types/api";
import { buildTimeline } from "./core/comments";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COMMENT_DRAW_PADDING,
  COMMENT_DRAW_RANGE,
  NAKA_COMMENT_SPEED_OFFSET,
} from "./core/constants";
import { mountOverlay, queryVideoElement } from "./core/dom";
import { createPixiScene } from "./core/scene";
import type { CommentLocation, TimelineComment } from "./core/types";
import type { RendererController } from "./types";

type CommentNode = {
  container: Container;
  width: number;
  height: number;
  resolution: number;
  signature: string;
};

const stableHiResScale = (v: number) => (v > 0 ? v : 1);
const signatureOf = (c: TimelineComment) =>
  `${c.styleKey}:${c.width}:${c.height}`;

const createCommentNode = (
  c: TimelineComment,
  resolution: number,
  styleCache: Map<string, TextStyle>
): CommentNode => {
  const container = new Container();
  container.eventMode = "none";
  const padding = c.style.padding;

  let textStyle = styleCache.get(c.styleKey);
  if (!textStyle) {
    const hi = stableHiResScale(c.style.hiResScale);
    textStyle = new TextStyle({
      fontFamily: c.style.fontFamily,
      fontSize: Math.max(1, c.style.fontSize / hi),
      fontWeight: String(c.style.fontWeight) as unknown as TextStyleFontWeight,
      fill: { color: c.style.fill, alpha: c.style.fillAlpha },
      stroke: {
        color: c.style.stroke,
        width: c.style.strokeWidth,
        alpha: c.style.strokeAlpha,
      },
      align: "left",
      wordWrap: false,
      breakWords: false,
    });
    styleCache.set(c.styleKey, textStyle);
  }

  const hi = stableHiResScale(c.style.hiResScale);
  for (const m of c.style.lineMetrics) {
    const txt = m.text.length > 0 ? m.text : " ";
    const t = new Text(txt, textStyle);
    t.resolution = resolution;
    t.roundPixels = true;
    t.scale.set(hi);
    t.x = padding;
    t.y = padding + (m.top - c.style.contentTop);
    container.addChild(t);
  }

  if (
    c.style.backgroundColor !== undefined ||
    c.style.borderColor !== undefined
  ) {
    const bg = new Graphics();
    if (c.style.backgroundColor !== undefined) {
      bg.beginFill(c.style.backgroundColor, c.style.backgroundAlpha ?? 1);
      bg.drawRect(0, 0, c.width, c.height);
      bg.endFill();
    }
    if (c.style.borderColor !== undefined && c.style.borderWidth) {
      bg.lineStyle(
        c.style.borderWidth,
        c.style.borderColor,
        c.style.borderAlpha ?? 1
      );
      bg.drawRect(0, 0, c.width, c.height);
    }
    container.addChildAt(bg, 0);
  }

  return {
    container,
    width: c.width,
    height: c.height,
    resolution,
    signature: signatureOf(c),
  };
};

const computeElapsedVpos = (ms: number) => Math.floor(ms / 10);
const computeScrollX = (
  width: number,
  durationVpos: number,
  elapsedMs: number
) => {
  const elapsedVpos = computeElapsedVpos(elapsedMs);
  const speed =
    (COMMENT_DRAW_RANGE + width * NAKA_COMMENT_SPEED_OFFSET) /
    (durationVpos + 100);
  return (
    COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE - (elapsedVpos + 100) * speed
  );
};

export const createPixiRenderer = async (): Promise<
  Result<RendererController, string>
> => {
  const video = queryVideoElement();
  if (!video) return { ok: false, error: "Video element not found" };

  const { overlay } = mountOverlay(video);
  const { app, layer } = await createPixiScene(overlay);
  const commentLayer = new Container();
  commentLayer.eventMode = "none";
  layer.addChild(commentLayer);

  const styleCache = new Map<string, TextStyle>();
  const nodeCache = new Map<string, CommentNode>();
  const pool = new Map<string, CommentNode[]>();

  const ensureResolution = (n: CommentNode, resolution: number): boolean => {
    if (n.resolution === resolution) return false;
    for (const child of n.container.children) {
      if (child instanceof Text) child.resolution = resolution;
    }
    n.resolution = resolution;
    return true;
  };

  const getNode = (c: TimelineComment): CommentNode => {
    const sig = signatureOf(c);
    const cached = nodeCache.get(c.id);
    if (cached && cached.signature === sig) {
      ensureResolution(cached, app.renderer.resolution);
      if (cached.container.parent)
        cached.container.parent.removeChild(cached.container);
      cached.width = c.width;
      cached.height = c.height;
      return cached;
    }

    if (cached) nodeCache.delete(c.id);
    const bucket = pool.get(sig) ?? [];
    const node =
      bucket.pop() ?? createCommentNode(c, app.renderer.resolution, styleCache);
    node.signature = sig;
    node.width = c.width;
    node.height = c.height;
    node.resolution = app.renderer.resolution;
    nodeCache.set(c.id, node);
    if (bucket.length === 0) pool.delete(sig);
    else pool.set(sig, bucket);
    return node;
  };

  const releaseNode = (id: string): boolean => {
    const n = nodeCache.get(id);
    if (!n) return false;
    if (n.container.parent) n.container.parent.removeChild(n.container);
    nodeCache.delete(id);
    const arr = pool.get(n.signature) ?? [];
    arr.push(n);
    pool.set(n.signature, arr);
    return true;
  };

  let timeline: TimelineComment[] = [];
  let nextIndex = 0;
  let lastMs = 0;
  const active: Array<{
    comment: TimelineComment;
    node: CommentNode;
    anchorMs: number;
    exitMs: number;
    location: CommentLocation;
  }> = [];

  const clearActive = (): number => {
    const removed = active.length;
    for (const a of active)
      if (a.node.container.parent) commentLayer.removeChild(a.node.container);
    active.length = 0;
    return removed;
  };

  const spawnUntil = (nowMs: number): number => {
    let spawned = 0;
    while (
      nextIndex < timeline.length &&
      timeline[nextIndex].enterMs <= nowMs
    ) {
      const c = timeline[nextIndex++];
      const n = getNode(c);
      commentLayer.addChild(n.container);
      active.push({
        comment: c,
        node: n,
        anchorMs: c.vposMs,
        exitMs: c.exitMs,
        location: c.loc,
      });
      spawned++;
    }
    return spawned;
  };

  const updateOne = (
    it: {
      comment: TimelineComment;
      node: CommentNode;
      anchorMs: number;
      exitMs: number;
      location: CommentLocation;
    },
    nowMs: number
  ): number => {
    const cm = it.comment;
    const nd = it.node;
    nd.container.y =
      cm.loc === "bottom" ? CANVAS_HEIGHT - nd.height - cm.posY : cm.posY;
    if (it.location === "top" || it.location === "bottom") {
      nd.container.x = Math.max(0, (CANVAS_WIDTH - nd.width) / 2);
      return nd.container.x;
    }
    const duration = Math.max(1, cm.durationVpos);
    const elapsed = nowMs - it.anchorMs;
    nd.container.x = computeScrollX(nd.width, duration, elapsed);
    return nd.container.x;
  };

  const tick = (): number => {
    const nowMs = Math.max(0, video.currentTime * 1000);
    let updates = 0;
    if (nowMs + 80 < lastMs) {
      updates += clearActive();
      nextIndex = 0;
      updates += spawnUntil(nowMs);
      for (const it of active) {
        updateOne(it, nowMs);
        updates++;
      }
      lastMs = nowMs;
      return updates;
    }
    lastMs = nowMs;
    updates += spawnUntil(nowMs);
    for (let i = active.length - 1; i >= 0; i--) {
      const it = active[i];
      if (nowMs >= it.exitMs) {
        if (it.node.container.parent)
          commentLayer.removeChild(it.node.container);
        active.splice(i, 1);
        updates++;
        continue;
      }
      updateOne(it, nowMs);
      updates++;
    }
    return updates;
  };

  app.ticker.add(tick);

  const setThreads = (threads: Threads) => {
    timeline = buildTimeline(threads);
    const now = Math.max(0, video.currentTime * 1000);
    clearActive();
    nextIndex = 0;
    spawnUntil(now);
    for (const it of active) updateOne(it, now);
    const ids = new Set(timeline.map((t) => t.id));
    for (const k of Array.from(nodeCache.keys()))
      if (!ids.has(k)) releaseNode(k);
    const keys = new Set(timeline.map((t) => t.styleKey));
    for (const k of Array.from(styleCache.keys()))
      if (!keys.has(k)) styleCache.delete(k);
    return threads;
  };

  const dispose = (): boolean => {
    app.ticker.remove(tick);
    app.ticker.stop();
    clearActive();
    commentLayer.destroy({ children: true });
    for (const n of nodeCache.values()) n.container.destroy({ children: true });
    nodeCache.clear();
    for (const arr of pool.values())
      for (const n of arr) n.container.destroy({ children: true });
    pool.clear();
    styleCache.clear();
    app.destroy(true, { children: true });
    overlay.remove();
    return true;
  };

  return { ok: true, value: { setThreads, dispose } };
};
