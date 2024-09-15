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

function get_default_configs() {
  return {
    enable_auto_play: {
      value: false as boolean,
      type: "switch",
      text: "自動で動画検索/再生を開始する",
    },
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
    load_comments_on_next_video: {
      value: true as boolean,
      type: "switch",
      text: "連続再生時に自動で次の動画のコメントを読み込む",
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
    channels_only: {
      value: true as boolean,
      type: "checkbox",
      text: "コメントをチャンネルからのみ取得",
    },
    allow_login_to_nicovideo: {
      value: false as boolean,
      type: "switch",
      text: "ニコニコ動画へのログインを許可する",
    },
  } as const;
}

type config = ReturnType<typeof get_default_configs>;
export type config_keys = keyof config;
export type config_value<T extends config_keys> = config[T]["value"];

export function getDefaultValue<T extends config_keys>(
  key: T
): config_value<T> {
  return get_default_configs()[key].value;
}
export function getValueType<T extends config_keys>(key: T): config[T]["type"] {
  return get_default_configs()[key].type;
}
export function getConfigText<T extends config_keys>(key: T): string {
  return get_default_configs()[key].text;
}

/**
 * 設定を取得し、Callback を呼ぶ
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 * @returns 設定値
 */
export async function getConfig<T extends config_keys>(
  key: T,
  callback?: (value: config_value<T>) => void
): Promise<config_value<T>> {
  openHowToUseIfNotRead();
  const storedValue = (await browser.storage.local.get([key]))[key];
  const defaultValue = getDefaultValue(key);
  const value = (storedValue ?? defaultValue) as config_value<T>;
  if (callback !== undefined) callback(value);
  return value;
}

/**
 * 設定を保存する
 * @param key 設定キー
 * @param value 設定値
 */
export function setConfig<T extends config_keys>(
  key: T,
  value: config_value<T>
) {
  browser.storage.local.set({ [key]: value });
}
