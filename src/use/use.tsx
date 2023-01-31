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

import "./use.scss";

import comments from "../../assets/img/comments.png";
import menu from "../../assets/img/menu.png";
import popup from "../../assets/img/popup.png";

/*
const url = (filename: string) => {
	return chrome.runtime.getURL(`assets/img/${filename}`);
};
*/
const steps = [
	{
		step: 1,
		text: "準備",
		children: [
			{
				text: "ドコモアニメストアの任意のアニメ作品ページにアクセスします。",
				img: menu,
				imgAlt: "再生ボタンが追加された作品ページ",
			},
			{
				text: "各パートに表示された「コメントを表示しながら再生」ボタンをクリックします。",
				img: null,
				imgAlt: null,
			},
		],
	},
	{
		step: 2,
		text: "ポップアップの操作",
		children: [
			{
				text: "前項で選択したパートの再生ページが新しいタブで開きます。",
				img: null,
				imgAlt: null,
			},
			{
				text: "再生ページで再生が開始されたら、拡張機能のポップアップを開きます。",
				img: popup,
				imgAlt: "拡張機能のポップアップページ",
			},
			{
				text: "ニコニコ動画の動画検索が始まります。",
				img: null,
				imgAlt: null,
			},
			{
				text: "動画リストからコメントを表示したい動画選択します。",
				img: null,
				imgAlt: null,
			},
			{
				text: "動画ID欄に選択したニコニコ動画の動画IDが入力されます。",
				img: null,
				imgAlt: null,
			},
		],
	},
	{
		step: 3,
		text: "コメントの表示",
		children: [
			{
				text: "動画ID欄に指定の動画IDが入力されていることを確認します。",
				img: null,
				imgAlt: null,
			},
			{
				text: "「表示」ボタンをクリックするとコメントが表示されます。",
				img: comments,
				imgAlt: "コメントが表示された様子",
			},
		],
	},
	{
		step: 4,
		text: "コメントのダウンロード",
		children: [
			{
				text: "動画ID欄に指定の動画IDが入力されていることを確認します。",
				img: null,
				imgAlt: null,
			},
			{
				text: "「保存」ボタンをクリックするとコメントのダウンロードが開始されます",
				img: null,
				imgAlt: null,
			},
		],
	},
	{
		step: 5,
		text: "ダウンロードしたコメントの表示",
		children: [
			{
				text: "コメントファイルの読み込み欄でファイルを選択",
				img: null,
				imgAlt: null,
			},
			{
				text: "ファイルを選択するとコメントが表示されます。",
				img: null,
				imgAlt: null,
			},
		],
	},
];

const Use = () => {
	return (
		<>
			<h1>
				<i class="codicon codicon-question" />
				<span>つかいかた</span>
			</h1>
			{steps.map((step, i) => (
				<section>
					<h2>
						<span class="number">{i + 1}.&nbsp;</span>
						<span class="text">{step.text}</span>
					</h2>
					{step.children.map((child, j) => (
						<div class="step">
							<p>
								<span class="number">
									{i + 1}-{j + 1}.&nbsp;
								</span>
								<span class="text">{child.text}</span>
							</p>
							{child.img && <img src={child.img} alt={child.imgAlt} />}
						</div>
					))}
				</section>
			))}
		</>
	);
};

export default Use;
