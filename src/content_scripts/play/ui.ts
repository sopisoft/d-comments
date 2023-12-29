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
 */
const uiInit = () => {
  const video = document.getElementById("video") as HTMLVideoElement;

  /**
   * スタイル設定
   */
  Style.setDefaultStyle();

  /**
   * すべての要素をラップする
   */
  const wrapper =
    document.getElementById("d-comments-wrapper") ??
    document.createElement("div");
  if (!document.getElementById("d-comments-wrapper")) {
    wrapper.id = "d-comments-wrapper";
    Object.assign(wrapper.style, {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
    });

    video.parentElement?.before(wrapper);
    wrapper.append(video.parentElement as HTMLElement);
  }

  /**
   * コメントコンテナ
   */
  document.getElementById("d-comments-container")?.remove();
  const container = document.createElement("div");
  container.id = "d-comments-container";
  Object.assign(container.style, {
    display: "flex",
    position: "var(--d-comments-container-position, relative)",
    zIndex: "var(--d-comments-container-z-index, 1)",
    width: "var(--d-comments-container-width ,1000px)",
    height: "var(--d-comments-container-height, 100vh)",
    top: "var(--d-comments-container-top, 0%)",
    left: "var(--d-comments-container-left, 0%)",
    background: "var(--d-comments-container-background, rgba(0,0,0,0.35))",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "'Noto Sans JP', 'Noto Color Emoji', sans-serif",
    fontSize: "medium",
    fontWeight: 500,
    fontStyle: "normal",
    color: "var(--d-comments-text-color, white)",
  });

  wrapper.appendChild(container);

  /**
   * コメントコンテナを閉じるボタン
   */
  const button_closes_comment_container = document.createElement("button");
  button_closes_comment_container.textContent = "サイドバーを閉じる";
  Object.assign(button_closes_comment_container.style, {
    width: "80%",
    height: "2em",
    margin: "0 auto",
    padding: "3px",
    borderRadius: "15px",
    cursor: "pointer",
  });
  button_closes_comment_container.setAttribute("type", "button");
  button_closes_comment_container.addEventListener("click", () => {
    container.remove();
  });

  /**
   * ステータス表示バー
   */
  const status_bar = document.createElement("div");
  Object.assign(status_bar.style, {
    padding: "2px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  container.appendChild(status_bar);

  /**
   * エラーメッセージ表示バー
   */
  const error_messages_bar = document.createElement("div");
  error_messages_bar.innerText = "コメント取得中...";
  Object.assign(error_messages_bar.style, {
    width: "90%",
    margin: "1em auto",
    zIndex: -1,
    lineHeight: 2,
  });
  error_messages_bar.style.display = "block";

  container.appendChild(error_messages_bar);

  return {
    video,
    container,
    status_bar,
    error_messages_bar,
    button_closes_comment_container,
  };
};

export default uiInit;
