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
import * as Config from "./config";
import { addMenu } from "./danime_dom/mypage";
import { setWorkInfo } from "./danime_dom/watch";
import exportJson from "./export";
import fire from "./play/fire";

switch (location.pathname) {
	case "/animestore/ci_pc": {
		Config.getConfig(
			"作品ページに「コメントを表示しながら再生」ボタンを追加する",
			(value) => {
				value && addMenu();
			},
		);
		break;
	}
	case "/animestore/sc_d_pc": {
		setWorkInfo();

		// called from popup/popup.tsx
		browser.runtime.onMessage.addListener((message, sender) => {
			if (message.type === "renderComments") {
				fire(message.movieId, message.data);
			}
			if (message.type === "exportJson") {
				exportJson(message.movieId);
			}
			return undefined;
		});
		break;
	}
	default:
		break;
}
