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

export type options = { [key: string]: string | number | boolean };

export const defaultOptions: options = {
  ポップアップを開いたとき最後に入力した動画IDを表示する: true,
  ポップアップを開いたとき自動で動画検索を開始する: true,
};

/**
 * Chrome.storage.local に保存されている設定を取得する
 * @returns 設定 { [key: string]: unknown }
 */
export const getAllOptions = () => {
  chrome.storage.local.get(null, (result) => {
    Object.keys(defaultOptions).map((key: string) => {
      if (result[key] === undefined) {
        result[key] = defaultOptions[key];
      }
    });
    Object.keys(result).map((key: string) => {
      if (!(key in defaultOptions)) {
        delete result[key];
        chrome.storage.local.remove(key as string);
      }
    });
    return result;
  });
};

/**
 * 設定を取得し、Callback を呼び出す
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 */
export const getOption = (
  key: string,
  callback: (value: string | number | boolean) => void
) => {
  chrome.storage.local.get(key, (result) => {
    callback(result[key] ?? defaultOptions[key]);
  });
};
