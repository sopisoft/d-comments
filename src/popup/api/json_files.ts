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

/**
 * コメントをファイルで出力する
 * @param videoId 動画ID
 */
export const export_comment_json = async (
  videoId: VideoId
): Promise<exportCommentsJsonApi["response"] | Error> => {
  const query: {
    type: exportCommentsJsonApi["type"];
    data: exportCommentsJsonApi["data"];
    active_tab: exportCommentsJsonApi["active_tab"];
  } = {
    type: "export_comments_json",
    data: {
      videoId: videoId,
    },
    active_tab: true,
  };
  const res = await api(query).catch((e) => {
    return e;
  });
  return res;
};

/**
 * コメントファイル読み込み
 */
export const load_comments_json = async (
  file: File
): Promise<renderCommentsApi["response"] | Error> => {
  const reader = new FileReader();

  let result: string | Error = "";
  reader.onload = () => {
    result = reader.result as string;
    return reader.result;
  };
  reader.readAsText(file);

  const json = JSON.parse(String(result) || "{}") as comments_json;
  if (!json.threadData) {
    return new Error("threadDataがありません");
  }
  const query: {
    type: renderCommentsJsonApi["type"];
    data: renderCommentsJsonApi["data"];
    active_tab: renderCommentsJsonApi["active_tab"];
  } = {
    type: "render_comments_json",
    data: {
      comments: json.threadData,
    },
    active_tab: true,
  };
  return await api(query).catch((e) => {
    return e;
  });
};
