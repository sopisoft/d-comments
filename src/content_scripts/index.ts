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
import { openHowToUseIfNotRead } from "@/how_to_use/how_to_use";
import api from "@/lib/api";
import { find_element } from "@/lib/dom";
import browser from "webextension-polyfill";
import { addon_disable_new_window } from "./addons/disable_new_window";
import { addMenu } from "./addons/mypage";
import { smooth_player } from "./addons/smooth_player";
import get_threads from "./api/thread_data";
import get_video_data from "./api/video_data";
import { ngFilter } from "./comments";
import initRenderer from "./components/canvas";
import overlay from "./components/overlay";
import wrap from "./components/wrapper";
import { setWorkInfo } from "./danime/watch";
import exportJson from "./export";
import {
  partId as getPartId,
  threads as getThreads,
  on_partId_change,
  push_message,
  set_messages,
  set_partId,
  set_threads,
} from "./state";

const url = new URL(location.href);

await openHowToUseIfNotRead();

async function auto_play() {
  const word = document.title;

  // タイトルが「動画再生」の場合、作品情報の取得に失敗している
  if (word === "動画再生") return;

  word.replaceAll("-", " ");
  const query: query<searchApi> = {
    type: "search",
    data: {
      word: word,
      UserAgent: "d-comments",
    },
    active_tab: false,
  };
  const res = await api(query);

  if (res instanceof Error) {
    console.error(res);
  } else {
    const channels_only = await getConfig("channels_only");
    for (const datum of res.data) {
      console.log(JSON.stringify(datum, null, 2));
      const videoId = datum.contentId;
      const isUser = datum.userId !== null;
      if (channels_only && isUser) continue;
      set_partId({
        videoId: videoId,
        workId: getPartId()?.workId,
      });
      await render_comments(videoId);
      break;
    }
  }
}

switch (url.pathname) {
  case "/animestore/ci_pc": {
    getConfig("enable_addon_add_button_to_play", (value) => {
      if (value) addMenu();
    }).then(() => {
      // "disable_new_window" が Anchor の href を削除するため、一番最後に実行する
      getConfig("enable_addon_disable_new_window", (value) => {
        if (value) addon_disable_new_window();
      });
    });
    break;
  }
  case "/animestore/sc_d_pc": {
    // ページの読み込みが完了するまで待機
    await find_element("body");

    // 作品情報の取得
    await setWorkInfo();
    // DOM に要素を追加
    Promise.all([wrap(), overlay()]);

    initRenderer().then((res) => {
      if (res instanceof Error) {
        push_message({
          title: "コメントレンダラーの初期化に失敗しました",
          description: res.message,
        });
      }
    });

    requestAnimationFrame(function loop() {
      const partId = new URLSearchParams(location.search).get("partId");
      if (partId)
        set_partId({
          videoId: getPartId()?.videoId,
          workId: partId,
        });
      requestAnimationFrame(loop);
    });

    on_partId_change(async (prev, next) => {
      if (prev?.videoId && getThreads() && next) {
        await setWorkInfo();

        if (await getConfig("load_comments_on_next_video")) await auto_play();
        else
          push_message({
            title: "再生中のパートが切り替わりました",
            description: "コメントを再取得してください",
          });
      }
    });

    if (await getConfig("enable_auto_play")) await auto_play();

    getConfig("enable_addon_smooth_player", (value) => {
      if (value) smooth_player();
    });

    break;
  }
}

async function render_comments(videoId: VideoId) {
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

  {
    const { data } = threads;
    if (!data) {
      console.error("threads data is undefined");
      set_threads(undefined);
      return;
    }

    console.log("filtering comments...");
    const tasks = data.threads.map(async (thread) => {
      const res = await ngFilter(thread.comments);
      thread.comments = res;
      console.log("filtered", thread.fork);
      return thread;
    });
    const filtered = await Promise.all(tasks);
    const res: Threads = {
      globalComments: data.globalComments,
      threads: filtered,
    };
    console.log("threads", threads);
    set_threads(res);
  }

  push_message({
    title: "コメントの取得に成功しました",
    description: "コメントを表示しています...",
  });
}

browser.runtime.onMessage.addListener(async (message) => {
  const msg = message as messages;
  if (url.pathname !== "/animestore/sc_d_pc") return;
  switch (msg.type) {
    case "render_comments": {
      const videoId = msg.data.videoId;
      console.log("render_comments", videoId);

      await render_comments(videoId);
      break;
    }
    case "export_comments_json": {
      console.log("export_comments_json", msg.data.videoId);
      await exportJson(msg.data.videoId);
      break;
    }
  }
});
