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

export type config = {
	key: string;
	value: string | number | boolean;
	options?: Array<{ name: string; value: string }>;
	type: "text" | "checkbox" | "number" | "color" | "select";
	text?: string;
};
export const defaultConfigs: Array<config> = [
	{
		key: "ポップアップを開いたとき最後に入力した動画IDを表示する",
		value: true,
		type: "checkbox",
	},
	{
		key: "ポップアップを開いたとき自動で動画検索を開始する",
		value: true,
		type: "checkbox",
	},
	{ key: "スクロールモードを利用可能にする", value: true, type: "checkbox" },
	{
		key: "自動スクロールの実行間隔 (ミリ秒)",
		value: 120,
		type: "number",
	},
	{
		key: "コメント欄の幅 (px)",
		value: 1000,
		type: "number",
	},
	{
		key: "コメント欄のスクールバーを表示する",
		value: false,
		type: "checkbox",
	},
	{
		key: "コメント欄の背景色",
		value: "#000000",
		type: "color",
	},
	{
		key: "コメント欄の背景不透明度 (%)",
		value: 35,
		type: "number",
	},
	{
		key: "コメントの文字色",
		value: "#FFFFFF",
		type: "color",
	},
	{
		key: "作品再生画面にオーバーレイ表示",
		value: false,
		type: "checkbox",
	},
	{
		key: "画面の上部分からの距離 (%)",
		value: 5,
		type: "number",
	},
	{
		key: "画面の左部分からの距離 (%)",
		value: 10,
		type: "number",
	},
	{
		key: "コメント欄の高さ (%)",
		value: 85,
		type: "number",
	},
	{
		key: "flow_comments",
		value: false,
		type: "checkbox",
		text: "コメントを右から左へ流す",
	},
	{
		key: "way_to_render_comments",
		value: "list",
		options: [
			{ value: "list", name: "リスト" },
			{ value: "list_overlay", name: "リスト（オーバーレイ）" },
			{ value: "right_to_left", name: "右から左に流す" },
		],
		type: "select",
		text: "コメントの表示方法",
	},
	{
		key: "作品ページに「コメントを表示しながら再生」ボタンを追加する",
		value: true,
		type: "checkbox",
	},
	{
		key: "「コメントを表示しながら再生」ボタンでは新しいタブで開く",
		value: true,
		type: "checkbox",
	},
	{
		key: "投稿者コメント",
		value: false,
		type: "checkbox",
	},
	{
		key: "通常コメント",
		value: true,
		type: "checkbox",
	},
	{
		key: "かんたんコメント",
		value: false,
		type: "checkbox",
	},
	{
		key: "allow_login_to_nicovideo",
		value: false,
		type: "checkbox",
		text: "ニコニコ動画へのログインを許可する",
	},
];

/**
 * 設定を取得し、Callback を呼ぶ
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 */
export const getConfig = (
	key: string,
	callback: (value: string | number | boolean) => void,
) => {
	chrome.storage.local.get([key]).then((result) => {
		const defaultValue = defaultConfigs.find((item) => item.key === key)?.value;
		if (result[key] === undefined || null) {
			console.log(`${key} (${result[key]}) ${defaultValue}`);
		} else {
			console.log(key, result[key]);
		}
		callback(result[key] ?? defaultValue);
	});
};

/**
 * 設定を保存する
 * @param key 設定キー
 * @param value 設定値
 */
export const setConfig = (key: string, value: string | number | boolean) => {
	chrome.storage.local.set({ [key]: value }).then(() => {
		console.log(key, value);
	});
};
