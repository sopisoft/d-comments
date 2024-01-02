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

import api from "@/lib/api";
import play from "./play";
import uiInit from "./ui";

/**
 * 発火用関数
 * @param movieId
 * @param data ファイルからコメントを読み込むときコメントデータ。ファイルからの読み込みでない場合は、undefined。
 */
const fire = async (from_json: boolean, data: VideoId | Threads) => {
  const {
    video,
    container,
    status_bar,
    error_messages_bar,
    button_closes_comment_container,
  } = uiInit();

  /**
   * エラーメッセージを表示する
   * @param message エラーメッセージ
   * @param code エラーコードもしくはnull
   */
  const setMessage = (message: string, code: string | null) => {
    error_messages_bar.style.display = "block";
    code
      ? error_messages_bar.innerText === `${message}\nエラーコード : ${code}`
      : error_messages_bar.innerText === `${message}`;
    container.appendChild(button_closes_comment_container);
    return;
  };

  // ファイルからコメントを読み込むとき
  if (from_json) {
    const e = JSON.parse(data.toString());
    if (e.threadData) {
      play(
        e.threadData,
        button_closes_comment_container,
        status_bar,
        container,
        error_messages_bar,
        video
      );
    } else {
      setMessage("コメントの取得に失敗しました。", null);
    }
  }
  // サーバーからコメントを取得するとき
  else {
    const video_data = async (): Promise<videoDataApi["response"] | Error> => {
      const query: {
        type: videoDataApi["type"];
        data: videoDataApi["data"];
        active_tab: videoDataApi["active_tab"];
      } = {
        type: "video_data",
        data: {
          videoId: data as VideoId,
        },
        active_tab: false,
      };
      return await api(query)
        .then((res) => {
          return res;
        })
        .catch((e) => {
          return e;
        });
    };

    const threads_data = async (
      videoData: videoDataApi["response"]
    ): Promise<threadDataApi["response"] | Error> => {
      const query: {
        type: threadDataApi["type"];
        data: threadDataApi["data"];
        active_tab: threadDataApi["active_tab"];
      } = {
        type: "thread_data",
        data: {
          videoData: videoData,
        },
        active_tab: false,
      };
      return await api(query)
        .then((res) => {
          return res;
        })
        .catch((e) => {
          return e;
        });
    };

    const videoData = await video_data();
    if (videoData instanceof Error) {
      const e = videoData as Error;
      setMessage("動画情報の取得に失敗しました。", JSON.stringify(e));
      return;
    }
    const threadData = await threads_data(videoData);
    if (threadData instanceof Error) {
      const e = threadData as Error;
      setMessage("コメントの取得に失敗しました。", JSON.stringify(e));
      return;
    }

    play(
      threadData,
      button_closes_comment_container,
      status_bar,
      container,
      error_messages_bar,
      video
    );
  }
};

export default fire;
