import { type RefObject, useCallback, useEffect, useRef } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';
import { getConfig, watchConfig } from '@/config/storage';
import type { NvCommentItem } from '@/types/api';
import type { SidebarConfig } from '../context/SidebarContext';
import { useAnimationFrame } from './useAnimationFrame';

type Options = {
  video: HTMLVideoElement | null;
  config: SidebarConfig;
  comments: NvCommentItem[];
  virtuosoRef: RefObject<VirtuosoHandle | null>;
  isPopoverOpen: boolean;
};

const findNearestIndex = (items: NvCommentItem[], target: number): number => {
  if (items.length === 0) return -1;
  const nextIdx = items.findIndex((c) => c.vposMs >= target);
  const idx = nextIdx < 0 ? items.length - 1 : nextIdx;
  if (idx > 0) {
    const prevDiff = Math.abs(items[idx - 1].vposMs - target);
    const curDiff = Math.abs(items[idx].vposMs - target);
    if (prevDiff <= curDiff) return idx - 1;
  }
  return idx;
};

export function useSidebarAutoScroll({ video, config, comments, virtuosoRef, isPopoverOpen }: Options): {
  notifyHover: (h: boolean) => void;
} {
  const lastIdx = useRef(-1);
  const autoEnabled = useRef(true);
  const hover = useRef(false);
  const lastTarget = useRef<number | null>(null);

  useEffect(() => {
    lastIdx.current = -1;
    hover.current = false;
    lastTarget.current = null;
  }, [comments]);

  const scroll = useCallback(() => {
    const v = video && document.contains(video) ? video : (document.querySelector('video') as HTMLVideoElement | null);
    if (!v || comments.length === 0) return;

    const target = v.currentTime * 1000 + (config.timingOffset ?? 0);
    const isPaused = v.paused;
    const disabled = isPaused || !autoEnabled.current || hover.current || isPopoverOpen;
    if (disabled) return;

    if (lastIdx.current >= comments.length) lastIdx.current = -1;

    const prevTarget = lastTarget.current;
    if (prevTarget !== null && target + 1000 < prevTarget) lastIdx.current = -1;

    lastTarget.current = target;

    const idx = findNearestIndex(comments, target);
    if (idx < 0) return;
    if (lastIdx.current >= 0 && idx < lastIdx.current) return;

    lastIdx.current = idx;
    virtuosoRef.current?.scrollToIndex({
      align: 'end',
      behavior: config.scrollSmoothly ? 'smooth' : 'auto',
      index: idx,
    });
  }, [video, config, comments, virtuosoRef, isPopoverOpen]);

  const { start, pause } = useAnimationFrame(scroll, config.fps ? 1000 / config.fps : 0);

  useEffect(() => {
    start();
    scroll();
    return pause;
  }, [pause, start, scroll]);

  const notifyHover = useCallback(
    (h: boolean) => {
      hover.current = h;
      if (!h) {
        if (autoEnabled.current) start();
        return;
      }
      pause();
      const v =
        video && document.contains(video) ? video : (document.querySelector('video') as HTMLVideoElement | null);
      if (v) lastTarget.current = v.currentTime * 1000 + (config.timingOffset ?? 0);
    },
    [video, config.timingOffset, pause, start]
  );

  useEffect(() => {
    let stopped = false;
    let stopFn: (() => void) | undefined;

    (async () => {
      const init = await getConfig('enable_auto_scroll');
      if (stopped) return;
      autoEnabled.current = init === true;
      lastIdx.current = -1;
      stopFn = await watchConfig('enable_auto_scroll', (v) => {
        autoEnabled.current = v === true;
        lastIdx.current = -1;
      });
    })();

    return () => {
      stopped = true;
      stopFn?.();
    };
  }, []);
  useEffect(() => {
    if (!video) return;
    const onPlay = () => scroll();
    const onSeeked = () => {
      lastTarget.current = video.currentTime * 1000 + (config.timingOffset ?? 0);
      scroll();
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('seeked', onSeeked);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [video, config.timingOffset, scroll]);

  return { notifyHover };
}
