const clampValue = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export type RGBAColor = {
  color: number;
  alpha?: number;
};

export const COLOR_MAP: Record<string, number> = {
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

const HEX_WITH_ALPHA = /^(?:#|0x)?([0-9a-f]{6})([0-9a-f]{2})$/i;
const HEX_SHORT = /^(?:#|0x)?([0-9a-f]{3,4})$/i;
const HEX_LONG = /^(?:#|0x)?([0-9a-f]{6})$/i;
const RGBA_PATTERN = /^rgba?\(([^)]+)\)$/i;
const HEX_LETTER_PATTERN = /[a-f]/i;

const parseIntSafe = (value: string, radix: number): number | null => {
  const parsed = Number.parseInt(value, radix);
  return Number.isNaN(parsed) ? null : parsed;
};

const expandHex = (v: string): string =>
  v
    .split("")
    .map((ch) => ch + ch)
    .join("");

const parseHexColor = (token: string, allowAlpha: boolean): RGBAColor | null => {
  const short = token.match(HEX_SHORT);
  if (short) {
    const expanded = expandHex(short[1]);
    if (!allowAlpha && expanded.length === 8) return null;
    const color = Number.parseInt(expanded.slice(0, 6), 16) & 0xffffff;
    if (expanded.length === 8) {
      return {
        color,
        alpha: clampValue(Number.parseInt(expanded.slice(6, 8), 16) / 255, 0, 1),
      };
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
  const [rRaw, gRaw, bRaw, aRaw] = match[1].split(",").map((part) => part.trim());
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

export const parseCommandColorOverride = (value: string): RGBAColor | null => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const normalized = trimmed.toLowerCase();
  const named = COLOR_MAP[normalized];
  if (named !== undefined) return { color: named };

  if (normalized.startsWith("rgba(") || normalized.startsWith("rgb(")) {
    return parseRgbaColor(trimmed);
  }

  const hasExplicitPrefix = normalized.startsWith("#") || normalized.startsWith("0x");
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

export type CommandParseContext = {
  readonly isPremium: boolean;
};

export const parseColorToken = (token: string, ctx: CommandParseContext, allowAlpha: boolean): RGBAColor | null => {
  const named = COLOR_MAP[token];
  if (named !== undefined) return { color: named };
  if (ctx.isPremium) {
    const stripped = stripColorPrefix(token);
    if (token.startsWith("#") || token.startsWith("0x") || HEX_LETTER_PATTERN.test(stripped)) {
      const premiumColor = parseHexColor(token, allowAlpha) ?? parseRgbaColor(token);
      if (premiumColor !== null) return premiumColor;
    } else if (token.startsWith("rgba(") || token.startsWith("rgb(")) {
      const premiumColor = parseRgbaColor(token);
      if (premiumColor !== null) return premiumColor;
    }
  }
  return null;
};
