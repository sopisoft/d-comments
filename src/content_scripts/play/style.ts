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

import * as Config from "../config";

const configs = {
	overlay: false,
	width: 300,
	height: 100,
	top: 0,
	left: 0,
	r: 0,
	g: 0,
	b: 0,
	a: 0.35,
	color: "#FFFFFF",
	scrollBar: false,
};

const setRoot = () => {
	const rgba = `${configs.r} ${configs.g} ${configs.b} / ${configs.a}%`;
	const root = `
:root {
  --d-comments-text-color:${configs.color};
  --d-comments-container-position:${configs.overlay ? "absolute" : "relative"};
  --d-comments-container-z-index:${configs.overlay ? 1000 : 1};
  --d-comments-container-width:${configs.width}px;
  --d-comments-container-height:${configs.overlay ? configs.height : 100}vh;
  --d-comments-container-top:${configs.overlay ? configs.top : 0}%;
  --d-comments-container-left:${configs.overlay ? configs.left : 0}%;
  --d-comments-container-background:rgba(${rgba})
}`;
	if (
		window.location.href.match(
			/https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/,
		)
	) {
		const style = document.createElement("style");
		style.id = "d-comments-style-root";
		style.innerHTML = root;
		document.getElementById("d-comments-style-root")?.remove();
		document.head.appendChild(style);
	}
};

const setScrollBar = () => {
	const scrollBar = `
#d-comments-container ul::-webkit-scrollbar {
  display:block;
}
#d-comments-container ul::-webkit-scrollbar-track {
  background-color: #7a787830;
}
#d-comments-container ul::-webkit-scrollbar-thumb {
  background-color: #f9fafe4a;
}`;
	const scrollBarNone = `
#d-comments-container ul::-webkit-scrollbar {
  display:none;
}`;
	if (
		window.location.href.match(
			/https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/,
		)
	) {
		const style = document.createElement("style");
		style.id = "d-comments-style-scrollBar";
		const css = `${configs.scrollBar ? scrollBar : scrollBarNone}`;
		style.innerHTML = css;
		document.getElementById("d-comments-style-scrollBar")?.remove();
		document.head.appendChild(style);
	}
};

const hexToRgb = (color: string) => {
	return Object.fromEntries(
		(
			(color.match(/^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/) ? color : "000")
				.replace(/^#?(.*)$/, (_, hex) =>
					hex.length === 3 ? hex.replace(/./g, "$&$&") : hex,
				)
				.match(/../g) ?? []
		).map((c: string, i: number) => ["rgb".charAt(i), parseInt(`0x${c}`)]),
	) as { r: number; g: number; b: number };
};

export const init = () => {
	Config.getConfig("コメント欄のスクールバーを表示する", (value) => {
		configs.scrollBar = value as boolean;
	});
	Config.getConfig("作品再生画面にオーバーレイ表示", (value) => {
		configs.overlay = value as boolean;
	});
	Config.getConfig("コメント欄の幅 (px)", (value) => {
		configs.width = value as number;
	});
	Config.getConfig("コメント欄の高さ (%)", (value) => {
		configs.height = value as number;
	});
	Config.getConfig("画面の上部分からの距離 (%)", (value) => {
		configs.top = value as number;
	});
	Config.getConfig("画面の左部分からの距離 (%)", (value) => {
		configs.left = value as number;
	});
	Config.getConfig("コメント欄の背景色", (value) => {
		configs.r = hexToRgb(value as string).r;
		configs.g = hexToRgb(value as string).g;
		configs.b = hexToRgb(value as string).b;
	});
	Config.getConfig("コメント欄の背景不透明度 (%)", (value) => {
		configs.a = value as number;
	});
	Config.getConfig("コメントの文字色", (value) => {
		configs.color = value as string;
		setTimeout(setRoot, 0);
		setScrollBar();
	});
};

chrome.storage.onChanged.addListener((changes, namespace) => {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		switch (key) {
			case "コメント欄のスクールバーを表示する": {
				configs.scrollBar = newValue;
				setScrollBar();
				break;
			}
			case "作品再生画面にオーバーレイ表示": {
				configs.overlay = newValue;
				setTimeout(setRoot, 0);
				break;
			}
			case "コメント欄の幅 (px)": {
				configs.width = newValue;
				setTimeout(setRoot, 0);
				break;
			}
			case "コメント欄の高さ (%)": {
				configs.height = newValue;
				setTimeout(setRoot, 0);
				break;
			}
			case "画面の上部分からの距離 (%)": {
				configs.top = newValue;
				setTimeout(setRoot, 0);
				break;
			}
			case "画面の左部分からの距離 (%)": {
				configs.left = newValue;
				setTimeout(setRoot, 0);
				break;
			}
			case "コメント欄の背景色": {
				configs.r = hexToRgb(newValue).r;
				configs.g = hexToRgb(newValue).g;
				configs.b = hexToRgb(newValue).b;
				setTimeout(setRoot, 0);
				break;
			}
			case "コメント欄の背景不透明度 (%)": {
				configs.a = newValue;
				setTimeout(setRoot, 0);
				break;
			}
			case "コメントの文字色": {
				configs.color = newValue;
				setTimeout(setRoot, 0);
				break;
			}
		}
	}
});

/**
 * 視聴ページで追加する要素のスタイル
 */
export const setDefaultStyle = () => {
	const style = document.createElement("style");
	style.id = "d-comments-style";
	const normalFont = chrome.runtime.getURL(
		"src/assets/fonts/BIZ_UDPGothic.ttf",
	);
	const bolderFont = chrome.runtime.getURL(
		"src/assets/fonts/BIZ_UDPGothic-Bold.ttf",
	);
	const css = `
#d-comments-wrapper {
  display:flex;
  flex-direction:row;
  width:100%;
  height:100%;
}
#d-comments-container {
  position:var(--d-comments-container-position, relative);
  z-index:var(--d-comments-container-z-index, 1);
  width:var(--d-comments-container-width ,300px);
  height:var(--d-comments-container-height, 100vh);
  top:var(--d-comments-container-top, 0%);
  left:var(--d-comments-container-left, 0%);
  background:var(--d-comments-container-background, rgba(0,0,0,0.35));
  display:flex;
  flex-direction:column;
  overflow:hidden;
  overflow-y:scroll;
  font-family:BIZ_UDPGothic;
  font-size:medium;
  font-weight:500;
  font-style:normal;
  color:var(--d-comments-text-color, white);
}
#d-comments-container::-webkit-scrollbar {
  display:none;
}
#d-comments-container>[id*="d-comments-status"] {
  text-align:center;
  padding:4px;
}
#d-comments-container #d-comments-status-scrolling {
  background:rgb(235 80 40 / 100%);
}
#d-comments-container #d-comments-error {
  width:90%;
  margin:1em auto;
  z-index:-1;
  line-height:2;
}
#d-comments-container #d-comments-close {
  width:80%;
  height:2em;
  margin:0 auto;
  padding:3px;
  border-radius:15px;
  cursor:pointer;
}
#d-comments-container ul {
  border-top:0.1px solid #484848;
  margin-block-start:0px;
  margin-block-end:0px;
  padding-inline-start:0px;
  z-index:1;
  list-style:none;
  overflow:hidden;
  overflow-y:scroll;
}
#d-comments-container ul li {
  font-size:16px;
  line-height:1.4;
  padding:5px;
  border-bottom:1px solid #484848d1;
}
@font-face {
  font-family:"BIZ_UDPGothic";
  src: url(${normalFont}) format("truetype");
  font-weight:normal;
}
@font-face {
  font-family:"BIZ_UDPGothic";
  src: url(${bolderFont}) format("truetype");
  font-weight:bolder;
}
`;
	style.innerHTML = css;
	document.getElementById("d-comments-style")?.remove();
	document.head.appendChild(style);
};
