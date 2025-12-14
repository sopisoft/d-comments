import type { Threads } from "@/types/api";
import { CANVAS_WIDTH, COMMENT_DRAW_PADDING, COMMENT_DRAW_RANGE, NAKA_COMMENT_SPEED_OFFSET } from "./constants";
import { applyLayout } from "./layout";
import { measureComment } from "./measurement";
import { parseMailCommands } from "./parser";
import type { CommentStyle, TimelineComment } from "./types";

type PendingTimelineEntry = {
  comment: TimelineComment;
  vposMs: number;
  order: number;
  threadIndex: number;
  sequence: number;
};

const normalizeCommands = (commands: readonly string[] | undefined): readonly string[] => commands ?? [];

const createStyleKey = (s: CommentStyle): string =>
  `${s.fontFamily}|${s.fontWeight}|${s.fontSize}|${s.fill}|${s.fillAlpha}|${
    s.stroke
  }|${s.strokeAlpha}|${s.strokeWidth}|${s.lineHeight}|${s.laneHeight}|${
    s.charSize
  }|${s.lineHeightStage}|${s.scale}|${s.backgroundColor ?? ""}|${
    s.backgroundAlpha ?? ""
  }|${s.borderColor ?? ""}|${s.borderWidth ?? 0}|${s.borderAlpha ?? ""}|${
    s.padding
  }|${+s.padded}|${+s.resizedY}|${+s.resizedX}`;

const applyFontScale = (style: CommentStyle, fontScale: number): CommentStyle => {
  if (fontScale === 1) return style;
  const scaledLineMetrics = style.lineMetrics.map((metric) => ({
    ...metric,
    width: metric.width * fontScale,
    baseline: metric.baseline * fontScale,
    ascent: metric.ascent * fontScale,
    descent: metric.descent * fontScale,
    top: metric.top * fontScale,
    bottom: metric.bottom * fontScale,
  }));
  return {
    ...style,
    fontSize: style.fontSize * fontScale,
    strokeWidth: style.strokeWidth * fontScale,
    lineHeight: style.lineHeight * fontScale,
    laneHeight: style.laneHeight * fontScale,
    charSize: style.charSize * fontScale,
    fontOffset: style.fontOffset * fontScale,
    padding: style.padding * fontScale,
    contentWidth: style.contentWidth * fontScale,
    contentHeight: style.contentHeight * fontScale,
    contentTop: style.contentTop * fontScale,
    maxWidth: style.maxWidth !== undefined ? style.maxWidth * fontScale : undefined,
    borderWidth: style.borderWidth !== undefined ? style.borderWidth * fontScale : undefined,
    lineMetrics: scaledLineMetrics,
  };
};

const FLOW_MIN_LEAD_VPOS = 160;
const FLOW_EXIT_EXTENSION_VPOS = 125;
const VPOS_FRAME_MS = 10;

const computeTimingPadding = (style: CommentStyle): number =>
  style.padded ? Math.max(4, Math.round(style.lineHeight * 0.1)) : 0;

const computeFlowSpeed = (width: number, durationVpos: number): number => {
  const denom = durationVpos + 100;
  return denom > 0 ? (COMMENT_DRAW_RANGE + width * NAKA_COMMENT_SPEED_OFFSET) / denom : 0;
};

const computeFlowEnterMs = (width: number, durationVpos: number, vposMs: number): number => {
  const speed = computeFlowSpeed(width, durationVpos);
  if (speed <= 0) return Math.max(0, vposMs);
  const rawLead = (COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE - (CANVAS_WIDTH - width)) / speed - 100;
  return Math.max(0, vposMs + Math.min(-FLOW_MIN_LEAD_VPOS, Math.floor(rawLead)) * VPOS_FRAME_MS);
};

const computeFlowExitMs = (width: number, durationVpos: number, vposMs: number): number => {
  const speed = computeFlowSpeed(width, durationVpos);
  const minVpos = durationVpos + FLOW_EXIT_EXTENSION_VPOS;
  if (speed <= 0) return vposMs + minVpos * VPOS_FRAME_MS;
  const rawExit = (COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE + width) / speed - 100;
  return vposMs + Math.max(minVpos, Math.ceil(rawExit)) * VPOS_FRAME_MS;
};

export const buildTimeline = (threads: Threads, fontScale: number): TimelineComment[] => {
  const pending: PendingTimelineEntry[] = [];
  let sequence = 0;

  for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
    const thread = threads[threadIndex];
    const owner = thread.fork === "owner";
    for (const raw of thread.comments) {
      if (!raw?.body) continue;
      const info = parseMailCommands(normalizeCommands(raw.commands), {
        isPremium: raw.isPremium,
      });
      const measuredStyle = measureComment(raw.body, info, {
        disableResize: info.disableResize,
        allowWrap: info.loc !== "middle",
      });
      const style = applyFontScale(measuredStyle, fontScale);
      const durationVpos = Math.max(1, Math.round(info.durationMs / 10));
      const timingPadding = computeTimingPadding(style);
      const baseWidth = style.resizedX && style.maxWidth !== undefined ? Math.ceil(style.maxWidth) : style.contentWidth;
      const timingWidth = baseWidth + timingPadding * 2;
      const isMiddle = info.loc === "middle";
      const enterMs = isMiddle ? computeFlowEnterMs(timingWidth, durationVpos, raw.vposMs) : raw.vposMs;
      const exitMs = isMiddle ? computeFlowExitMs(timingWidth, durationVpos, raw.vposMs) : raw.vposMs + info.durationMs;
      const laneCount = Math.max(1, style.lineCount);
      const width = Math.max(1, Math.ceil(style.contentWidth) + style.padding * 2);
      const height = Math.max(1, Math.ceil(style.lineHeight * (laneCount - 1) + style.charSize + style.padding * 2));

      pending.push({
        comment: {
          id: `${thread.id}:${raw.id}:${raw.no}`,
          vposMs: raw.vposMs,
          vpos: Math.round(raw.vposMs / VPOS_FRAME_MS),
          body: raw.body,
          loc: info.loc,
          size: info.size,
          style,
          styleKey: createStyleKey(style),
          durationMs: info.durationMs,
          durationVpos,
          isFullWidth: info.isFullWidth,
          enterMs,
          exitMs,
          width,
          height,
          posY: -1,
          owner,
          layer: 0,
        },
        vposMs: raw.vposMs,
        order: raw.no ?? Number.POSITIVE_INFINITY,
        threadIndex,
        sequence: sequence++,
      });
    }
  }

  pending.sort((a, b) =>
    a.comment.enterMs !== b.comment.enterMs
      ? a.comment.enterMs - b.comment.enterMs
      : a.vposMs !== b.vposMs
        ? a.vposMs - b.vposMs
        : a.order !== b.order
          ? a.order - b.order
          : a.threadIndex !== b.threadIndex
            ? a.threadIndex - b.threadIndex
            : a.sequence - b.sequence
  );

  const result = pending.map((p) => p.comment);
  applyLayout(result);
  return result;
};

export const createIndex = (comments: readonly TimelineComment[]): Float64Array => {
  const index = new Float64Array(comments.length);
  for (let i = 0; i < comments.length; i++) index[i] = comments[i]?.vposMs ?? 0;
  return index;
};

export const findFirstIndexAfter = (timeline: Float64Array, vposMs: number): number => {
  let low = 0;
  let high = timeline.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (timeline[mid] < vposMs) low = mid + 1;
    else high = mid;
  }
  return low;
};
