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

import { type config, getConfig } from "@/config";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import browser from "webextension-polyfill";
import { getComments } from "../comments";
import { on_threads_change, threads } from "../state";

export function Scroll() {
  const parentRef = useRef<HTMLUListElement>(null);
  const [comments, _setComments] = useState<nv_comment[]>([]);

  async function set_comments(_threads?: Threads) {
    const list: thread["forkLabel"][] = [];
    if (await getConfig("show_owner_comments")) list.push("owner");
    if (await getConfig("show_main_comments")) list.push("main");
    if (await getConfig("show_easy_comments")) list.push("easy");

    const t = _threads || (await threads());
    if (t) _setComments(await getComments(t, list));
  }

  browser.storage.onChanged.addListener((changes) => {
    for (const key in changes) {
      switch (key as config["key"]) {
        case "show_owner_comments":
          set_comments();
          break;
        case "show_main_comments":
          set_comments();
          break;
        case "show_easy_comments":
          set_comments();
          break;
      }
    }
  });

  on_threads_change((_prev, next) => {
    if (next) set_comments(next);
  });
  useEffect(() => {
    set_comments();
  }, []);

  const virtualizer = useVirtualizer({
    count: comments.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
  });

  // function loop() {
  //   window.requestAnimationFrame(loop);
  // }
  // window.requestAnimationFrame(loop);

  return (
    comments && (
      <ul ref={parentRef}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <li>{comments[virtualItem.index]?.body}</li>
        ))}
      </ul>
    )
  );
}

export default Scroll;
