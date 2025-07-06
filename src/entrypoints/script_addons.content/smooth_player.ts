import { find_element } from "@/lib/dom";

/**
 * Firefoxで再生開始後やシーク移動後に、映像が止まり音声だけが流れるのを防ぐ
 */
export async function addon_smooth_player() {
  console.log("addon_smooth_player");

  if ("MozAppearance" in document.documentElement.style) {
    const video = (await find_element("video")) as HTMLVideoElement | null;
    if (!video) return;

    video.preload = "auto";
    video.playsInline = true;

    let last_remove_freeze: number | null = null;
    // 一時的にシークして戻す（＝キャッシュを促す）
    async function remove_freeze(video: HTMLVideoElement) {
      const now = Date.now();
      if (last_remove_freeze && now - last_remove_freeze > 500) {
        const currentTime = video.currentTime;
        const paused = video.paused;
        video.currentTime = Math.max(0, currentTime - 5);
        video.pause();

        console.log("cp");
        setTimeout(() => {
          video.currentTime = currentTime;
          if (!paused) video.play();
        }, 300);
      }
      last_remove_freeze = Date.now();
    }

    // 一時停止し 6 秒以上経過したのち、再生を再開したとき
    let last_pause: number | null = null;
    video.addEventListener("pause", () => {
      last_pause = Date.now();
    });
    video.addEventListener("play", () => {
      const now = Date.now();
      if (last_pause && now - last_pause > 6 * 1000) remove_freeze(video);
    });

    let last_time: number | null = null;
    video.addEventListener("timeupdate", () => {
      const currentTime = video.currentTime;
      if (last_time) {
        const d = last_time - currentTime;
        if (last_time && d > 3) {
          remove_freeze(video);
        }
      }
      last_time = currentTime;
    });

    remove_freeze(video);
  }
}
