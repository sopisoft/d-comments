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

import style from "./style";
import * as Config from "../config";

/**
 * ドキュメント要素の初期化
 * @returns threadData
 * @returns b コメントコンテナを閉じるボタン
 * @returns s ステータス
 * @returns container コメントコンテナ
 * @returns d エラーメッセージ表示用 paragraph
 * @returns video
 */
const init = () => {
  const video = document.querySelector("video") as HTMLVideoElement;
  Config.getConfig("コメント欄の幅 (0～100%)", (value) => {
    const n = Number(value);
    const w = (100 - n) as number;
    video.style.width = String(w) + "%";
  });

  /**
   * スタイル設定
   */
  document.getElementById("d-comments-style") ??
    document.head.appendChild(style);

  /**
   * コメントコンテナ
   */
  document.getElementById("d-comments-container") &&
    document.getElementById("d-comments-container")?.remove();
  const container = document.createElement("div");
  container.id = "d-comments-container";
  video.after(container);
  Config.getConfig("コメント欄の幅 (0～100%)", (value) => {
    container.style.width = String(value) + "%";
  });

  /**
   * ステータスを表示する
   */
  const s = document.createElement("div");
  s.id = "d-comments-status";
  container.appendChild(s);

  /**
   * エラーメッセージ表示用 paragraph
   */
  const d = document.createElement("div");
  d.id = "d-comments-error";
  d.innerText = "コメント取得中...";
  d.style.display = "block";
  container.appendChild(d);

  /**
   * コメントコンテナを閉じるボタン
   */
  const b = document.createElement("button");
  b.id = "d-comments-close";
  b.textContent = "サイドバーを閉じる";
  b.setAttribute("type", "button");
  b.addEventListener("click", () => {
    b.parentElement?.remove();
  });

  return { b, s, container, d, video };
};

export default init;
