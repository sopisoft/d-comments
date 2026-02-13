const clampValue = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export type RGBAColor = {
  color: number;
  alpha?: number;
};

export const COLOR_MAP: Record<string, number> = {
  black: 0x000000,
  black2: 0x666666,
  blue: 0x0000ff,
  blue2: 0x3399ff,
  bluegreen: 0x00cc99,
  cyan: 0x00ffff,
  cyan2: 0x00cccc,
  elementalgreen: 0x00cc66,
  evil: 0x330000,
  gold: 0xffc500,
  green: 0x00ff00,
  green2: 0x00cc66,
  greenyellow: 0xc0ff00,
  madyellow: 0x999900,
  marinblue: 0x3399ff,
  marineblue: 0x3399ff,
  mikan: 0xffa500,
  niconicowhite: 0xcccc99,
  nobleviolet: 0x6633cc,
  orange: 0xffc000,
  orange2: 0xff6600,
  passionorange: 0xff6600,
  pink: 0xff8080,
  pink2: 0xff33cc,
  purple: 0xc000ff,
  purple2: 0x6633cc,
  red: 0xff0000,
  red2: 0xcc0033,
  redpurple: 0xcc00ff,
  sakura: 0xffb7c5,
  sea: 0x3399ff,
  trueblue: 0x3399ff,
  truered: 0xcc0033,
  white: 0xffffff,
  white2: 0xcccc99,
  yellow: 0xffff00,
  yellow2: 0x999900,
  yellowgreen: 0x99cc00,
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

const expandHex = (hex: string): string =>
  hex
    .split('')
    .map((ch) => ch + ch)
    .join('');

const parseHexColor = (token: string, allowAlpha: boolean): RGBAColor | null => {
  const shortMatch = token.match(HEX_SHORT);
  if (shortMatch) {
    const expanded = expandHex(shortMatch[1]);
    if (!allowAlpha && expanded.length === 8) return null;
    const color = Number.parseInt(expanded.slice(0, 6), 16) & 0xffffff;
    if (expanded.length === 8) {
      return {
        alpha: clampValue(Number.parseInt(expanded.slice(6, 8), 16) / 255, 0, 1),
        color,
      };
    }
    return { color };
  }
  const longMatch = token.match(HEX_LONG);
  if (longMatch) {
    return { color: Number.parseInt(longMatch[1], 16) & 0xffffff };
  }
  const withAlphaMatch = token.match(HEX_WITH_ALPHA);
  if (allowAlpha && withAlphaMatch) {
    const color = Number.parseInt(withAlphaMatch[1], 16) & 0xffffff;
    const alpha = Number.parseInt(withAlphaMatch[2], 16) / 255;
    return { alpha: clampValue(alpha, 0, 1), color };
  }
  return null;
};

const parseRgbaColor = (token: string): RGBAColor | null => {
  const match = token.match(RGBA_PATTERN);
  if (!match) return null;
  const [redRaw, greenRaw, blueRaw, alphaRaw] = match[1].split(',').map((part) => part.trim());
  const red = parseIntSafe(redRaw, 10);
  const green = parseIntSafe(greenRaw, 10);
  const blue = parseIntSafe(blueRaw, 10);
  if (red === null || green === null || blue === null) return null;
  const color = ((red & 255) << 16) | ((green & 255) << 8) | (blue & 255);
  if (alphaRaw === undefined) return { color };
  const alpha = Number.parseFloat(alphaRaw);
  if (Number.isNaN(alpha)) return { color };
  return { alpha: clampValue(alpha, 0, 1), color };
};

const stripColorPrefix = (input: string): string => {
  if (input.startsWith('#')) return input.slice(1);
  if (input.startsWith('0x')) return input.slice(2);
  return input;
};

export const parseCommandColorOverride = (value: string): RGBAColor | null => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const normalized = trimmed.toLowerCase();
  const named = COLOR_MAP[normalized];
  if (named !== undefined) return { color: named };

  if (normalized.startsWith('rgba(') || normalized.startsWith('rgb(')) {
    return parseRgbaColor(trimmed);
  }

  const hasExplicitPrefix = normalized.startsWith('#') || normalized.startsWith('0x');
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
    if (token.startsWith('#') || token.startsWith('0x') || HEX_LETTER_PATTERN.test(stripped)) {
      const premiumColor = parseHexColor(token, allowAlpha) ?? parseRgbaColor(token);
      if (premiumColor !== null) return premiumColor;
    } else if (token.startsWith('rgba(') || token.startsWith('rgb(')) {
      const premiumColor = parseRgbaColor(token);
      if (premiumColor !== null) return premiumColor;
    }
  }
  return null;
};
