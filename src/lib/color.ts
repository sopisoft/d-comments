export type RgbColor = { r: number; g: number; b: number };

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));
const clampCh = (v: number): number => Math.round(clamp(v, 0, 255));

const normalizeHex = (hex: string): string => {
  const s = hex.replace("#", "").trim();
  return s.length === 3 ? [...s].map((c) => c + c).join("") : s;
};

const HEX_LIGHT_TEXT = "#F8F9FA";
const HEX_DARK_TEXT = "#0B0B0B";

export const hexToRgb = (hex: string): RgbColor | null => {
  const n = normalizeHex(hex);
  if (!/^[0-9a-f]{6}$/i.test(n)) return null;
  const num = Number.parseInt(n, 16);
  if (Number.isNaN(num)) return null;
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
};

const toHex = (v: number): string => v.toString(16).padStart(2, "0");

export const rgbToHex = ({ r, g, b }: RgbColor): string =>
  `#${toHex(clampCh(r))}${toHex(clampCh(g))}${toHex(clampCh(b))}`;

export const adjustColor = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const ratio = clamp(Math.abs(amount), 0, 1);
  const target = amount >= 0 ? 255 : 0;
  const mix = (ch: number) => clampCh(ch + (target - ch) * ratio);
  return rgbToHex({ r: mix(rgb.r), g: mix(rgb.g), b: mix(rgb.b) });
};

export const compositeRgb = (overlay: RgbColor, alpha: number, base: RgbColor): RgbColor => ({
  r: Math.round(overlay.r * alpha + base.r * (1 - alpha)),
  g: Math.round(overlay.g * alpha + base.g * (1 - alpha)),
  b: Math.round(overlay.b * alpha + base.b * (1 - alpha)),
});

const srgbToLinear = (v: number): number => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = ({ r, g, b }: RgbColor): number =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);

export const contrastRatio = (l1: number, l2: number): number => {
  const [max, min] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (max + 0.05) / (min + 0.05);
};

const LIGHT_TEXT_RGB = hexToRgb(HEX_LIGHT_TEXT) as RgbColor;
const DARK_TEXT_RGB = hexToRgb(HEX_DARK_TEXT) as RgbColor;
const LIGHT_LUM = relativeLuminance(LIGHT_TEXT_RGB);
const DARK_LUM = relativeLuminance(DARK_TEXT_RGB);

export const readableTextOn = (bg: RgbColor): string => {
  const lum = relativeLuminance(bg);
  return contrastRatio(lum, LIGHT_LUM) >= contrastRatio(lum, DARK_LUM) ? HEX_LIGHT_TEXT : HEX_DARK_TEXT;
};

export const readableTextOnHex = (hex: string, fallback = DARK_TEXT_RGB): string =>
  readableTextOn(hexToRgb(hex) ?? fallback);

export const parseHexToRgb = (hex: string, fallback: RgbColor): RgbColor => hexToRgb(hex) ?? fallback;
