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

import { getConfig } from "@/config";
import browser from "webextension-polyfill";
import get_threads from "./api/thread_data";
import get_video_data from "./api/video_data";
import canvasInit from "./components/canvas";
import wrap from "./components/wrapper";
import { addMenu } from "./danime/mypage";
import { setWorkInfo } from "./danime/watch";
import exportJson from "./export";
import { set_partId, set_threads } from "./state";

const url = new URL(location.href);

(async function initialize() {
  if (url.pathname === "/animestore/ci_pc")
    getConfig("add_button_to_show_comments_while_playing", (value) => {
      if (value) addMenu();
    });
  if (url.pathname === "/animestore/sc_d_pc") {
    function loop() {
      const partId = new URLSearchParams(location.search).get("partId");
      set_partId(partId?.toString());
      window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
    await setWorkInfo();
  }
})();

async function render_comments(videoId: VideoId) {
  const video_data = await get_video_data(videoId);
  if (video_data instanceof Error) {
    console.error(video_data);
    return;
  }

  console.log(video_data);

  if (!video_data.data.comment) return;
  const threads = await get_threads(video_data);
  if (threads instanceof Error) {
    console.error(threads);
    return;
  }
  set_threads(threads.data);

  console.log(threads);
}

function ui_init() {
  return Promise.all([canvasInit(), wrap()]);
}

browser.runtime.onMessage.addListener(async (message: messages) => {
  if (url.pathname !== "/animestore/sc_d_pc") return;
  switch (message.type) {
    case "render_comments": {
      console.log("render_comments", message.data.videoId);
      ui_init().then(async () => {
        await render_comments(message.data.videoId);
      });
      break;
    }
    case "export_comments_json": {
      console.log("export_comments_json", message.data.videoId);
      await exportJson(message.data.videoId);
      break;
    }
  }
});
