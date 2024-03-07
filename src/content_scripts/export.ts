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

import get_threads from "./api/thread_data";
import get_video_data from "./api/video_data";
import { push_message, set_messages } from "./state";

const exportJson = async (videoId: VideoId) => {
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

  push_message({
    title: "コメントの取得に成功しました",
    description: "ファイルに保存しています",
  });

  const fileName = `${data.video.title}.json`;
  const _data: comments_json = {
    version: 1,
    movieData: video_data as SearchResult,
    threadData: threads,
  };

  return await saveFile(fileName, JSON.stringify(_data));
};

/**
 * ファイルを保存する
 * @param fileName ファイル名
 * @param data 内容
 */
const saveFile = async (fileName: string, data: string) => {
  try {
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    return e as Error;
  }
  return true as const;
};

export default exportJson;
