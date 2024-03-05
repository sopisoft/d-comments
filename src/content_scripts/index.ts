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
import overlay from "./components/overlay";
import wrap from "./components/wrapper";
import { find_element } from "./danime/dom";
import { addMenu } from "./danime/mypage";
import { setWorkInfo, smooth_player } from "./danime/watch";
import exportJson from "./export";
import {
  messages as getMessages,
  on_partId_change,
  set_messages,
  set_partId,
  set_threads,
} from "./state";

const url = new URL(location.href);

switch (url.pathname) {
  case "/animestore/ci_pc":
    getConfig("add_button_to_show_comments_while_playing", (value) => {
      if (value) addMenu();
    });
    break;
  case "/animestore/sc_d_pc": {
    set_threads(undefined);

    await find_element("body");
    await Promise.all([setWorkInfo(), smooth_player()]);
    Promise.all([wrap(), overlay(), canvasInit()]);

    requestAnimationFrame(function loop() {
      const partId = new URLSearchParams(location.search).get("partId");
      set_partId(partId?.toString());
      requestAnimationFrame(loop);
    });

    on_partId_change(async (prev, next) => {
      if (prev && next) {
        const message = {
          title: "再生中のパートが切り替わりました",
          description: "コメントを再取得してください",
        };
        push_message(message);
        setWorkInfo();
      }
    });

    break;
  }
}

function push_message(message: Error | { title: string; description: string }) {
  set_messages(getMessages().concat(message));
}

async function render_comments(videoId: VideoId) {
  set_threads(undefined);
  set_messages([]);
  push_message({
    title: "コメントを取得しています",
    description: "動画情報を取得しています",
  });

  const video_data = await get_video_data(videoId);
  if (video_data instanceof Error) {
    push_message(video_data);
    return;
  }
  console.log("video_data", video_data);

  if (!(video_data as SearchResult).data?.comment) {
    const res = video_data as SearchErrorResponse;
    const error_code = res.meta.errorCode;
    const error_reason = res.data.reasonCode;
    const message = {
      title: "動画情報の取得に失敗しました",
      description: error_reason ?? error_code,
    };
    push_message(message);
    return;
  }

  const { data } = video_data as SearchResult;
  const threads = await get_threads(data.comment.nvComment);
  if (threads instanceof Error) {
    push_message(threads);
    return;
  }
  console.log("threads", threads);
  set_threads(threads.data);

  push_message({
    title: "コメントの取得に成功しました",
    description: "コメントを表示しています...",
  });
}

browser.runtime.onMessage.addListener(async (message: messages) => {
  if (url.pathname !== "/animestore/sc_d_pc") return;
  switch (message.type) {
    case "render_comments": {
      console.log("render_comments", message.data.videoId);

      await render_comments(message.data.videoId);
      break;
    }
    case "export_comments_json": {
      console.log("export_comments_json", message.data.videoId);
      await exportJson(message.data.videoId);
      break;
    }
  }
});
