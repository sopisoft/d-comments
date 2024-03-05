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

import { messages as getMessages, set_messages } from "../state";
import { get_work_info } from "./api";
import { find_element, find_elements } from "./dom";

function push_message(message: Error | { title: string; description: string }) {
  set_messages(getMessages().concat(message));
}

/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 * mediaSession を設定する
 */
export const setWorkInfo = async () => {
  const res = await get_work_info();
  if (res instanceof Error) {
    push_message(res);
    setTimeout(setWorkInfo, 1000);
    return;
  }
  if (!res.data) {
    setTimeout(setWorkInfo, 1000);
    return;
  }

  const { title, partExp, workTitle, mainScenePath } = res.data;

  document.title = title;
  document
    .querySelector("meta[name=Description]")
    ?.setAttribute("content", partExp);

  const mediaSession = navigator.mediaSession;

  const dom_play_button = await find_element(".playButton");
  const dom_seekforward_button = await find_element(".backButton");
  const dom_seekbackward_button = await find_element(".skipButton");
  const dom_prev_track_button = await find_element(".prevButton");
  const dom_next_track_button = await find_element(".nextButton");

  mediaSession.metadata = new MediaMetadata({
    title: title,
    artist: "dアニメストア",
    album: workTitle,
    artwork: [
      {
        src: mainScenePath.replace("_1_3.png", "_1_1.png"),
        sizes: "640x360",
        type: "image/jpeg",
      },
    ],
  });

  mediaSession.setActionHandler("play", () => {
    dom_play_button?.dispatchEvent(new MouseEvent("click"));
  });
  mediaSession.setActionHandler("pause", () => {
    dom_play_button?.dispatchEvent(new MouseEvent("click"));
  });
  mediaSession.setActionHandler("seekbackward", () => {
    dom_seekbackward_button?.dispatchEvent(new MouseEvent("click"));
  });
  mediaSession.setActionHandler("seekforward", () => {
    dom_seekforward_button?.dispatchEvent(new MouseEvent("click"));
  });
  mediaSession.setActionHandler("previoustrack", () => {
    dom_prev_track_button?.dispatchEvent(new MouseEvent("click"));
  });
  mediaSession.setActionHandler("nexttrack", () => {
    dom_next_track_button?.dispatchEvent(new MouseEvent("click"));
  });

  const video = await find_element("video");
  if (video) {
    video.addEventListener("play", () => {
      mediaSession.playbackState = "playing";
    });
    video.addEventListener("pause", () => {
      mediaSession.playbackState = "paused";
    });
    video.addEventListener("ended", () => {
      mediaSession.playbackState = "none";
    });
  }
};

/**
 * Firefoxで再生開始後やシーク移動後に、映像が止まり音声だけが流れるのを防ぐ
 * Inspired by dアニメストア スムーズプレイヤー
 * @see https://github.com/hamachi25/dAnimeSmoothPlayer
 */
export async function smooth_player() {
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
