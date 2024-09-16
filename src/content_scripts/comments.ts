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

const worker = new Worker(new URL("./comments_worker.ts", import.meta.url), {
  type: "module",
});

export const getComments = async () => {
  const threads = getThreads()?.threads;
  if (!threads) return;

  const nv_comments: nv_comment[] = [];
  const l: [config_keys, string][] = [
    ["show_owner_comments", "owner"],
    ["show_main_comments", "main"],
    ["show_easy_comments", "easy"],
  ];

  Promise.all(
    l.map(async ([k, v]) => {
      const res = await getConfig(k);
      if (!res) return;
      for (const thread of threads) {
        if (thread.fork === v) nv_comments.push(...thread.comments);
      }
    })
  ).then(async () => {
    worker.postMessage({ comments: nv_comments });
  });

  const sorted = await new Promise<nv_comment[]>((resolve) => {
    worker.addEventListener("message", (e: MessageEvent<message>) => {
      resolve(e.data.comments);
    });
  });
  return sorted;
};
