import type { Options, V1Thread } from "@xpadev-net/niconicomments";
import NiconiComments from "@xpadev-net/niconicomments";
import { getConfigs, watchConfigs } from "@/config/";
import type { Result } from "@/lib/types";
import type { Threads } from "@/types/api";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./core/constants";
import { mountOverlay, queryVideoElement } from "./core/dom";
import type { RendererController } from "./types";

export const createNiconiRenderer = async (): Promise<Result<RendererController, string>> => {
  const video = queryVideoElement();
  if (!video) return { ok: false, error: "Video element not found" };

  const { overlay } = mountOverlay(video);
  const canvas = document.createElement("canvas");
  canvas.id = "d-comments-canvas";
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  Object.assign(canvas.style, {
    objectFit: "contain",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
    display: "block",
    pointerEvents: "none",
    zIndex: "2",
  });
  overlay.appendChild(canvas);

  const {
    comment_area_opacity_percentage: initialOpacity,
    nicoarea_scale: initialScale,
    comment_renderer_fps: initialFps,
    comment_timing_offset: initialOffset,
    show_comments_in_niconico_style: initialVisibility,
  } = await getConfigs([
    "comment_area_opacity_percentage",
    "nicoarea_scale",
    "comment_renderer_fps",
    "comment_timing_offset",
    "show_comments_in_niconico_style",
  ] as const);

  let offsetMs = initialOffset;
  let isVisible = initialVisibility;
  const options: Options = {
    format: "v1",
    keepCA: true,
    scale: Math.max(initialScale / 100, 0),
  };
  const clampFps = (v: number) => Math.min(120, Math.max(15, Math.round(Number.isFinite(v) ? v : 60)));
  let frameIntervalMs = 1000 / clampFps(initialFps);
  let lastDrawAt = performance.now();

  canvas.style.opacity = (initialOpacity / 100).toString();
  canvas.style.display = isVisible ? "block" : "none";
  overlay.style.display = isVisible ? "block" : "none";

  let renderer: NiconiComments | null = null;
  let rafId: number | null = null;
  let currentThreads: Threads = [];

  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  const startLoop = () => {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  };

  const tick = (): number => {
    if (!renderer) {
      rafId = requestAnimationFrame(tick);
      return 0;
    }
    const now = performance.now();
    if (now - lastDrawAt < frameIntervalMs) {
      rafId = requestAnimationFrame(tick);
      return 0;
    }
    lastDrawAt = now;
    try {
      renderer.drawCanvas(Math.max(0, Math.floor((video.currentTime * 1000 + offsetMs) / 10)));
    } catch {
      renderer = null;
      stopLoop();
      return 0;
    }
    rafId = requestAnimationFrame(tick);
    return 1;
  };

  const rebuild = () => {
    if (!isVisible || currentThreads.length === 0) {
      stopLoop();
      renderer?.clear();
      return;
    }
    stopLoop();
    renderer?.clear();
    try {
      renderer = new NiconiComments(canvas, currentThreads as V1Thread[], options);
      lastDrawAt = performance.now();
      startLoop();
    } catch {
      renderer = null;
    }
  };

  const applyVisibility = (visible: boolean) => {
    isVisible = visible;
    canvas.style.display = visible ? "block" : "none";
    overlay.style.display = visible ? "block" : "none";
    visible
      ? rebuild()
      : (() => {
          stopLoop();
          renderer?.clear();
        })();
  };

  const _stops: (() => void)[] = [];
  watchConfigs(
    [
      "comment_area_opacity_percentage",
      "nicoarea_scale",
      "comment_renderer_fps",
      "show_comments_in_niconico_style",
      "comment_timing_offset",
    ] as const,
    ({ current }) => {
      canvas.style.opacity = (current.comment_area_opacity_percentage / 100).toString();
      options.scale = Math.max(current.nicoarea_scale / 100, 0);
      frameIntervalMs = 1000 / clampFps(current.comment_renderer_fps);
      lastDrawAt = performance.now();
      applyVisibility(current.show_comments_in_niconico_style);
      offsetMs = current.comment_timing_offset;
    }
  ).then((stop) => _stops.push(stop));

  const setThreads = (threads: Threads): Threads => {
    currentThreads = threads;
    rebuild();
    return currentThreads;
  };

  const dispose = (): boolean => {
    stopLoop();
    renderer?.clear();
    canvas.remove();
    overlay.remove();
    for (const s of _stops) s();
    return true;
  };

  return { ok: true, value: { setThreads, dispose } };
};
