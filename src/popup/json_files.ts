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
 * コメントをファイルで出力する
 * @param movieId ニコニコ動画の動画ID
 */
export const export_comment_json = async (movieId: string) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id as number, {
      type: "exportJson",
      movieId: movieId,
    });
  });
};

/**
 * コメントファイル読み込み
 */
const load_comment_json = async (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id as number, {
        type: "renderComments",
        data: reader.result,
      });
    });
  };
  reader.readAsText(file);
};
