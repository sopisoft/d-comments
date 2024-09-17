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

import { type config_keys, getConfig } from "@/config";
import { threads as getThreads } from "./state";

type message = {
  comments: nv_comment[];
};

const sort_worker = new Worker(
  new URL("./comments_worker.ts", import.meta.url),
  {
    type: "module",
  }
);

const ngfilter_worker = new Worker(
  new URL("./comments_ngfilter.ts", import.meta.url),
  { type: "module" }
);

async function build_ng_filter_message(comments: nv_comment[]) {
  const id = Math.random().toString(36).slice(-8);

  const ng_words = await getConfig("comment_ng_words");
  const enabled_ng_users = ng_words.filter((w) => w.enabled);
  const regex = enabled_ng_users.map((w) => w.value).join("|");

  const ng_users = await getConfig("comment_ng_users");
  const enabled_ng_words = ng_users
    .filter((u) => u.enabled)
    .map((u) => u.value);

  const ng_filter_message = {
    id: id,
    ng_words_regex: new RegExp(regex, "i"),
    ng_users: enabled_ng_words,
    comments: comments,
  };
  return ng_filter_message;
}
export async function ngFilter(comments: nv_comment[]): Promise<nv_comment[]> {
  const message = await build_ng_filter_message(comments);
  ngfilter_worker.postMessage(message);

  return await new Promise<nv_comment[]>((resolve) => {
    ngfilter_worker.addEventListener("message", (e) => {
      if (e.data.id === message.id) {
        resolve(e.data.comments);
      }
    });
  });
}

export async function sortComments(
  comments: nv_comment[]
): Promise<nv_comment[]> {
  sort_worker.postMessage({ comments });
  return await new Promise<nv_comment[]>((resolve) => {
    sort_worker.onmessage = (e: MessageEvent<message>) => {
      resolve(e.data.comments);
    };
  });
}
