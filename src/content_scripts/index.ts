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

import * as Config from "./config";
import * as util from "./util";
import fire from "./play/fire";
import exportJson from "./export";

const href = window.location.href;

switch (true) {
	case /https:\/\/animestore\.docomo\.ne\.jp\/animestore\/ci_pc\?workId=\d+/.test(
		href,
	): {
		Config.getConfig(
			"作品ページに「コメントを表示しながら再生」ボタンを追加する",
			(value) => {
				value && util.addMenu();
			},
		);
		break;
	}
	case /https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/.test(
		href,
	): {
		util.setInfo();
		chrome.runtime.onMessage.addListener((message) => {
			if (message.type === "showComments") {
				fire(message.movieId, message.data);
			}
			if (message.type === "exportJson") {
				exportJson(message.movieId);
			}
		});
		break;
	}
}
