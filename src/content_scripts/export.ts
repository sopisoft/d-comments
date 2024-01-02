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

const exportJson = async (videoId: VideoId) => {
  const video_data = async (): Promise<videoDataApi["response"] | Error> => {
    const query: {
      type: videoDataApi["type"];
      data: videoDataApi["data"];
      active_tab: videoDataApi["active_tab"];
    } = {
      type: "video_data",
      data: {
        videoId: videoId,
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
    return e;
  }
  const threadData = await threads_data(videoData);
  if (threadData instanceof Error) {
    const e = threadData as Error;
    return e;
  }

  const fileName = `${videoData.data.video.title}.json`;
  const data: comments_json = {
    version: 1,
    movieData: videoData,
    threadData: threadData,
  };
  return await saveFile(fileName, JSON.stringify(data));
};

/**
 * ファイルを保存する
 * @param fileName ファイル名
 * @param data 内容
 */
const saveFile = async (
  fileName: string,
  data: string
): Promise<boolean | Error> => {
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
  return true;
};

export default exportJson;
