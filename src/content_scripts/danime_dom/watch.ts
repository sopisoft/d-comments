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

import { get_work_info } from "./api";

/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 * mediaSession を設定する
 */
export const setWorkInfo = async () => {
  const workInfo = await get_work_info();
  const title = workInfo.data.title;
  const partExp = workInfo.data.partExp;

  document.title = title;
  document
    .querySelector("meta[name=Description]")
    ?.setAttribute("content", partExp);

  const mediaSession = navigator.mediaSession;
  await new Promise((resolve) => {
    (function f() {
      if (document.querySelector(".playButton") === null) {
        setTimeout(f, 100);
      } else {
        resolve(null);
      }
    })();
  });
  const dom_play_button = document.querySelector(".playButton");
  const dom_seekforward_button = document.querySelector(".backButton");
  const dom_seekbackward_button = document.querySelector(".skipButton");
  const dom_prev_track_button = document.querySelector(".prevButton");
  const dom_next_track_button = document.querySelector(".nextButton");
  if (mediaSession) {
    mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: "dアニメストア",
      album: workInfo.data.workTitle,
      artwork: [
        {
          src: workInfo.data.mainScenePath.replace("_1_3.png", "_1_1.png"),
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

    const video = document.querySelector("video");
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
  }
};
