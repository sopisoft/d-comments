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

// Worker Script

type message = {
  id: string;
  ng_words_regex: RegExp | "skip-ng-words-filter";
  ng_users: string[];
  comments: nv_comment[];
};

self.addEventListener("message", async (e: MessageEvent<message>) => {
  const { id, comments } = e.data;
  const { ng_words_regex, ng_users } = e.data;
  if (ng_words_regex === "skip-ng-words-filter") {
    const filtered = comments.filter((comment) => {
      return !ng_users.includes(comment.userId);
    });
    self.postMessage({ id, comments: filtered });
  } else {
    const filtered = comments.filter((comment) => {
      return (
        !ng_users.includes(comment.userId) && !ng_words_regex.test(comment.body)
      );
    });
    self.postMessage({ id, comments: filtered });
  }
});

export default {};
