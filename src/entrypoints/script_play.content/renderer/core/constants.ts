export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

export const COMMENT_DRAW_RANGE = 1530;
export const COMMENT_DRAW_PADDING = 195;
export const SCROLL_SPEED_FACTOR = 0.95;

export const COLLISION_RANGE = {
  left: 235,
  right: 1685,
} as const;

export const COLLISION_PADDING = 5;

export const COMMENT_STAGE_SIZE = {
  fullWidth: 683,
  height: 384,
  width: 512,
} as const;

export const COMMENT_SCALE = CANVAS_WIDTH / COMMENT_STAGE_SIZE.fullWidth;

export const LINE_BREAK_COUNT = {
  big: 3,
  medium: 5,
  small: 7,
} as const;

export const LINE_COUNTS = {
  default: {
    big: 8.4,
    medium: 13.1,
    small: 21,
  },
  doubleResized: {
    big: 7.8,
    medium: 11.3,
    small: 16.6,
  },
  resized: {
    big: 16,
    medium: 25.4,
    small: 38,
  },
} as const;

export const MIN_FONT_SIZE = 10;
export const HIRES_COMMENT_CORRECTION = 20;
export const CONTEXT_STROKE_WIDTH = 2.8;
export const CONTEXT_STROKE_COLOR = 0x000000;
export const CONTEXT_STROKE_INVERSION_COLOR = 0xffffff;
export const CONTEXT_STROKE_OPACITY = 0.4;
export const CONTEXT_FILL_LIVE_OPACITY = 0.5;
