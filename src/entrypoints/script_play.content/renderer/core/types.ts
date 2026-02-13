import type { StandardFontName } from './fonts';

export type CommentLocation = 'top' | 'middle' | 'bottom';

export type CommentSize = 'big' | 'medium' | 'small';

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
  fontOffset: number;
  hiResScale: number;
  lineCount: number;
  contentWidth: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  borderColor?: number;
  borderWidth?: number;
  borderAlpha?: number;
  opacity?: number;
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
  invisible?: boolean;
};
