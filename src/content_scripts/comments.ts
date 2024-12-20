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

export async function ngFilter(comments: nv_comment[]): Promise<nv_comment[]> {
  const [ng_words, ng_users] = await Promise.all([
    getConfig("comment_ng_words"),
    getConfig("comment_ng_users"),
  ]);

  const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const enabled_ng_words = ng_words.filter((w) => w.enabled);
  const regex = enabled_ng_words.map((w) => escapeRegExp(w.value)).join("|");

  const enabled_ng_users = ng_users
    .filter((u) => u.enabled)
    .map((u) => u.value);

  return comments.filter((comment) => {
    const userNotIncluded = !enabled_ng_users.includes(comment.userId);
    const wordNotIncluded =
      enabled_ng_words.length === 0 ||
      !new RegExp(regex, "i").test(comment.body);
    return userNotIncluded && wordNotIncluded;
  });
}

export async function sortComments(
  comments: nv_comment[]
): Promise<nv_comment[]> {
  const n = comments.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = comments[i];
      let j = i;
      while (j >= gap && comments[j - gap].vposMs > temp.vposMs) {
        comments[j] = comments[j - gap];
        j -= gap;
      }
      comments[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }

  return comments;
}
