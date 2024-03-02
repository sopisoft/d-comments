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
  forks: thread["forkLabel"][]
) => {
  const threads = Threads.threads;
  const comments: nv_comment[] = [];

  function f(fork: thread["forkLabel"]) {
    threads
      ?.filter((thread) => thread.fork === fork)
      ?.map((thread) => {
        thread.comments.map((comment) => {
          comments.push(comment);
        });
      });
  }

  for (const fork of forks) f(fork);

  comments?.filter((comment) => comment.score > 0);

  comments?.sort((a, b) => {
    return a.vposMs - b.vposMs;
  });

  return comments;
};
