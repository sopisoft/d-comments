import type { Options, V1Thread } from "@xpadev-net/niconicomments";
import NiconiComments from "@xpadev-net/niconicomments";
import { getConfig, watchConfig } from "@/config/";
import type { Result } from "@/lib/types";
import type { Threads } from "@/types/api";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./core/constants";
import { mountOverlay, queryVideoElement } from "./core/dom";
import type { RendererController } from "./types";

export const createNiconiRenderer = async (): Promise<
  Result<RendererController, string>
> => {
  const video = queryVideoElement();
  if (!video) {
    return { ok: false, error: "Video element not found" };
  }

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

  const initialOpacity = await getConfig("comment_area_opacity_percentage");
  const initialScale = await getConfig("nicoarea_scale");
  const initialFps = await getConfig("comment_renderer_fps");
  let offsetMs = await getConfig("comment_timing_offset");
  let isVisible = await getConfig("show_comments_in_niconico_style");

  const options: Options = {
    format: "v1",
    keepCA: true,
    scale: Math.max(initialScale / 100, 0),
  };

  const clampFps = (value: number): number => {
    const rounded = Math.round(value);
    if (!Number.isFinite(rounded)) return 60;
    return Math.min(120, Math.max(15, rounded));
  };

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

    const currentTimeMs = video.currentTime * 1000 + offsetMs;
    const vpos = Math.max(0, Math.floor(currentTimeMs / 10));
    try {
      renderer.drawCanvas(vpos);
    } catch {
      renderer = null;
      stopLoop();
      return 0;
    }
    rafId = requestAnimationFrame(tick);
    return 1;
  };

  const startLoop = () => {
    if (rafId === null) rafId = requestAnimationFrame(tick);
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
      renderer = new NiconiComments(
        canvas,
        currentThreads as unknown as V1Thread[],
        options
      );
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
    if (visible) {
      rebuild();
    } else {
      stopLoop();
      renderer?.clear();
    }
  };

  await watchConfig("comment_area_opacity_percentage", (value) => {
    canvas.style.opacity = (value / 100).toString();
  });

  await watchConfig("nicoarea_scale", (value) => {
    options.scale = Math.max(value / 100, 0);
    rebuild();
  });

  await watchConfig("comment_renderer_fps", (value) => {
    frameIntervalMs = 1000 / clampFps(value);
    lastDrawAt = performance.now();
  });

  await watchConfig("show_comments_in_niconico_style", (value) => {
    applyVisibility(value);
  });

  await watchConfig("comment_timing_offset", (value) => {
    offsetMs = value;
  });

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
    return true;
  };

  return { ok: true, value: { setThreads, dispose } };
};
