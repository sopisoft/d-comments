import {
  CONTEXT_FILL_LIVE_OPACITY,
  CONTEXT_STROKE_COLOR,
  CONTEXT_STROKE_INVERSION_COLOR,
  CONTEXT_STROKE_OPACITY,
} from "./constants";
import {
  type FontAttributes,
  getFontDefinitions,
  type StandardFontName,
} from "./fontConfig";
import type { CommentLocation, CommentSize } from "./types";

const clampValue = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export type RGBAColor = {
  color: number;
  alpha?: number;
};

export type CommandParseContext = {
  readonly isPremium: boolean;
};

export type CommandInfo = {
  size: CommentSize;
  loc: CommentLocation;
  font: {
    key: StandardFontName;
    family: string;
    weight: number;
    offset: number;
  };
  fill: number;
  fillAlpha?: number;
  stroke: RGBAColor;
  background?: RGBAColor;
  border?: RGBAColor;
  durationMs: number;
  isFullWidth: boolean;
  disableResize: boolean;
};

const DEFAULT_FILL = 0xffffff;

const FONT_DEFINITIONS: Record<StandardFontName, FontAttributes> =
  getFontDefinitions();

const FONT_ALIAS_MAP: Record<string, StandardFontName> = {
  defont: "defont",
  gothic: "gothic",
  mincho: "mincho",
};

const COLOR_MAP: Record<string, number> = {
  white: 0xffffff,
  red: 0xff0000,
  pink: 0xff8080,
  orange: 0xffc000,
  yellow: 0xffff00,
  green: 0x00ff00,
  cyan: 0x00ffff,
  blue: 0x0000ff,
  purple: 0xc000ff,
  black: 0x000000,
  white2: 0xcccc99,
  niconicowhite: 0xcccc99,
  red2: 0xcc0033,
  truered: 0xcc0033,
  pink2: 0xff33cc,
  orange2: 0xff6600,
  passionorange: 0xff6600,
  yellow2: 0x999900,
  madyellow: 0x999900,
  green2: 0x00cc66,
  elementalgreen: 0x00cc66,
  cyan2: 0x00cccc,
  blue2: 0x3399ff,
  marinblue: 0x3399ff,
  marineblue: 0x3399ff,
  trueblue: 0x3399ff,
  purple2: 0x6633cc,
  nobleviolet: 0x6633cc,
  black2: 0x666666,
  redpurple: 0xcc00ff,
  evil: 0x330000,
  sea: 0x3399ff,
  sakura: 0xffb7c5,
  gold: 0xffc500,
  yellowgreen: 0x99cc00,
  bluegreen: 0x00cc99,
  greenyellow: 0xc0ff00,
  mikan: 0xffa500,
};

const TOKEN_SPLIT = /\s+/;

const HEX_WITH_ALPHA = /^(?:#|0x)?([0-9a-f]{6})([0-9a-f]{2})$/i;
const HEX_SHORT = /^(?:#|0x)?([0-9a-f]{3,4})$/i;
const HEX_LONG = /^(?:#|0x)?([0-9a-f]{6})$/i;
const RGBA_PATTERN = /^rgba?\(([^)]+)\)$/i;
const HEX_LETTER_PATTERN = /[a-f]/i;

const parseIntSafe = (value: string, radix: number): number | null => {
  const parsed = Number.parseInt(value, radix);
  return Number.isNaN(parsed) ? null : parsed;
};

const expandHex = (value: string): string =>
  value
    .split("")
    .map((ch) => ch + ch)
    .join("");

const parseHexColor = (
  token: string,
  allowAlpha: boolean
): RGBAColor | null => {
  const short = token.match(HEX_SHORT);
  if (short) {
    const expanded = expandHex(short[1]);
    if (!allowAlpha && expanded.length === 8) return null;
    const color = Number.parseInt(expanded.slice(0, 6), 16) & 0xffffff;
    if (expanded.length === 8) {
      const alpha = Number.parseInt(expanded.slice(6, 8), 16) / 255;
      return { color, alpha: clampValue(alpha, 0, 1) };
    }
    return { color };
  }
  const hex = token.match(HEX_LONG);
  if (hex) {
    return { color: Number.parseInt(hex[1], 16) & 0xffffff };
  }
  const withAlpha = token.match(HEX_WITH_ALPHA);
  if (allowAlpha && withAlpha) {
    const color = Number.parseInt(withAlpha[1], 16) & 0xffffff;
    const alpha = Number.parseInt(withAlpha[2], 16) / 255;
    return { color, alpha: clampValue(alpha, 0, 1) };
  }
  return null;
};

const parseRgbaColor = (token: string): RGBAColor | null => {
  const match = token.match(RGBA_PATTERN);
  if (!match) return null;
  const [rRaw, gRaw, bRaw, aRaw] = match[1]
    .split(",")
    .map((part) => part.trim());
  const r = parseIntSafe(rRaw, 10);
  const g = parseIntSafe(gRaw, 10);
  const b = parseIntSafe(bRaw, 10);
  if (r === null || g === null || b === null) return null;
  const color = ((r & 255) << 16) | ((g & 255) << 8) | (b & 255);
  if (aRaw === undefined) return { color };
  const alpha = Number.parseFloat(aRaw);
  if (Number.isNaN(alpha)) return { color };
  return { color, alpha: clampValue(alpha, 0, 1) };
};

const stripColorPrefix = (input: string): string => {
  if (input.startsWith("#")) return input.slice(1);
  if (input.startsWith("0x")) return input.slice(2);
  return input;
};

const parseCommandColorOverride = (value: string): RGBAColor | null => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const normalized = trimmed.toLowerCase();
  const named = COLOR_MAP[normalized];
  if (named !== undefined) return { color: named };

  if (normalized.startsWith("rgba(") || normalized.startsWith("rgb(")) {
    return parseRgbaColor(trimmed);
  }

  const hasExplicitPrefix =
    normalized.startsWith("#") || normalized.startsWith("0x");
  const stripped = stripColorPrefix(trimmed);
  const looksLikeHex = /^[0-9a-f]{3,4}$/i.test(stripped);
  const hasHexHint = HEX_LETTER_PATTERN.test(stripped);

  if (!hasExplicitPrefix && !hasHexHint) {
    return null;
  }

  const direct = parseHexColor(trimmed, true);
  if (direct !== null) return direct;
  if (!hasExplicitPrefix && looksLikeHex) {
    return parseHexColor(`#${stripped}`, true);
  }
  return null;
};

export const parseColorToken = (
  token: string,
  ctx: CommandParseContext,
  allowAlpha: boolean
): RGBAColor | null => {
  const named = COLOR_MAP[token];
  if (named !== undefined) return { color: named };
  if (ctx.isPremium) {
    const stripped = stripColorPrefix(token);
    if (
      token.startsWith("#") ||
      token.startsWith("0x") ||
      HEX_LETTER_PATTERN.test(stripped)
    ) {
      const premiumColor =
        parseHexColor(token, allowAlpha) ?? parseRgbaColor(token);
      if (premiumColor !== null) return premiumColor;
    } else if (token.startsWith("rgba(") || token.startsWith("rgb(")) {
      const premiumColor = parseRgbaColor(token);
      if (premiumColor !== null) return premiumColor;
    }
  }
  return null;
};

const tokenize = (commands: readonly string[]): string[] => {
  const tokens: string[] = [];
  for (const command of commands) {
    if (!command) continue;
    for (const token of command.split(TOKEN_SPLIT)) {
      const trimmed = token.trim();
      if (trimmed.length > 0) tokens.push(trimmed.toLowerCase());
    }
  }
  return tokens;
};

const resolveSize = (tokens: readonly string[]): CommentSize => {
  if (tokens.includes("big")) return "big";
  if (tokens.includes("small")) return "small";
  return "medium";
};

const resolveLocation = (tokens: readonly string[]): CommentLocation => {
  if (tokens.includes("ue")) return "top";
  if (tokens.includes("shita")) return "bottom";
  return "middle";
};

const cloneFont = (font: {
  key: StandardFontName;
  family: string;
  weight: number;
  offset: number;
}) => ({
  key: font.key,
  family: font.family,
  weight: font.weight,
  offset: font.offset,
});

const resolveFont = (tokens: readonly string[]) => {
  for (const token of tokens) {
    const key = FONT_ALIAS_MAP[token];
    if (key) return cloneFont(FONT_DEFINITIONS[key]);
  }
  return cloneFont(FONT_DEFINITIONS.defont);
};

const resolveFill = (
  tokens: readonly string[],
  ctx: CommandParseContext
): number => {
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const token = tokens[i];
    const parsed = parseColorToken(token, ctx, false);
    if (parsed) return parsed.color;
    const override = parseCommandColorOverride(token);
    if (override) return override.color;
  }
  return DEFAULT_FILL;
};

const createDefaultInfo = (): CommandInfo => ({
  size: "medium",
  loc: "middle",
  font: cloneFont(FONT_DEFINITIONS.defont),
  fill: DEFAULT_FILL,
  stroke: { color: CONTEXT_STROKE_COLOR, alpha: CONTEXT_STROKE_OPACITY },
  durationMs: 3000,
  isFullWidth: false,
  disableResize: false,
});

const clampDuration = (valueMs: number): number => {
  if (!Number.isFinite(valueMs) || Number.isNaN(valueMs)) return 3000;
  return clampValue(Math.round(valueMs), 100, 120000);
};

const parseDuration = (token: string): number | null => {
  if (!token.startsWith("@")) return null;
  const seconds = Number(token.slice(1));
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  return Math.round(seconds * 1000);
};

export const parseMailCommands = (
  commands: readonly string[],
  ctx: CommandParseContext
): CommandInfo => {
  const tokens = tokenize(commands);
  const info = createDefaultInfo();

  info.size = resolveSize(tokens);
  info.loc = resolveLocation(tokens);
  info.font = resolveFont(tokens);
  info.fill = resolveFill(tokens, ctx);

  let explicitFillAlpha = false;
  for (const token of tokens) {
    if (token === "ender") {
      info.disableResize = true;
      continue;
    }
    if (token === "long") {
      info.durationMs = clampDuration(6000);
      continue;
    }
    if (token === "full") {
      info.durationMs = clampDuration(6000);
      info.isFullWidth = true;
      continue;
    }
    if (token === "verylong") {
      info.durationMs = clampDuration(8000);
      continue;
    }
    const duration = parseDuration(token);
    if (duration !== null) {
      info.durationMs = clampDuration(duration);
      continue;
    }
    if (token.startsWith("nico:stroke:")) {
      const value = token.slice("nico:stroke:".length);
      const parsed =
        parseColorToken(value, ctx, true) ?? parseCommandColorOverride(value);
      if (parsed) info.stroke = parsed;
      continue;
    }
    if (token.startsWith("nico:fill:")) {
      const value = token.slice("nico:fill:".length);
      const parsed =
        parseColorToken(value, ctx, true) ?? parseCommandColorOverride(value);
      if (parsed) info.background = parsed;
      continue;
    }
    if (token.startsWith("nico:waku:")) {
      const value = token.slice("nico:waku:".length);
      const parsed =
        parseColorToken(value, ctx, true) ?? parseCommandColorOverride(value);
      if (parsed) info.border = parsed;
      continue;
    }
    if (token.startsWith("nico:opacity:")) {
      const value = Number(token.slice("nico:opacity:".length));
      if (!Number.isNaN(value)) {
        info.fillAlpha = clampValue(value, 0, 1);
        explicitFillAlpha = true;
      }
      continue;
    }
    if (token === "_live" && !explicitFillAlpha) {
      info.fillAlpha = CONTEXT_FILL_LIVE_OPACITY;
    }
  }

  if (!info.stroke || info.stroke.color === undefined) {
    const fallback =
      info.fill === 0x000000
        ? CONTEXT_STROKE_INVERSION_COLOR
        : CONTEXT_STROKE_COLOR;
    info.stroke = {
      color: fallback,
      alpha: CONTEXT_STROKE_OPACITY,
    };
  } else if (info.stroke.alpha === undefined) {
    info.stroke = { ...info.stroke, alpha: CONTEXT_STROKE_OPACITY };
  }

  return info;
};
