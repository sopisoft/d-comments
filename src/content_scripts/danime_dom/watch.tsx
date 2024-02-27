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

import { ThemeProvider } from "@/components/theme-provider";
import JsonFileInput from "@/content_scripts/components/json_file_input";
import Search from "@/content_scripts/components/search";
import VideoIdInput from "@/content_scripts/components/video_id_input";
import { VideoIdContext } from "@/popup/popup";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
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
      } else resolve(null);
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

/**
 * サイドメニューを開く
 */
export const openSideMenu = async () => {
  const partId =
    new URLSearchParams(location.search).get("partId")?.toString() ?? "";
  const storage = window.sessionStorage;

  const video = document.getElementById("video");
  if (!video) {
    setTimeout(openSideMenu, 100);
    return;
  }

  const wrapper_id = "d-comments-wrapper";
  const prev_wrapper = document.getElementById(wrapper_id);
  const wrapper = prev_wrapper || document.createElement("div");
  if (!prev_wrapper) {
    wrapper.id = wrapper_id;
    Object.assign(wrapper.style, {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
    });
    video.parentElement?.before(wrapper);
    wrapper.append(video.parentElement as HTMLElement);
  }

  if (storage.getItem(partId)) {
    const sideMenu = document.createElement("div");
    wrapper.appendChild(sideMenu);

    const root = createRoot(sideMenu);

    function Menu() {
      const [videoId, _setVideoId] = useState("");

      function setVideoId(video_id: string) {
        window.localStorage.setItem("videoId", video_id);
        _setVideoId(video_id);
      }

      return (
        <div className="w-[32rem] h-full p-4">
          <link
            rel="stylesheet"
            href={browser.runtime.getURL("assets/css/client.css")}
          />
          <ThemeProvider>
            <VideoIdContext.Provider value={{ videoId, setVideoId }}>
              <VideoIdInput />
              <JsonFileInput />
              <Search />
            </VideoIdContext.Provider>
          </ThemeProvider>
        </div>
      );
    }

    root.render(<Menu />);
  }
};
