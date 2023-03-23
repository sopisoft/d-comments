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

import init from "./init";
import play from "./play";

/**
 * 発火用関数
 * @param movieId
 * @param data ファイルからコメントを読み込むときコメントデータ。ファイルからの読み込みでない場合は、undefined。
 */
const fire = async (movieId: string, data: string) => {
	const { b, s, container, d, video } = init();

	/**
	 * エラーメッセージを表示する
	 * @param message エラーメッセージ
	 * @param code　エラーコード　もしくは　null
	 */
	const setMessage = (message: string, code: string | null) => {
		d.style.display = "block";
		code
			? (d.innerText = `${message}\nエラーコード : ${code}`)
			: (d.innerText = `${message}`);
		container.appendChild(b);
		return;
	};

	/**
	 * reasonCode に合わせたエラーメッセージを表示する
	 * @param reasonCode movieData["data"]["reasonCode"]
	 */
	const setReason = (reasonCode: string) => {
		switch (reasonCode) {
			case "PPV_VIDEO":
				setMessage(
					"有料動画のためコメントを取得できませんでした。",
					reasonCode,
				);
				break;
			default:
				setMessage("コメントの取得に失敗しました。", reasonCode);
		}
	};

	// ファイルからコメントを読み込むとき
	if (data) {
		const e = JSON.parse(data);
		if (e["threadData"]) {
			play(e["threadData"], b, s, container, d, video);
		} else {
			setMessage("コメントの取得に失敗しました。", null);
		}
	}
	// サーバーからコメントを取得するとき
	else {
		// サーバーから動画情報を取得する
		chrome.runtime
			.sendMessage({
				type: "movieData",
				movieId: movieId,
			})
			.then((movieData) => {
				console.log(movieData);
				if (movieData?.["meta"]["status"] === 200) {
					// サーバーからコメントを取得する
					chrome.runtime
						.sendMessage({
							type: "threadData",
							movieData: movieData,
						})
						.then((threadData) => {
							play(threadData, b, s, container, d, video);
						});
				} else if (movieData?.["data"]) {
					setReason(movieData["data"]["reasonCode"]);
				} else {
					setMessage(
						"動画情報の取得に失敗しました。",
						movieData ? movieData["meta"]["status"] : null,
					);
					console.log(movieData);
				}
			});
	}
};

export default fire;
