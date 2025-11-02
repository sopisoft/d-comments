import type { Threads } from "@/types/api";
import type { CommandParseContext } from "./commandParser";
import { parseMailCommands } from "./commandParser";
import {
  CANVAS_WIDTH,
  COMMENT_DRAW_PADDING,
  COMMENT_DRAW_RANGE,
  NAKA_COMMENT_SPEED_OFFSET,
} from "./constants";
import { applyLayout } from "./layout";
import { measureComment } from "./measurement";
import type { CommentStyle, TimelineComment } from "./types";

type PendingTimelineEntry = {
  comment: TimelineComment;
  vposMs: number;
  order: number;
  threadIndex: number;
  sequence: number;
};

const normalizeCommands = (
  commands: readonly string[] | undefined
): readonly string[] => commands ?? [];

const createStyleKey = (style: CommentStyle): string =>
  [
    style.fontFamily,
    style.fontWeight,
    style.fontSize,
    style.fill,
    style.fillAlpha,
    style.stroke,
    style.strokeAlpha,
    style.strokeWidth,
    style.lineHeight,
    style.laneHeight,
    style.charSize,
    style.lineHeightStage,
    style.scale,
    style.backgroundColor ?? "bg:none",
    style.backgroundAlpha ?? "bgAlpha:none",
    style.borderColor ?? "border:none",
    style.borderWidth ?? 0,
    style.borderAlpha ?? "borderAlpha:none",
    style.padding,
    Number(style.padded),
    Number(style.resizedY),
    Number(style.resizedX),
  ].join("|");

const FLOW_MIN_LEAD_VPOS = 160;
const FLOW_EXIT_EXTENSION_VPOS = 125;
const VPOS_FRAME_MS = 10;

const computeTimingPadding = (style: CommentStyle): number => {
  if (!style.padded) return 0;
  return Math.max(4, Math.round(style.lineHeight * 0.1));
};

const computeFlowSpeed = (width: number, durationVpos: number): number => {
  const denominator = durationVpos + 100;
  if (denominator <= 0) return 0;
  return (COMMENT_DRAW_RANGE + width * NAKA_COMMENT_SPEED_OFFSET) / denominator;
};

const computeFlowEnterMs = (
  width: number,
  durationVpos: number,
  vposMs: number
): number => {
  const speed = computeFlowSpeed(width, durationVpos);
  if (speed <= 0) return Math.max(0, vposMs);
  const visibleThreshold = CANVAS_WIDTH - width;
  const rawLead =
    (COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE - visibleThreshold) / speed -
    100;
  const leadInVpos = Math.min(-FLOW_MIN_LEAD_VPOS, Math.floor(rawLead));
  return Math.max(0, vposMs + leadInVpos * VPOS_FRAME_MS);
};

const computeFlowExitMs = (
  width: number,
  durationVpos: number,
  vposMs: number
): number => {
  const speed = computeFlowSpeed(width, durationVpos);
  const minimumVpos = durationVpos + FLOW_EXIT_EXTENSION_VPOS;
  if (speed <= 0) {
    return vposMs + minimumVpos * VPOS_FRAME_MS;
  }
  const rawExit =
    (COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE + width) / speed - 100;
  const exitVpos = Math.max(minimumVpos, Math.ceil(rawExit));
  return vposMs + exitVpos * VPOS_FRAME_MS;
};

export const buildTimeline = (threads: Threads): TimelineComment[] => {
  const pending: PendingTimelineEntry[] = [];
  let sequence = 0;

  for (let threadIndex = 0; threadIndex < threads.length; threadIndex += 1) {
    const thread = threads[threadIndex];
    for (const raw of thread.comments) {
      if (!raw?.body) continue;
      const commands = normalizeCommands(raw.commands);
      const context: CommandParseContext = {
        isPremium: raw.isPremium,
      };
      const info = parseMailCommands(commands, context);
      const style = measureComment(raw.body, info, {
        disableResize: info.disableResize,
        allowWrap: info.loc !== "middle",
      });
      const durationMs = info.durationMs;
      const durationVpos = Math.max(1, Math.round(durationMs / 10));
      const timingPadding = computeTimingPadding(style);
      const baseWidth =
        style.resizedX && style.maxWidth !== undefined
          ? Math.ceil(style.maxWidth)
          : style.contentWidth;
      const timingWidth = baseWidth + timingPadding * 2;
      const enterMs =
        info.loc === "middle"
          ? computeFlowEnterMs(timingWidth, durationVpos, raw.vposMs)
          : raw.vposMs;
      const exitMs =
        info.loc === "middle"
          ? computeFlowExitMs(timingWidth, durationVpos, raw.vposMs)
          : raw.vposMs + durationMs;

      const vpos = Math.round(raw.vposMs / VPOS_FRAME_MS);
      const stylePadding = style.padding;
      const contentWidth = Math.ceil(style.contentWidth);
      const laneCount = Math.max(1, style.lineCount);
      const baseHeight = style.lineHeight * (laneCount - 1) + style.charSize;
      const width = Math.max(1, contentWidth + stylePadding * 2);
      const height = Math.max(1, Math.ceil(baseHeight + stylePadding * 2));
      const owner = thread.fork === "owner";
      const layer = 0;

      pending.push({
        comment: {
          id: `${thread.id}:${raw.id}:${raw.no}`,
          vposMs: raw.vposMs,
          vpos,
          body: raw.body,
          loc: info.loc,
          size: info.size,
          style,
          styleKey: createStyleKey(style),
          durationMs,
          durationVpos,
          isFullWidth: info.isFullWidth,
          enterMs,
          exitMs,
          width,
          height,
          posY: -1,
          owner,
          layer,
        },
        vposMs: raw.vposMs,
        order: raw.no ?? Number.POSITIVE_INFINITY,
        threadIndex,
        sequence,
      });
      sequence += 1;
    }
  }

  pending.sort((a, b) => {
    const aEnter = a.comment.enterMs;
    const bEnter = b.comment.enterMs;
    if (aEnter !== bEnter) return aEnter - bEnter;
    if (a.vposMs !== b.vposMs) return a.vposMs - b.vposMs;
    if (a.order !== b.order) return a.order - b.order;
    if (a.threadIndex !== b.threadIndex) return a.threadIndex - b.threadIndex;
    return a.sequence - b.sequence;
  });

  const result = new Array<TimelineComment>(pending.length);
  for (let i = 0; i < pending.length; i += 1) {
    result[i] = pending[i].comment;
  }
  applyLayout(result);
  return result;
};

export const createIndex = (
  comments: readonly TimelineComment[]
): Float64Array => {
  const index = new Float64Array(comments.length);
  for (let i = 0; i < comments.length; i += 1) {
    index[i] = comments[i]?.vposMs ?? 0;
  }
  return index;
};

export const findFirstIndexAfter = (
  timeline: Float64Array,
  vposMs: number
): number => {
  let low = 0;
  let high = timeline.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (timeline[mid] < vposMs) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};
