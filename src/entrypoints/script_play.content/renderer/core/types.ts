import type { StandardFontName } from "./fontConfig";

export type CommentLocation = "top" | "middle" | "bottom";

export type CommentSize = "big" | "medium" | "small";

export type CommentLineMetric = {
  text: string;
  width: number;
  widthStage: number;
  baseline: number;
  baselineStage: number;
  ascent: number;
  descent: number;
  top: number;
  bottom: number;
};

export type CommentStyle = {
  fontKey: StandardFontName;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  fill: number;
  fillAlpha: number;
  stroke: number;
  strokeAlpha: number;
  strokeWidth: number;
  lineHeight: number;
  laneHeight: number;
  charSize: number;
  charSizeStage: number;
  lineHeightStage: number;
  fontOffset: number;
  fontOffsetStage: number;
  hiResScale: number;
  hiResPadding: number;
  scale: number;
  maxWidth?: number;
  lineCount: number;
  contentWidth: number;
  contentHeight: number;
  contentTop: number;
  padding: number;
  lineMetrics: ReadonlyArray<CommentLineMetric>;
  backgroundColor?: number;
  backgroundAlpha?: number;
  borderColor?: number;
  borderWidth?: number;
  borderAlpha?: number;
  padded: boolean;
  resizedY: boolean;
  resizedX: boolean;
};

export type TimelineComment = {
  id: string;
  vposMs: number;
  vpos: number;
  body: string;
  loc: CommentLocation;
  size: CommentSize;
  style: CommentStyle;
  styleKey: string;
  durationMs: number;
  durationVpos: number;
  isFullWidth: boolean;
  enterMs: number;
  exitMs: number;
  width: number;
  height: number;
  posY: number;
  owner: boolean;
  layer: number;
};
