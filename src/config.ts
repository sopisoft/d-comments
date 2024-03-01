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
 */
export const defaultConfigs = [
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
    key: "comment_area_opacity_percentage",
    value: 95,
    type: "slider",
    text: "コメント欄の不透明度 (%)",
  },
  {
    key: "comment_text_color",
    value: "#FFFFFF",
    type: "color",
    text: "コメントの文字色",
  },
  {
    key: "show_comments_in_list",
    value: true,
    type: "checkbox",
    text: "リスト表示",
  },
  {
    key: "show_comments_in_niconico_style",
    value: true,
    type: "checkbox",
    text: "ニコニコ動画風",
  },
  {
    key: "add_button_to_show_comments_while_playing",
    value: true,
    type: "switch",
    text: "作品ページに「コメントを表示しながら再生」ボタンを追加する",
  },
  {
    key: "make_play_button_open_new_tab",
    value: true,
    type: "switch",
    text: "「コメントを表示しながら再生」ボタンでは新しいタブで開く",
    bindings: [
      {
        key: "add_button_to_show_comments_while_playing",
        value: true,
      },
    ],
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
  const defaultValue = defaultConfigs.find((item) => item.key === key)?.value;
  const result = (await browser.storage.local.get([key]))[key] ?? defaultValue;
  if (callback) callback(result as config["value"]);
  return result as config["value"];
};

/**
 * 設定を保存する
 * @param key 設定キー
 * @param value 設定値
 */
export const setConfig = (key: config["key"], value: config["value"]) => {
  browser.storage.local.set({ [key]: value });
};

export function migrate() {
  defaultConfigs.map((item) => {
    const key = item.key;
    const text = item.text;
    // 旧バージョンの設定キーは text になっている
    browser.storage.local.get([text]).then((result) => {
      if (!result[text]) {
        return;
      }

      browser.storage.local.get([key]).then((result) => {
        if (!result[key]) {
          // 旧バージョンの設定キーがあり、かつ新バージョンの設定キーがない場合
          setConfig(key, result[text]);
          browser.storage.local.remove([text]);
        }
      });
    });
  });
}
