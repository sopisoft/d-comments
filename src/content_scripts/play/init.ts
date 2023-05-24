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
	document.getElementById("d-comments-container")?.remove();
	const container = document.createElement("div");
	container.id = "d-comments-container";
	wrapper.appendChild(container);

	/**
	 * コメントコンテナを閉じるボタン
	 */
	const button_closes_comment_container = document.createElement("button");
	button_closes_comment_container.id = "d-comments-close";
	button_closes_comment_container.textContent = "サイドバーを閉じる";
	button_closes_comment_container.setAttribute("type", "button");
	button_closes_comment_container.addEventListener("click", () => {
		container.remove();
	});

	/**
	 * ステータス表示バー
	 */
	const status_bar = document.createElement("div");
	status_bar.id = "d-comments-status";
	container.appendChild(status_bar);

	/**
	 * エラーメッセージ表示バー
	 */
	const error_messages_bar = document.createElement("div");
	error_messages_bar.id = "d-comments-error";
	error_messages_bar.innerText = "コメント取得中...";
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

export default init;
