import { Container, type TextStyle } from "pixi.js";
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
import { type CommentNode, createCommentNode, ensureResolution, signatureOf } from "./pixiNode";
import type { RendererController } from "./types";

type ActiveItem = {
  comment: TimelineComment;
  node: CommentNode;
  anchorMs: number;
  exitMs: number;
  location: CommentLocation;
};

const computeElapsedVpos = (ms: number) => (ms / 10) | 0;
const computeScrollX = (width: number, durationVpos: number, elapsedMs: number) => {
  const speed = (COMMENT_DRAW_RANGE + width * NAKA_COMMENT_SPEED_OFFSET) / (durationVpos + 100);
  return COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE - (computeElapsedVpos(elapsedMs) + 100) * speed;
};

export const createPixiRenderer = async (): Promise<Result<RendererController, string>> => {
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

  const detach = (c: Container) => c.parent?.removeChild(c);

  const getNode = (c: TimelineComment): CommentNode => {
    const sig = signatureOf(c);
    const cached = nodeCache.get(c.id);
    if (cached?.signature === sig) {
      ensureResolution(cached, app.renderer.resolution);
      detach(cached.container);
      cached.width = c.width;
      cached.height = c.height;
      return cached;
    }
    if (cached) nodeCache.delete(c.id);
    const bucket = pool.get(sig);
    const node = bucket?.pop() ?? createCommentNode(c, app.renderer.resolution, styleCache);
    node.signature = sig;
    node.width = c.width;
    node.height = c.height;
    node.resolution = app.renderer.resolution;
    nodeCache.set(c.id, node);
    if (!bucket?.length) pool.delete(sig);
    return node;
  };

  const releaseNode = (id: string): boolean => {
    const n = nodeCache.get(id);
    if (!n) return false;
    detach(n.container);
    nodeCache.delete(id);
    let arr = pool.get(n.signature);
    if (!arr) {
      arr = [];
      pool.set(n.signature, arr);
    }
    arr.push(n);
    return true;
  };

  let timeline: TimelineComment[] = [];
  let nextIndex = 0;
  let lastMs = 0;
  const active: ActiveItem[] = [];

  const updateOne = (it: ActiveItem, nowMs: number) => {
    const { comment: cm, node: nd } = it;
    nd.container.y = cm.loc === "bottom" ? CANVAS_HEIGHT - nd.height - cm.posY : cm.posY;
    nd.container.x =
      it.location === "middle"
        ? computeScrollX(nd.width, cm.durationVpos || 1, nowMs - it.anchorMs)
        : ((CANVAS_WIDTH - nd.width) / 2) | 0;
  };

  const tick = (): number => {
    const nowMs = (video.currentTime * 1000) | 0;
    if (nowMs < 0) return 0;
    let updates = 0;

    // シーク検出（80ms以上戻った場合）
    if (nowMs + 80 < lastMs) {
      for (const a of active) a.node.container.parent?.removeChild(a.node.container);
      active.length = 0;
      nextIndex = 0;
      lastMs = nowMs;
    }

    // 新規コメント追加
    while (nextIndex < timeline.length && timeline[nextIndex].enterMs <= nowMs) {
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
      updates++;
    }

    // 位置更新と終了判定
    for (let i = active.length - 1; i >= 0; i--) {
      const it = active[i];
      if (nowMs >= it.exitMs) {
        it.node.container.parent?.removeChild(it.node.container);
        active[i] = active[active.length - 1];
        active.pop();
      } else {
        updateOne(it, nowMs);
      }
      updates++;
    }

    lastMs = nowMs;
    return updates;
  };

  app.ticker.add(tick);

  const clearAll = () => {
    for (const a of active) a.node.container.parent?.removeChild(a.node.container);
    active.length = 0;
  };

  const setThreads = (threads: Threads) => {
    timeline = buildTimeline(threads);
    const now = (video.currentTime * 1000) | 0;
    clearAll();
    nextIndex = 0;
    lastMs = now;
    // 現在時刻までのコメントを追加
    while (nextIndex < timeline.length && timeline[nextIndex].enterMs <= now) {
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
    }
    for (const it of active) updateOne(it, now);
    // キャッシュを削除
    const ids = new Set(timeline.map((t) => t.id));
    for (const k of nodeCache.keys()) if (!ids.has(k)) releaseNode(k);
    const keys = new Set(timeline.map((t) => t.styleKey));
    for (const k of styleCache.keys()) if (!keys.has(k)) styleCache.delete(k);
    return threads;
  };

  const dispose = (): boolean => {
    app.ticker.remove(tick);
    app.ticker.stop();
    clearAll();
    commentLayer.destroy({ children: true });
    for (const n of nodeCache.values()) n.container.destroy({ children: true });
    nodeCache.clear();
    for (const arr of pool.values()) for (const n of arr) n.container.destroy({ children: true });
    pool.clear();
    styleCache.clear();
    app.destroy(true, { children: true });
    overlay.remove();
    return true;
  };

  return { ok: true, value: { setThreads, dispose } };
};
