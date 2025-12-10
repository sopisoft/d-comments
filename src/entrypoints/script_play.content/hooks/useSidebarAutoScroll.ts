import { type RefObject, useCallback, useEffect, useRef } from "react";
import type { VirtuosoHandle } from "react-virtuoso";
import { getConfig, watchConfig } from "@/config";
import type { NvCommentItem } from "@/types/api";
import type { SidebarConfig } from "../context/SidebarContext";
import { useAnimationFrame } from "./useAnimationFrame";

type Options = {
  video: HTMLVideoElement | null;
  config: SidebarConfig;
  comments: NvCommentItem[];
  virtuosoRef: RefObject<VirtuosoHandle | null>;
  isPopoverOpen: boolean;
};

const pickNearestIndex = (items: NvCommentItem[], target: number) => {
  if (!items.length) return -1;
  let i = items.findIndex((c) => c.vposMs >= target);
  if (i < 0) i = items.length - 1;
  if (i > 0 && Math.abs(items[i - 1].vposMs - target) <= Math.abs(items[i].vposMs - target)) i -= 1;
  return i;
};

export function useSidebarAutoScroll({ video, config, comments, virtuosoRef, isPopoverOpen }: Options) {
  const lastIdx = useRef(-1);
  const autoEnabled = useRef(true);
  const manualPause = useRef(false);
  const hover = useRef(false);

  const scroll = useCallback(() => {
    if (
      !video ||
      video.paused ||
      !autoEnabled.current ||
      manualPause.current ||
      hover.current ||
      isPopoverOpen ||
      !comments.length
    )
      return;
    if (lastIdx.current >= comments.length) lastIdx.current = -1;
    const target = video.currentTime * 1000 + (config.timingOffset ?? 0);
    const i = pickNearestIndex(comments, target);
    if (i < 0 || (lastIdx.current >= 0 && i < lastIdx.current)) return;
    lastIdx.current = i;
    virtuosoRef.current?.scrollToIndex({
      index: i,
      align: "end",
      behavior: config.scrollSmoothly ? "smooth" : "auto",
    });
  }, [video, config, comments, virtuosoRef, isPopoverOpen]);

  const { start, pause } = useAnimationFrame(scroll, config.fps ? 1000 / config.fps : 0);

  useEffect(() => {
    start();
    return pause;
  }, [pause, start]);

  const notifyManualScroll = useCallback(() => {
    if (autoEnabled.current) manualPause.current = true;
  }, []);
  const notifyHover = useCallback((h: boolean) => {
    hover.current = h;
  }, []);

  useEffect(() => {
    let active = true;
    let stop: (() => void) | undefined;
    (async () => {
      const init = await getConfig("enable_auto_scroll");
      if (!active) return;
      autoEnabled.current = init === true;
      manualPause.current = false;
      lastIdx.current = -1;
      stop = await watchConfig("enable_auto_scroll", (v) => {
        autoEnabled.current = v === true;
        manualPause.current = false;
        lastIdx.current = -1;
      });
    })();
    return () => {
      active = false;
      stop?.();
    };
  }, []);

  return { notifyManualScroll, notifyHover };
}
