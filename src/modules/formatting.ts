import type { RgbColor } from "@/lib/color";

/**
 * Format time in vpos (milliseconds) to MM:SS format
 */
export const vposToTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

export function toJapaneseNumber(num: number): string {
  if (num >= 10 ** 8) {
    const m = Math.floor(num / 10 ** 8);
    const r = (num % 10 ** 8).toString().slice(0, 1);
    return `${m}.${r} 億`;
  }
  if (num >= 10 ** 4) {
    const w = Math.floor(num / 10 ** 4);
    const r = (num % 10 ** 4).toString().slice(0, 1);
    return `${w}.${r} 万`;
  }
  if (num >= 10 ** 3) {
    const k = Math.floor(num / 10 ** 3);
    const r = (num % 10 ** 3).toString().slice(0, 1);
    return `${k}.${r} 千`;
  }
  return num.toString();
}

const NICORU_RGB: RgbColor = { r: 252, g: 216, b: 66 };

const getNicoruAlpha = (nicoru: number): number => {
  if (nicoru === 0) return 0;
  if (nicoru < 6) return 0.102;
  if (nicoru < 11) return 0.2;
  if (nicoru < 21) return 0.4;
  return 0.6;
};

const rgbaString = (alpha: number): string => `rgba(${NICORU_RGB.r}, ${NICORU_RGB.g}, ${NICORU_RGB.b}, ${alpha})`;

export function nicoruColor(nicoru: number): string {
  return rgbaString(getNicoruAlpha(nicoru));
}
