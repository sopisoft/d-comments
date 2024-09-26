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

import { find_element } from "@/lib/dom";
import { push_message } from "../state";
import { get_work_info } from "./api";

/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 */
export const setWorkInfo = async () => {
  const res = await get_work_info();
  if (res instanceof Error) {
    push_message(res);
    setTimeout(setWorkInfo, 30 * 1000);
    return;
  }
  if (!res.data) {
    setTimeout(setWorkInfo, 30 * 1000);
    return;
  }

  const { title, partExp, workTitle } = res.data;
  const description = partExp ? partExp : workTitle;

  const titleEl = await find_element("title");
  if (titleEl) titleEl.textContent = title;
  const descriptionEl = await find_element("meta[name=Description]");
  if (descriptionEl) descriptionEl.setAttribute("content", description);
};
