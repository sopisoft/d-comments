import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { VirtuosoHandle } from "react-virtuoso";
import { getConfig, watchConfig } from "@/config";
import type { NvCommentItem } from "@/types/api";
import { useAnimationFrame } from "./useAnimationFrame";
import type { SidebarState } from "./useSidebarConfig";

export type PopoverSelection = "user" | "word";

type UseSidebarAutoScrollOptions = {
  video: HTMLVideoElement | null;
  config: SidebarState;
  comments: NvCommentItem[];
  virtuosoRef: RefObject<VirtuosoHandle | null>;
};

type PopoverState = {
  comment: NvCommentItem;
  selection: PopoverSelection;
  text: string;
} | null;

type UseSidebarAutoScrollResult = {
  notifyManualScroll(): void;
  notifyHover(isHovering: boolean): void;
  isPopoverOpen: boolean;
  popoverSelection: PopoverSelection;
  popoverText: string;
  openPopover(
    comment: NvCommentItem,
    preferredSelection?: PopoverSelection
  ): void;
  setPopoverSelection(next: PopoverSelection): void;
  setPopoverText(next: string): void;
};

const pickNearestIndex = (items: NvCommentItem[], target: number) => {
  if (items.length === 0) return -1;

  let index = items.findIndex((comment) => comment.vposMs >= target);
  if (index < 0) index = items.length - 1;

  if (index > 0) {
    const previous = items[index - 1];
    const current = items[index];
    if (
      Math.abs(previous.vposMs - target) <= Math.abs(current.vposMs - target)
    ) {
      index -= 1;
    }
  }

  return index;
};

export function useSidebarAutoScroll({
  video,
  config,
  comments,
  virtuosoRef,
}: UseSidebarAutoScrollOptions): UseSidebarAutoScrollResult {
  const [popover, setPopover] = useState<PopoverState>(null);
  const lastIndexRef = useRef(-1);
  const autoEnabledRef = useRef(true);
  const manualPauseRef = useRef(false);
  const hoverRef = useRef(false);

  const openPopover = useCallback(
    (comment: NvCommentItem, preferredSelection?: PopoverSelection) => {
      const selection =
        preferredSelection ?? (comment.userId ? "user" : "word");
      setPopover({
        comment,
        selection,
        text: selection === "word" ? (comment.body ?? "") : "",
      });
    },
    []
  );

  const setPopoverSelection = useCallback((next: PopoverSelection) => {
    setPopover((prev) => (prev ? { ...prev, selection: next } : prev));
  }, []);

  const setPopoverText = useCallback((next: string) => {
    setPopover((prev) => (prev ? { ...prev, text: next } : prev));
  }, []);

  const scroll = useCallback(() => {
    if (!video || video.paused) return;
    if (!autoEnabledRef.current || manualPauseRef.current || hoverRef.current)
      return;
    if (popover) return;
    if (comments.length === 0) return;

    if (lastIndexRef.current >= comments.length) {
      lastIndexRef.current = -1;
    }

    const target = video.currentTime * 1000 + (config.timingOffset ?? 0);
    const index = pickNearestIndex(comments, target);

    if (
      index < 0 ||
      (lastIndexRef.current >= 0 && index < lastIndexRef.current)
    )
      return;

    lastIndexRef.current = index;
    virtuosoRef.current?.scrollToIndex({
      index,
      align: "end",
      behavior: config.scrollSmoothly ? "smooth" : "auto",
    });
  }, [video, config, comments, virtuosoRef, popover]);

  const { start, pause } = useAnimationFrame(
    scroll,
    config.fps ? 1000 / config.fps : 0
  );

  useEffect(() => {
    start();
    return pause;
  }, [pause, start]);

  const notifyManualScroll = useCallback(() => {
    if (!autoEnabledRef.current) return;
    manualPauseRef.current = true;
  }, []);

  const notifyHover = useCallback((isHovering: boolean) => {
    hoverRef.current = isHovering;
  }, []);

  useEffect(() => {
    let active = true;
    let stop: (() => void) | undefined;

    (async () => {
      const initial = await getConfig("enable_auto_scroll");
      if (!active) return;
      autoEnabledRef.current = initial === true;
      manualPauseRef.current = false;
      lastIndexRef.current = -1;
      stop = await watchConfig("enable_auto_scroll", (value) => {
        autoEnabledRef.current = value === true;
        manualPauseRef.current = false;
        lastIndexRef.current = -1;
      });
    })();

    return () => {
      active = false;
      stop?.();
    };
  }, []);

  return {
    notifyManualScroll,
    notifyHover,
    isPopoverOpen: popover !== null,
    popoverSelection: popover?.selection ?? "user",
    popoverText: popover?.text ?? "",
    openPopover,
    setPopoverSelection,
    setPopoverText,
  };
}
