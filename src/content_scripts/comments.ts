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

export const getComments = async (
  Threads: Threads,
  forks: thread["forkLabel"][],
  filter = true,
  sort = true
) => {
  const { threads } = Threads;
  const comments: nv_comment[] = [];

  function f(fork: thread["forkLabel"]) {
    threads
      .filter((thread) => thread.fork === fork)
      .map((thread) => {
        thread.comments.map((comment) => {
          comments.push(comment);
        });
      });
  }

  for (const fork of forks) f(fork);

  if (filter) filterComments(comments);
  if (sort) sortComments(comments);

  return comments;
};

export function filterComments(comments: nv_comment[], level = 0) {
  return comments.filter((comment) => {
    return comment.score >= level;
  });
}

export function sortComments(comments: nv_comment[]) {
  return comments.sort((a, b) => {
    return a.vposMs - b.vposMs;
  });
}
