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

/**
 * 設定のデフォルト値
 * @type {Array<{
 *  key: string;
 *  value: string | number | boolean;
 *  options?: Array<{ name: string; value: string }> | undefined;
 *  type: "checkbox" | "number" | "select" | "color" | "switch";
 *  text: string;
 *  related?: string[];
 * }>}
 */
export const defaultConfigs = [
  {
    key: "show_last_searched_video_id",
    value: true,
    type: "switch",
    text: "ポップアップを開いたとき最後に入力した動画IDを表示する",
  },
  {
    key: "auto_search",
    value: true,
    type: "switch",
    text: "ポップアップを開いたとき自動で動画検索を開始する",
  },
  {
    key: "enable_scroll_mode",
    value: true,
    type: "switch",
    text: "スクロールモードを利用可能にする",
  },
  {
    key: "scroll_interval_ms",
    value: 120,
    type: "number",
    text: "自動スクロールの実行間隔 (ミリ秒)",
  },
  {
    key: "comment_area_width_px",
    value: 1000,
    type: "number",
    text: "コメント欄の幅 (px)",
  },
  {
    key: "show_comment_scrollbar",
    value: true,
    type: "switch",
    text: "コメント欄のスクールバーを表示する",
  },
  {
    key: "comment_area_background_color",
    value: "#000000",
    type: "color",
    text: "コメント欄の背景色",
  },
  {
    key: "comment_area_opacity_percent",
    value: 35,
    type: "number",
    text: "コメント欄の背景不透明度 (%)",
  },
  {
    key: "comment_text_color",
    value: "#FFFFFF",
    type: "color",
    text: "コメントの文字色",
  },
  {
    key: "distance_from_top_percent",
    value: 5,
    type: "number",
    text: "画面の上部分からの距離 (%)",
  },
  {
    key: "distance_from_left_percent",
    value: 10,
    type: "number",
    text: "画面の左部分からの距離 (%)",
  },
  {
    key: "comment_area_height_percent",
    value: 85,
    type: "number",
    text: "コメント欄の高さ (%)",
  },
  {
    key: "comment_rendering_method",
    value: "right_to_left",
    options: [
      { value: "list", name: "リスト" },
      { value: "list_overlay", name: "リスト（オーバーレイ）" },
      { value: "right_to_left", name: "右から左に流す" },
      // { value: "right_to_left_and_list", name: "右から左に流す + リスト" },
    ],
    type: "select",
    text: "コメントの表示方法",
  },
  {
    key: "add_button_to_show_comments_while_playing",
    value: true,
    type: "switch",
    text: "作品ページに「コメントを表示しながら再生」ボタンを追加する",
  },
  {
    key: "open_in_new_tab_when_clicking_show_comments_while_playing_button",
    value: false,
    type: "switch",
    text: "「コメントを表示しながら再生」ボタンでは新しいタブで開く",
    related: ["add_button_to_show_comments_while_playing"],
  },
  {
    key: "show_owner_comments",
    value: false,
    type: "checkbox",
    text: "投稿者コメント",
  },
  {
    key: "show_main_comments",
    value: true,
    type: "checkbox",
    text: "通常コメント",
  },
  {
    key: "show_easy_comments",
    value: false,
    type: "checkbox",
    text: "かんたんコメント",
  },
  {
    key: "allow_login_to_nicovideo",
    value: false,
    type: "switch",
    text: "ニコニコ動画へのログインを許可する",
  },
] as const;

const keys = defaultConfigs.flatMap((item) => item.key);
const types = defaultConfigs.flatMap((item) => item.type);

export type config = {
  key: (typeof keys)[number];
  value: string | number | boolean;
  options?: Array<{ name: string; value: string }> | undefined;
  type: (typeof types)[number];
  text: string;
};

const cache: Map<config["key"], config["value"]> = new Map();

/**
 * 設定を取得し、Callback を呼ぶ
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 * @returns 設定値
 */
export const getConfig = async (
  key: config["key"],
  callback?: (value: config["value"]) => void
): Promise<config["value"]> => {
  if (cache.has(key) && cache.get(key) !== undefined) {
    const value = cache.get(key) as config["value"];
    console.log(`get ${key} from cache : ${value}`);
    if (callback) callback(value);
    return value;
  }
  const defaultValue = defaultConfigs.find((item) => item.key === key)?.value;
  const result = (await browser.storage.local.get([key]))[key] ?? defaultValue;
  if (callback) callback(result as config["value"]);
  console.log(`get ${key} from storage : ${result}`);
  cache.set(key, result);
  return result as config["value"];
};

/**
 * 設定を保存する
 * @param key 設定キー
 * @param value 設定値
 */
export const setConfig = (key: config["key"], value: config["value"]) => {
  browser.storage.local.set({ [key]: value }).then(() => {
    console.log(`key ${key} cached : ${value}`);
    cache.set(key, value);
  });
};

export function migrate() {
  defaultConfigs.map((item) => {
    const key = item.key;
    const text = item.text;
    browser.storage.local.get([text]).then((result) => {
      if (!result[text]) {
        return;
      }
      browser.storage.local.remove([text]);

      browser.storage.local.get([key]).then((result) => {
        if (result[key]) {
          return;
        }
        setConfig(key, result[text]);
      });
    });
  });
}
