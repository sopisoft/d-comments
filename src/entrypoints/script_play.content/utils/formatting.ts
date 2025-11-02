/**
 * Format time in vpos (milliseconds) to MM:SS format
 */
export function vposToTime(vpos: number): string {
  const minutes = Math.floor(vpos / 60000);
  const seconds = Math.floor((vpos % 60000) / 1000);
  const minStr = String(minutes).padStart(2, "0");
  const secStr = String(seconds).padStart(2, "0");
  return `${minStr}:${secStr}`;
}

/**
 * Format date to Japanese format (YYYY/MM/DD HH:mm)
 */
export function toJPDateFormat(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * Get current font size from root element
 */
export function getFontSize(): number {
  return Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/**
 * Get nicoru background color based on count
 */
export function nicoruColor(nicoru: number): string {
  const colors = {
    lv0: "rgba(255, 216, 66, 0)",
    lv1: "rgba(252, 216, 66, 0.102)",
    lv2: "rgba(252, 216, 66, 0.2)",
    lv3: "rgba(252, 216, 66, 0.4)",
    lv4: "rgba(252, 216, 66, 0.6)",
  };

  if (nicoru === 0) return colors.lv0;
  if (nicoru < 6) return colors.lv1;
  if (nicoru < 11) return colors.lv2;
  if (nicoru < 21) return colors.lv3;
  return colors.lv4;
}
