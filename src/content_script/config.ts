/*
    This file is part of d-comments_For_DMM-TV.

    d-comments_For_DMM-TV is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments_For_DMM-TV is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments_For_DMM-TV.  If not, see <https://www.gnu.org/licenses/>.
*/

export type config = {
  key: string;
  value: string | number | boolean;
  type: string;
};

export const defaultConfigs: Array<config> = [
  {
    key: "ポップアップを開いたとき最後に入力した動画IDを表示する",
    value: true,
    type: "checkbox",
  },
  {
    key: "ポップアップを開いたとき自動で動画検索を開始する",
    value: true,
    type: "checkbox",
  },
  {
    key: "コメント欄の幅 (0～100%)",
    value: 20,
    type: "number",
  },
  { key: "スクロールモードを利用可能にする", value: true, type: "checkbox" },
];

/**
 * 設定を取得し、Callback を呼ぶ
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 */
export const getConfig = (
  key: string,
  callback: (value: string | number | boolean) => void
) => {
  chrome.storage.local.get([key]).then((result) => {
    if (result[key] === undefined || null) {
      console.log(
        `${key} (${result[key]}) ${
          defaultConfigs.find((item) => item.key === key)?.value
        }`
      );
    } else {
      console.log(key, result[key]);
    }
    callback(
      result[key] ?? defaultConfigs.find((item) => item.key === key)?.value
    );
  });
};

/**
 * 設定を保存する
 * @param key 設定キー
 * @param value 設定値
 */
export const setConfig = (key: string, value: string | number | boolean) => {
  chrome.storage.local.set({ [key]: value }).then(() => {
    console.log(key, value);
  });
};
