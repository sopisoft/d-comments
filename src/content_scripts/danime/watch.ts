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
import { find_element } from "./dom";

/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 * mediaSession を設定する
 */
export const setWorkInfo = async () => {
  const { data } = await get_work_info();
  const { title, partExp } = data;

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

  if (mediaSession) {
    mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: "dアニメストア",
      album: data.workTitle,
      artwork: [
        {
          src: data.mainScenePath.replace("_1_3.png", "_1_1.png"),
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
  }
};

export const video_length = (video: HTMLVideoElement) => {
  const { currentTime } = video;
  const hours = Math.floor(currentTime / 3600);
  const minutes = Math.floor(currentTime / 60) % 60;
  const seconds = Math.floor(currentTime % 60);
  function toStr(l: number, s: string) {
    return l > 0 ? l + s : "";
  }
  return toStr(hours, "時間") + toStr(minutes, "分") + toStr(seconds, "秒");
};
