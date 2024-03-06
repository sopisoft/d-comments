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

import browser from "webextension-polyfill";
import { openHowToUseIfNotRead } from "./how_to_use/how_to_use";

/**
 * 設定のデフォルト値
 */
export const defaultConfigs = {
  auto_search: {
    value: false as boolean,
    type: "switch",
    text: "ポップアップを開いたとき自動で動画検索を開始する",
  },
  enable_auto_scroll: {
    value: true as boolean,
    type: "switch",
    text: "コメント欄の自動スクロール",
  },
  comment_area_width_px: {
    value: 600 as number,
    type: "number",
    text: "コメント欄の幅 (px)",
  },
  comment_area_background_color: {
    value: "#000000" as string,
    type: "color",
    text: "コメント欄の背景色",
  },
  comment_area_opacity_percentage: {
    value: 95 as number,
    type: "slider",
    text: "コメント欄の不透明度 (%)",
  },
  comment_text_color: {
    value: "#FFFFFF" as string,
    type: "color",
    text: "コメントの文字色",
  },
  show_comments_in_list: {
    value: true as boolean,
    type: "checkbox",
    text: "リスト表示",
  },
  show_comments_in_niconico_style: {
    value: true as boolean,
    type: "checkbox",
    text: "ニコニコ動画風",
  },
  add_button_to_show_comments_while_playing: {
    value: true as boolean,
    type: "switch",
    text: "作品ページに「コメントを表示しながら再生」ボタンを追加する",
  },
  make_play_button_open_new_tab: {
    value: true as boolean,
    type: "switch",
    text: "「コメントを表示しながら再生」ボタンでは新しいタブで開く",
    bindings: [
      {
        key: "add_button_to_show_comments_while_playing",
        value: true,
      },
    ],
  },
  show_owner_comments: {
    value: false as boolean,
    type: "checkbox",
    text: "投稿者コメント",
  },
  show_main_comments: {
    value: true as boolean,
    type: "checkbox",
    text: "通常コメント",
  },
  show_easy_comments: {
    value: false as boolean,
    type: "checkbox",
    text: "かんたんコメント",
  },
  allow_login_to_nicovideo: {
    value: false as boolean,
    type: "switch",
    text: "ニコニコ動画へのログインを許可する",
  },
} as const;

export type config = typeof defaultConfigs;
export type config_keys = keyof config;
export type config_value<T extends keyof config> = config[T]["value"];

/**
 * 設定を取得し、Callback を呼ぶ
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 * @returns 設定値
 */
export async function getConfig<T extends keyof config>(
  key: T,
  callback?: (value: (typeof defaultConfigs)[T]["value"]) => void
): Promise<(typeof defaultConfigs)[T]["value"]> {
  openHowToUseIfNotRead();
  const defaultValue = defaultConfigs[key].value;
  const storedValue = (await browser.storage.local.get([key]))[key];
  const value = (storedValue ?? defaultValue) as config_value<T>;
  if (callback !== undefined) callback(value);
  return value;
}

/**
 * 設定を保存する
 * @param key 設定キー
 * @param value 設定値
 */
export function setConfig<T extends keyof config>(
  key: T,
  value: (typeof defaultConfigs)[T]["value"]
) {
  browser.storage.local.set({ [key]: value });
}
