export const isVideoId = (id: string) => {
  const videoId_prefix = [
    "sm",
    "nm",
    "so",
    "ca",
    "ax",
    "yo",
    "nl",
    "ig",
    "na",
    "cw",
    "z[a-e]",
    "om",
    "sk",
    "yk",
  ];
  const videoId_suffix = ["\\d{1,14}"];
  const videoId = new RegExp(
    `^(${videoId_prefix.join("|")})(${videoId_suffix.join("|")})$`
  );
  return videoId.test(id);
};

export function lengthSecondsToTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toFixed(0)
    .padStart(2, "0");
  const s = (seconds % 60).toFixed(0).padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

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
