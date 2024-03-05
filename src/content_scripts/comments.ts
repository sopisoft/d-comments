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

async function getConfigedForks() {
  const list: thread["forkLabel"][] = [];
  if (await getConfig("show_owner_comments")) list.push("owner");
  if (await getConfig("show_main_comments")) list.push("main");
  if (await getConfig("show_easy_comments")) list.push("easy");
  return list;
}

export const getComments = async (
  Threads: Threads,
  forks?: thread["forkLabel"][]
) => {
  const threads = Threads.threads;
  const comments: nv_comment[] = [];
  const _forks = forks ?? (await getConfigedForks());

  function f(fork: thread["forkLabel"]) {
    threads
      ?.filter((thread) => thread.fork === fork)
      ?.map((thread) => {
        thread.comments.map((comment) => {
          comments.push(comment);
        });
      });
  }

  for (const fork of _forks) f(fork);

  filterComments(comments, 0);
  sortComments(comments);

  return comments;
};

function filterComments(comments: nv_comment[], score: number) {
  const filtered = comments.filter((comment) => comment.score > score);
  return filtered;
}
function sortComments(comments: nv_comment[]) {
  const sorted = comments.sort((a, b) => {
    return a.vposMs - b.vposMs;
  });
  return sorted;
}
