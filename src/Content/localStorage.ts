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

export type options = { [key: string]: unknown };

/**
 * デフォルト設定
 * @data コメントを表示する: true
 */
export const defaultOptions: options = {
  設定できる項目はありません: true,
  開発場所: "https://github.com/gobosan/d-comments.git",
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
 * Chrome.storage.local の設定を取得する
 * @param key 設定キー { string }
 * @returns 設定値 { unknown }
 */
export const getOption = (key: string) => {
  chrome.storage.local.get(key, (result) => {
    return result[key] ?? defaultOptions[key];
  });
};
