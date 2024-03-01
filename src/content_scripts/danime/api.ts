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

export const base_url =
  "https://animestore.docomo.ne.jp/animestore/rest/WS010105";

type work_info = {
  version: number;
  data: {
    partId: string;
    workTitle: string;
    workTitleKana: string;
    mainKeyVisualPath: string;
    partDispNumber: string;
    partExp: string;
    partTitle: string;
    title: string;
    mainScenePath: string;
  };
};

export async function get_work_info(): Promise<work_info> {
  const partId = new URLSearchParams(location.search).get("partId")?.toString();
  const params = {
    viewType: "5",
    partId: partId ?? "",
    defaultPlay: "5",
  };
  const params_str = new URLSearchParams(params).toString();
  return await fetch(`${base_url}?${params_str}`, {
    method: "GET",
    cache: "no-cache",
  }).then(async (res) => {
    return await res.json();
  });
}
