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
import fg_api from "./api/fg_api";

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
  const res = await fg_api(query).catch((e) => {
    return e;
  });
  return res;
};

/**
 * コメントファイル読み込み
 */
export const load_comment_json = async (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    return reader.result;
  };
  reader.readAsText(file);

  const json = JSON.parse(String(reader.result)) as comments_json;
  const query: {
    type: renderCommentsJsonApi["type"];
    data: renderCommentsJsonApi["data"];
    active_tab: renderCommentsJsonApi["active_tab"];
  } = {
    type: "render_comments",
    data: {
      comments: json.threadData,
    },
    active_tab: true,
  };
  await fg_api(query).catch((e) => {
    return e;
  });
};
