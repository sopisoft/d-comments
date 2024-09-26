/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/

import { find_element, find_elements } from "@/lib/dom";

/**
 * Firefoxで再生開始後やシーク移動後に、映像が止まり音声だけが流れるのを防ぐ
 * Thanks to dアニメストア スムーズプレイヤー (licensed under [MIT](https://opensource.org/license/mit)
 * @see https://github.com/hamachi25/dAnimeSmoothPlayer
 */
export async function smooth_player() {
  console.log("addon_smooth_player");

  if ("MozAppearance" in document.documentElement.style) {
    const video = (await find_element("video")) as HTMLVideoElement | undefined;
    if (!video) return;

    async function smooth(t = 300) {
      if (!video) return;
      const observer = new MutationObserver(() => {
        observer.disconnect();
        const time = video.currentTime;
        video.currentTime = time - 3;
        video.pause();
        setTimeout(() => {
          video.currentTime = time;
          video.play();
        }, t);
      });
      const time = await find_element("#time");
      if (time) observer.observe(time, { childList: true });
    }

    // シークバーをクリックしたとき
    const seekbar = await find_element(".seekArea");
    seekbar?.addEventListener("mouseup", () => {
      smooth();
    });

    // シークバー下の戻るボタンを押したとき
    const buttons = await find_elements(".back.mainButton button");
    for (const button of buttons) {
      button.addEventListener("click", () => {
        smooth();
      });
    }

    // 左矢印キー or jキーを押したとき
    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key === "j") {
        smooth();
      }
    });

    // 一時停止し 6 秒以上経過したのち、再生を再開したとき
    let last_pause: number | null = null;
    video.addEventListener("pause", () => {
      last_pause = new Date().getTime();
    });
    video.addEventListener("play", () => {
      const now = new Date().getTime();
      if (last_pause && now - last_pause > 6 * 1000) smooth();
    });

    smooth();
  }
}
