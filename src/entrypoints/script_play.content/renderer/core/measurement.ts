import type { CommandInfo } from "./commandParser";
import {
  CANVAS_HEIGHT,
  COMMENT_SCALE,
  COMMENT_STAGE_SIZE,
  CONTEXT_STROKE_WIDTH,
  HIRES_COMMENT_CORRECTION,
  LINE_BREAK_COUNT,
  LINE_COUNTS,
  MIN_FONT_SIZE,
} from "./constants";
import type { CommentLineMetric, CommentSize, CommentStyle } from "./types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const measurementCanvas =
  typeof document !== "undefined" ? document.createElement("canvas") : null;
const measurementContext = measurementCanvas?.getContext("2d", {
  willReadFrequently: true,
});

const ensureContext = () => {
  if (!measurementContext) {
    throw new Error("Failed to acquire measurement context");
  }
  return measurementContext;
};

const computeCharSizeStage = (size: CommentSize): number =>
  COMMENT_STAGE_SIZE.height / LINE_COUNTS.doubleResized[size];

const computeLineHeightStage = (
  size: CommentSize,
  resized: boolean
): number => {
  const charSize = computeCharSizeStage(size);
  const defaultLineCount = LINE_COUNTS.default[size];
  if (!resized) {
    return (COMMENT_STAGE_SIZE.height - charSize) / (defaultLineCount - 1);
  }
  const resizedLineCount = LINE_COUNTS.resized[size];
  return (
    (COMMENT_STAGE_SIZE.height -
      charSize * (defaultLineCount / resizedLineCount)) /
    (resizedLineCount - 1)
  );
};

type LineSizing = {
  readonly charStage: number;
  readonly lineHeightStage: number;
  readonly widthStage: number;
  readonly resizedX: boolean;
};

const computeFontStage = (
  charSizeStage: number
): {
  fontSize: number;
  scale: number;
} => {
  const raw = charSizeStage * 0.8;
  if (raw < MIN_FONT_SIZE) {
    if (raw >= 1) {
      const floored = Math.floor(raw);
      if (floored > 0) {
        return {
          fontSize: MIN_FONT_SIZE,
          scale: floored / MIN_FONT_SIZE,
        };
      }
    }
    return {
      fontSize: MIN_FONT_SIZE,
      scale: raw / MIN_FONT_SIZE,
    };
  }
  return {
    fontSize: Math.floor(raw),
    scale: 1,
  };
};

const setMeasurementFont = (
  fontFamily: string,
  fontWeight: number,
  fontSize: number
) => {
  const ctx = ensureContext();
  ctx.font = `${fontWeight} ${Math.max(1, fontSize)}px ${fontFamily}`;
  ctx.textBaseline = "alphabetic";
  return ctx;
};

const measureLinesStage = (
  lines: readonly string[],
  fontFamily: string,
  fontWeight: number,
  charSizeStage: number
): number => {
  const { fontSize, scale } = computeFontStage(charSizeStage);
  const ctx = setMeasurementFont(fontFamily, fontWeight, fontSize);
  let maxWidth = 0;
  for (const line of lines) {
    const target = line.length > 0 ? line : " ";
    const metrics = ctx.measureText(target);
    const width = Math.ceil(metrics.width * scale);
    if (width > maxWidth) maxWidth = width;
  }
  return maxWidth;
};

const applyLineBreakResize = (
  size: CommentSize,
  lineCount: number,
  defaultCharStage: number,
  defaultLineHeightStage: number,
  settings: MeasurementSettings
): {
  charStage: number;
  lineHeightStage: number;
  resized: boolean;
} => {
  if (settings.disableResize || lineCount < LINE_BREAK_COUNT[size]) {
    return {
      charStage: defaultCharStage,
      lineHeightStage: defaultLineHeightStage,
      resized: false,
    };
  }
  const resizedLineHeightStage = computeLineHeightStage(size, true);
  const ratio = resizedLineHeightStage / defaultLineHeightStage;
  return {
    charStage: defaultCharStage * ratio,
    lineHeightStage: resizedLineHeightStage,
    resized: true,
  };
};

const resolveWidthLimitStage = (
  info: CommandInfo,
  settings: MeasurementSettings
): number | undefined => {
  if (settings.disableResize || info.loc === "middle") return undefined;
  return info.isFullWidth
    ? COMMENT_STAGE_SIZE.fullWidth
    : COMMENT_STAGE_SIZE.width;
};

const enforceWidthLimit = (
  lines: readonly string[],
  fontFamily: string,
  fontWeight: number,
  initialCharStage: number,
  initialLineHeightStage: number,
  widthLimitStage: number | undefined
): LineSizing => {
  let charStage = initialCharStage;
  let lineHeightStage = initialLineHeightStage;
  let resizedX = false;
  let widthStage = measureLinesStage(lines, fontFamily, fontWeight, charStage);

  if (widthLimitStage === undefined || widthStage <= widthLimitStage) {
    return {
      charStage,
      lineHeightStage,
      widthStage,
      resizedX,
    };
  }

  resizedX = true;
  const adjusted = adjustForWidthLimit({
    lines,
    fontFamily,
    fontWeight,
    initialCharStage: charStage,
    initialLineHeightStage: lineHeightStage,
    widthStage,
    widthLimitStage,
  });
  charStage = adjusted.charStage;
  lineHeightStage = adjusted.lineHeightStage;
  widthStage = adjusted.widthStage;

  return {
    charStage,
    lineHeightStage,
    widthStage,
    resizedX,
  };
};

const adjustForWidthLimit = ({
  lines,
  fontFamily,
  fontWeight,
  initialCharStage,
  initialLineHeightStage,
  widthStage,
  widthLimitStage,
}: {
  readonly lines: readonly string[];
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly initialCharStage: number;
  readonly initialLineHeightStage: number;
  readonly widthStage: number;
  readonly widthLimitStage: number;
}): {
  charStage: number;
  lineHeightStage: number;
  widthStage: number;
} => {
  if (widthStage <= 0 || widthLimitStage <= 0) {
    return {
      charStage: initialCharStage,
      lineHeightStage: initialLineHeightStage,
      widthStage,
    };
  }

  let charStage = Math.max(
    0.1,
    initialCharStage * (widthLimitStage / widthStage)
  );
  let lineHeightStage = Math.max(
    0.1,
    initialLineHeightStage * (widthLimitStage / widthStage)
  );
  let measuredWidth = measureLinesStage(
    lines,
    fontFamily,
    fontWeight,
    charStage
  );

  let guard = 0;
  while (measuredWidth > widthLimitStage && guard < 64) {
    const nextChar = Math.max(0.1, charStage - 1);
    if (nextChar === charStage) break;
    const scale = nextChar / charStage;
    charStage = nextChar;
    lineHeightStage = Math.max(0.1, lineHeightStage * scale);
    measuredWidth = measureLinesStage(lines, fontFamily, fontWeight, charStage);
    guard += 1;
  }

  guard = 0;
  while (guard < 64) {
    const nextChar = charStage + 1;
    const nextLineHeight = Math.max(
      0.1,
      lineHeightStage * (nextChar / charStage)
    );
    const nextWidth = measureLinesStage(
      lines,
      fontFamily,
      fontWeight,
      nextChar
    );
    if (nextWidth > widthLimitStage) {
      break;
    }
    charStage = nextChar;
    lineHeightStage = nextLineHeight;
    measuredWidth = nextWidth;
    guard += 1;
  }

  return { charStage, lineHeightStage, widthStage: measuredWidth };
};

const computeHiResPadding = (hiResScale: number, lineCount: number): number =>
  (10 - hiResScale * 10) * ((lineCount + 1) / HIRES_COMMENT_CORRECTION);

const buildLineMetrics = (
  lines: readonly string[],
  lineHeightStage: number,
  fontFamily: string,
  fontWeight: number,
  hiResScale: number,
  fontSizeForContext: number,
  hiResPadding: number,
  fontOffsetStage: number
): {
  lineMetrics: CommentLineMetric[];
  contentWidth: number;
  contentHeight: number;
  contentTop: number;
} => {
  const ctx = setMeasurementFont(fontFamily, fontWeight, fontSizeForContext);
  const stageToPx = COMMENT_SCALE;
  const lineMetrics: CommentLineMetric[] = [];
  let contentWidth = 1;
  let contentTop = Number.POSITIVE_INFINITY;
  let contentBottom = Number.NEGATIVE_INFINITY;

  lines.forEach((input, index) => {
    const text = input ?? "";
    const target = text.length > 0 ? text : " ";
    const metrics = ctx.measureText(target);
    const widthStage = Math.ceil(metrics.width * hiResScale);
    const width = Math.ceil(widthStage * stageToPx);
    const ascentStage =
      (metrics.actualBoundingBoxAscent ??
        metrics.fontBoundingBoxAscent ??
        fontSizeForContext) * hiResScale;
    const descentStage =
      (metrics.actualBoundingBoxDescent ??
        metrics.fontBoundingBoxDescent ??
        fontSizeForContext * 0.2) * hiResScale;
    const ascent = ascentStage * stageToPx;
    const descent = descentStage * stageToPx;
    const baselineStage =
      lineHeightStage * (index + 1 + hiResPadding) + fontOffsetStage;
    const baseline = baselineStage * stageToPx;
    const top = baseline - ascent;
    const bottom = baseline + descent;

    if (width > contentWidth) contentWidth = width;
    if (top < contentTop) contentTop = top;
    if (bottom > contentBottom) contentBottom = bottom;

    lineMetrics.push({
      text,
      width,
      widthStage,
      baseline,
      baselineStage,
      ascent,
      descent,
      top,
      bottom,
    });
  });

  if (!Number.isFinite(contentTop)) contentTop = 0;
  if (!Number.isFinite(contentBottom)) contentBottom = contentTop;

  const contentHeight = Math.max(1, Math.ceil(contentBottom - contentTop));

  return {
    lineMetrics,
    contentWidth,
    contentHeight,
    contentTop,
  };
};

export type MeasurementSettings = {
  readonly disableResize: boolean;
  readonly allowWrap: boolean;
};

export const measureComment = (
  body: string,
  info: CommandInfo,
  settings: MeasurementSettings
): CommentStyle => {
  const explicitLines = body.split(/\r?\n/);
  const lines = explicitLines.length > 0 ? explicitLines : [""];
  const lineCount = Math.max(1, lines.length);

  const defaultCharStage = computeCharSizeStage(info.size);
  const defaultLineHeightStage = computeLineHeightStage(info.size, false);

  const {
    charStage: resizedCharStage,
    lineHeightStage: resizedLineHeightStage,
    resized,
  } = applyLineBreakResize(
    info.size,
    lineCount,
    defaultCharStage,
    defaultLineHeightStage,
    settings
  );

  const widthLimitStage = resolveWidthLimitStage(info, settings);
  const sizing = enforceWidthLimit(
    lines,
    info.font.family,
    info.font.weight,
    resizedCharStage,
    resizedLineHeightStage,
    widthLimitStage
  );

  const charStage = sizing.charStage;
  const lineHeightStage = sizing.lineHeightStage;
  const widthStage = sizing.widthStage;
  const resizedX = sizing.resizedX;
  const resizedY = resized;

  const charSize = charStage * COMMENT_SCALE;
  const lineHeight = lineHeightStage * COMMENT_SCALE;
  const fontSize = charStage * 0.8 * COMMENT_SCALE;
  const laneHeight =
    (CANVAS_HEIGHT / LINE_COUNTS.default[info.size]) *
    (lineHeightStage / defaultLineHeightStage);
  const strokeWidth = CONTEXT_STROKE_WIDTH * COMMENT_SCALE;

  const { fontSize: fontSizeForContext, scale: hiResScale } =
    computeFontStage(charStage);
  const fontOffsetStage =
    (charStage - lineHeightStage) / 2 +
    lineHeightStage * -0.16 +
    info.font.offset;
  const fontOffset = fontOffsetStage * COMMENT_SCALE;
  const hiResPadding = computeHiResPadding(hiResScale, lineCount);

  const { lineMetrics, contentWidth, contentHeight, contentTop } =
    buildLineMetrics(
      lines,
      lineHeightStage,
      info.font.family,
      info.font.weight,
      hiResScale,
      fontSizeForContext,
      hiResPadding,
      fontOffsetStage
    );

  const fillAlpha = clamp(info.fillAlpha ?? 1, 0, 1);
  const strokeAlpha = clamp(info.stroke.alpha ?? 1, 0, 1);
  const backgroundAlpha = info.background?.alpha;
  const borderAlpha = info.border?.alpha;

  const borderWidth =
    info.border?.color !== undefined
      ? CONTEXT_STROKE_WIDTH * COMMENT_SCALE
      : undefined;

  const padded = Boolean(info.background?.color);
  const padding = 0;

  return {
    fontKey: info.font.key,
    fontFamily: info.font.family,
    fontWeight: info.font.weight,
    fontSize,
    fill: info.fill,
    fillAlpha,
    stroke: info.stroke.color,
    strokeAlpha,
    strokeWidth,
    lineHeight,
    laneHeight,
    charSize,
    charSizeStage: charStage,
    lineHeightStage,
    fontOffset,
    fontOffsetStage,
    hiResScale,
    hiResPadding,
    scale: lineHeightStage / defaultLineHeightStage,
    maxWidth: resizedX ? widthStage * COMMENT_SCALE : undefined,
    lineCount,
    contentWidth,
    contentHeight,
    contentTop,
    padding,
    lineMetrics,
    backgroundColor: info.background?.color,
    backgroundAlpha:
      backgroundAlpha !== undefined ? clamp(backgroundAlpha, 0, 1) : undefined,
    borderColor: info.border?.color,
    borderWidth,
    borderAlpha:
      borderAlpha !== undefined ? clamp(borderAlpha, 0, 1) : undefined,
    padded,
    resizedY,
    resizedX,
  };
};
