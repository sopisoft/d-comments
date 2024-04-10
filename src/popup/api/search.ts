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
 * スナップショットAPIを使ってキーワードで動画を検索
 * @param word キーワード
 * @returns Snapshot | Error
 * @see https://site.nicovideo.jp/search-api-docs/snapshot
 */
async function search(word: string): Promise<searchApi["response"] | Error> {
  const query: query<searchApi> = {
    type: "search",
    data: {
      word: word,
      UserAgent: "d-comments",
    },
    active_tab: false,
  };

  const res = await api(query);
  return res;
}

export default search;
