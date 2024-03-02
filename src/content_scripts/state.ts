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
import browser from "webextension-polyfill";

function use_state<T>(initial: T, key: string) {
  let state = initial;
  const listeners = new Set<(prev: T, next: T) => void>();
  const storage = browser.storage.local;

  storage.set({ [key]: state });

  async function get_state(): Promise<T> {
    const storedValue = await storage.get([key]);
    if (state || !storedValue[key]) return state;
    if (storedValue[key]) return storedValue[key];
    return state;
  }

  function set_state(next: T) {
    if (Object.is(state, next)) return;
    const prev = state;
    state = next;
    storage.set({ [key]: next });
    for (const listener of listeners) listener(prev, next);
  }

  function on_change(listener: (prev: T, next: T) => void) {
    listeners.add(listener);
    return {
      unsubscribe: () => {
        listeners.delete(listener);
      },
    };
  }

  return [get_state, set_state, on_change] as const;
}

const prefix = "_state:";

type mode = ("list" | "nico")[];
export const [mode, set_mode, on_mode_change] = use_state<mode>(
  await get_mode_arr(),
  `${prefix}mode`
);
export const [partId, set_partId, on_partId_change] = use_state<
  string | undefined
>(undefined, `${prefix}partId`);
export const [threads, set_threads, on_threads_change] = use_state<
  Threads | undefined
>(undefined, `${prefix}threads`);
export const [bgColor, setBgColor, onBgColorChange] = use_state(
  (await getConfig("comment_area_background_color")) as string,
  `${prefix}bgColor`
);
export const [textColor, setTextColor, onTextColorChange] = use_state(
  (await getConfig("comment_text_color")) as string,
  `${prefix}textColor`
);
export const [opacity, setOpacity, onOpacityChange] = use_state(
  (await getConfig("comment_area_opacity_percentage")) as number,
  `${prefix}opacity`
);

async function get_mode_arr(): Promise<mode> {
  const arr: mode = [];

  if (await getConfig("show_comments_in_list")) arr.push("list");
  if (await getConfig("show_comments_in_niconico_style")) arr.push("nico");

  return arr;
}

browser.storage.onChanged.addListener(async (changes) => {
  for (const key in changes) {
    switch (key as config["key"]) {
      case "comment_area_background_color":
        setBgColor(changes[key].newValue);
        break;
      case "comment_text_color":
        setTextColor(changes[key].newValue);
        break;
      case "comment_area_opacity_percentage":
        setOpacity(changes[key].newValue);
        break;
      case "show_comments_in_list":
        set_mode(await get_mode_arr());
        break;
      case "show_comments_in_niconico_style":
        set_mode(await get_mode_arr());
        break;
    }
  }
});
