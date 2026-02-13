import {
  CANVAS_HEIGHT,
  COMMENT_SCALE,
  COMMENT_STAGE_SIZE,
  CONTEXT_STROKE_WIDTH,
  LINE_BREAK_COUNT,
  LINE_COUNTS,
  MIN_FONT_SIZE,
} from './constants';
import type { CommandInfo } from './parser';
import type { CommentSize, CommentStyle } from './types';

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const measurementCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
const measurementContext = measurementCanvas?.getContext('2d', {
  willReadFrequently: true,
});

const ensureContext = (): CanvasRenderingContext2D => {
  if (!measurementContext) throw new Error('Failed to acquire measurement context');
  return measurementContext;
};

const computeCharSizeStage = (size: CommentSize): number => COMMENT_STAGE_SIZE.height / LINE_COUNTS.doubleResized[size];

const computeLineHeightStage = (size: CommentSize, resized: boolean): number => {
  const charSize = computeCharSizeStage(size);
  const defaultLineCount = LINE_COUNTS.default[size];
  if (!resized) return (COMMENT_STAGE_SIZE.height - charSize) / (defaultLineCount - 1);
  const resizedLineCount = LINE_COUNTS.resized[size];
  return (COMMENT_STAGE_SIZE.height - charSize * (defaultLineCount / resizedLineCount)) / (resizedLineCount - 1);
};

type LineSizing = {
  readonly charStage: number;
  readonly lineHeightStage: number;
  readonly widthStage: number;
};

const computeFontStage = (charSizeStage: number): { fontSize: number; scale: number } => {
  const baseSize = charSizeStage * 0.8;
  if (baseSize < MIN_FONT_SIZE) {
    const floored = Math.floor(baseSize);
    if (baseSize >= 1 && floored > 0) return { fontSize: MIN_FONT_SIZE, scale: floored / MIN_FONT_SIZE };
    return { fontSize: MIN_FONT_SIZE, scale: baseSize / MIN_FONT_SIZE };
  }
  return { fontSize: Math.floor(baseSize), scale: 1 };
};

const setMeasurementFont = (fontFamily: string, fontWeight: number, fontSize: number): CanvasRenderingContext2D => {
  const ctx = ensureContext();
  ctx.font = `${fontWeight} ${Math.max(1, fontSize)}px ${fontFamily}`;
  ctx.textBaseline = 'alphabetic';
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
    const target = line.length > 0 ? line : ' ';
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
) => {
  if (settings.disableResize || lineCount < LINE_BREAK_COUNT[size])
    return {
      charStage: defaultCharStage,
      lineHeightStage: defaultLineHeightStage,
    };
  const resizedLineHeightStage = computeLineHeightStage(size, true);
  const ratio = resizedLineHeightStage / defaultLineHeightStage;
  return {
    charStage: defaultCharStage * ratio,
    lineHeightStage: resizedLineHeightStage,
  };
};

const resolveWidthLimitStage = (info: CommandInfo, settings: MeasurementSettings): number | undefined => {
  if (settings.disableResize || info.loc === 'middle') return undefined;
  return info.isFullWidth ? COMMENT_STAGE_SIZE.fullWidth : COMMENT_STAGE_SIZE.width;
};

const enforceWidthLimit = (
  lines: readonly string[],
  fontFamily: string,
  fontWeight: number,
  initialCharStage: number,
  initialLineHeightStage: number,
  widthLimitStage: number | undefined
): LineSizing => {
  const widthStage = measureLinesStage(lines, fontFamily, fontWeight, initialCharStage);
  if (widthLimitStage === undefined || widthStage <= widthLimitStage)
    return {
      charStage: initialCharStage,
      lineHeightStage: initialLineHeightStage,
      widthStage,
    };
  const adjusted = adjustForWidthLimit({
    fontFamily,
    fontWeight,
    initialCharStage,
    initialLineHeightStage,
    lines,
    widthLimitStage,
    widthStage,
  });
  return {
    charStage: adjusted.charStage,
    lineHeightStage: adjusted.lineHeightStage,
    widthStage: adjusted.widthStage,
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
}) => {
  if (widthStage <= 0 || widthLimitStage <= 0)
    return {
      charStage: initialCharStage,
      lineHeightStage: initialLineHeightStage,
      widthStage,
    };

  const ratio = widthLimitStage / widthStage;
  let charStage = Math.max(0.1, initialCharStage * ratio);
  let lineHeightStage = Math.max(0.1, initialLineHeightStage * ratio);
  let measuredWidth = measureLinesStage(lines, fontFamily, fontWeight, charStage);

  for (let guard = 0; measuredWidth > widthLimitStage && guard < 64; guard++) {
    const nextChar = Math.max(0.1, charStage - 1);
    if (nextChar === charStage) break;
    lineHeightStage = Math.max(0.1, lineHeightStage * (nextChar / charStage));
    charStage = nextChar;
    measuredWidth = measureLinesStage(lines, fontFamily, fontWeight, charStage);
  }
  for (let guard = 0; guard < 64; guard++) {
    const nextChar = charStage + 1;
    const nextWidth = measureLinesStage(lines, fontFamily, fontWeight, nextChar);
    if (nextWidth > widthLimitStage) break;
    lineHeightStage = Math.max(0.1, lineHeightStage * (nextChar / charStage));
    charStage = nextChar;
    measuredWidth = nextWidth;
  }
  return { charStage, lineHeightStage, widthStage: measuredWidth };
};

export type MeasurementSettings = {
  readonly disableResize: boolean;
};

export const measureComment = (body: string, info: CommandInfo, settings: MeasurementSettings): CommentStyle => {
  const explicitLines = body.split(/\r?\n/);
  const lines = explicitLines.length > 0 ? explicitLines : [''];
  const lineCount = Math.max(1, lines.length);

  const defaultCharStage = computeCharSizeStage(info.size);
  const defaultLineHeightStage = computeLineHeightStage(info.size, false);

  const { charStage: resizedCharStage, lineHeightStage: resizedLineHeightStage } = applyLineBreakResize(
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

  const { charStage, lineHeightStage, widthStage } = sizing;

  const charSize = charStage * COMMENT_SCALE;
  const lineHeight = lineHeightStage * COMMENT_SCALE;
  const { fontSize: fontSizeStage, scale: hiResScale } = computeFontStage(charStage);
  const fontSize = fontSizeStage * COMMENT_SCALE * hiResScale;
  const laneHeight = (CANVAS_HEIGHT / LINE_COUNTS.default[info.size]) * (lineHeightStage / defaultLineHeightStage);
  const strokeWidth = CONTEXT_STROKE_WIDTH * COMMENT_SCALE;

  const fontOffset = ((charStage - lineHeightStage) / 2 + lineHeightStage * -0.16 + info.font.offset) * COMMENT_SCALE;
  const contentWidth = widthStage * COMMENT_SCALE;

  const fillAlpha = clamp(info.fillAlpha ?? 1, 0, 1);
  const backgroundAlpha = info.background?.alpha;
  const borderAlpha = info.border?.alpha;

  return {
    backgroundAlpha: backgroundAlpha !== undefined ? clamp(backgroundAlpha, 0, 1) : undefined,
    backgroundColor: info.background?.color,
    borderAlpha: borderAlpha !== undefined ? clamp(borderAlpha, 0, 1) : undefined,
    borderColor: info.border?.color,
    borderWidth: info.border?.color !== undefined ? CONTEXT_STROKE_WIDTH * COMMENT_SCALE : undefined,
    charSize,
    contentWidth,
    fill: info.fill,
    fillAlpha,
    fontFamily: info.font.family,
    fontKey: info.font.key,
    fontOffset,
    fontSize,
    fontWeight: info.font.weight,
    hiResScale,
    laneHeight,
    lineCount,
    lineHeight,
    opacity: info.opacity,
    stroke: info.stroke.color,
    strokeAlpha: clamp(info.stroke.alpha ?? 1, 0, 1),
    strokeWidth,
  };
};
