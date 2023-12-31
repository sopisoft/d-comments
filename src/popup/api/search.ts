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

import api from "./api";

/**
 * スナップショットAPIを使ってキーワードで動画を検索
 * @param word キーワード
 * @returns 動画情報
 * @see https://site.nicovideo.jp/search-api-docs/snapshot
 */
const search = async (word: string) => {
  const query: {
    type: searchApi["type"];
    data: searchApi["data"];
    active_tab: searchApi["active_tab"];
  } = {
    type: "search",
    data: {
      word: word,
      UserAgent: "d-comments",
    },
    active_tab: false,
  };
  return (await api(query)) as searchApi["response"];
};

export default search;
