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

import * as Style from "./style";

/**
 * ドキュメント要素の初期化
 * @returns b コメントコンテナを閉じるボタン
 * @returns s ステータス
 * @returns container コメントコンテナ
 * @returns d エラーメッセージ表示用 paragraph
 * @returns video
 */
const init = () => {
  const video = document.getElementById("video") as HTMLVideoElement;

  /**
   * スタイル設定
   */
  Style.setDefaultStyle();
  Style.init();

  /**
   * すべての要素をラップする
   */
  const wrapper =
    document.getElementById("d-comments-wrapper") ??
    document.createElement("div");
  if (!document.getElementById("d-comments-wrapper")) {
    wrapper.id = "d-comments-wrapper";
    video.parentElement?.before(wrapper);
    wrapper.append(video.parentElement as HTMLElement);
  }

  /**
   * コメントコンテナ
   */
  document.getElementById("d-comments-container") &&
    document.getElementById("d-comments-container")?.remove();
  const container = document.createElement("div");
  container.id = "d-comments-container";
  wrapper.appendChild(container);

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
    container.remove();
  });

  return { b, s, container, d, video };
};

export default init;
