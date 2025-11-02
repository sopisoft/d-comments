import { findElement } from "@/lib/dom";
import { logger } from "@/lib/logger";

/**
 * Firefoxで再生開始後やシーク移動後に、映像が止まり音声だけが流れるのを防ぐ
 */
export async function addon_smooth_player() {
  logger.debug("addon_smooth_player");

  const video = (await findElement("video")) as HTMLVideoElement | null;
  if (!video) return;

  video.preload = "auto";
  video.playsInline = true;

  let lastFreezeRemoved: number | null = null;

  function removeFreeze() {
    if (!video) return;
    const now = Date.now();
    if (lastFreezeRemoved && now - lastFreezeRemoved < 500) return;
    lastFreezeRemoved = now;

    const currentTime = video.currentTime;
    const wasPaused = video.paused;
    video.currentTime = Math.max(0, currentTime - 5);
    video.pause();

    setTimeout(() => {
      if (!video) return;
      video.currentTime = currentTime;
      if (!wasPaused) video.play();
    }, 300);
  }

  // 一時停止から6秒以上経過後の再生時にフリーズ解除
  let lastPausedAt: number | null = null;
  video.addEventListener("pause", () => {
    lastPausedAt = Date.now();
  });
  video.addEventListener("play", () => {
    if (lastPausedAt && Date.now() - lastPausedAt > 6000) {
      removeFreeze();
    }
  });

  // timeupdateで逆方向ジャンプ（3秒以上）を検知したらフリーズ解除
  let lastTimeUpdate: number | null = null;
  video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    if (lastTimeUpdate !== null) {
      const diff = lastTimeUpdate - currentTime;
      if (diff > 3) {
        removeFreeze();
      }
    }
    lastTimeUpdate = currentTime;
  });

  removeFreeze();
}
