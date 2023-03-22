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
import { JSX, createEffect, createSignal } from "solid-js";

import "./options.scss";
import * as Config from "../content_scripts/config";
import Editor from "./editor";

const Options = () => {
	const [options, setOptions] = createSignal<Array<Config.config>>(
		Config.defaultConfigs,
	);

	const t: Array<Config.config> = [];
	Config.defaultConfigs.forEach((i, idx, array) => {
		Config.getConfig(i.key, (value) => {
			const r: Config.config = {
				key: i.key,
				value: value,
				type: i.type,
			};
			t.push(r);
			if (idx === array.length - 1) {
				setOptions(t);
			}
		});
	});

	const setOption = (m: string, v: string | number | boolean) => {
		const d = Config.defaultConfigs.find((i) => i.key === m)?.type;
		const t: Array<Config.config> = options().filter((n) => n.key !== m);
		const r: Config.config = {
			key: m,
			value: v,
			type: d as string,
		};
		setOptions(t.concat(r));
	};

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onChange = (e: any) => {
		const n = e.target.name;
		if (e.target.type === "checkbox") {
			const v = options().find((i) => i.key === n)?.value;
			setOption(n, !v);
			Config.setConfig(n, !v);
		} else {
			const v = e.target.value;
			setOption(n, v);
			Config.setConfig(n, v);
		}
	};

	chrome.storage.onChanged.addListener((changes, namespace) => {
		for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
			setOption(key, newValue);
		}
	});

	return (
		<>
			<header>
				<span class="inner">
					<i class="codicon codicon-settings-gear" />
				</span>
				<h1>設定</h1>
			</header>
			<div class="wrapper">
				<div id="left-side">
					<div>
						<h2>ポップアップ</h2>
						<Editor
							p="ポップアップを開いたとき最後に入力した動画IDを表示する"
							o={options()}
							update={onChange}
						/>
						<Editor
							p="ポップアップを開いたとき自動で動画検索を開始する"
							o={options()}
							update={onChange}
						/>
					</div>
					<div>
						<h2>作品ページ</h2>
						<Editor
							p="作品ページに「コメントを表示しながら再生」ボタンを追加する"
							o={options()}
							update={onChange}
						/>
						<Editor
							p="「コメントを表示しながら再生」ボタンでは新しいタブで開く"
							o={options()}
							update={onChange}
						/>
					</div>
					<div>
						<h2>コメントの種類</h2>
						<Editor p="投稿者コメント" o={options()} update={onChange} />
						<Editor p="通常コメント" o={options()} update={onChange} />
						<Editor p="かんたんコメント" o={options()} update={onChange} />
					</div>{" "}
					<div>
						<h2>ニコニコ動画へのログイン</h2>
						<Editor
							p="allow_login_to_nicovideo"
							o={options()}
							update={onChange}
						/>
					</div>
				</div>
				<div id="right-side">
					<div>
						<h2>視聴ページ</h2>
						<Editor
							p="スクロールモードを利用可能にする"
							o={options()}
							update={onChange}
						/>
						<Editor
							p="自動スクロールの実行間隔 (ミリ秒)"
							o={options()}
							update={onChange}
						/>
						<Editor p="コメント欄の幅 (px)" o={options()} update={onChange} />
						<Editor
							p="コメント欄のスクールバーを表示する"
							o={options()}
							update={onChange}
						/>
					</div>
					<div>
						<h2>コメント欄の色</h2>
						<Editor p="コメント欄の背景色" o={options()} update={onChange} />
						<Editor
							p="コメント欄の背景不透明度 (%)"
							o={options()}
							update={onChange}
						/>
						<Editor p="コメントの文字色" o={options()} update={onChange} />
					</div>
					<div>
						<h2>コメントリストのオーバーレイ （β版）</h2>
						<Editor
							p="作品再生画面にオーバーレイ表示"
							o={options()}
							update={onChange}
						/>
						<div
							style={{
								opacity: options().find(
									(i) => i.key === "作品再生画面にオーバーレイ表示",
								)?.value
									? 1
									: 0.6,
							}}
						>
							<Editor
								p="画面の上部分からの距離 (%)"
								o={options()}
								update={onChange}
							/>
							<Editor
								p="画面の左部分からの距離 (%)"
								o={options()}
								update={onChange}
							/>
							<Editor
								p="コメント欄の高さ (%)"
								o={options()}
								update={onChange}
							/>
						</div>
					</div>
				</div>
			</div>

			<footer>
				<span class="info">
					{chrome.runtime.getManifest().name}
					&nbsp;-&nbsp;Version&nbsp;{chrome.runtime.getManifest().version}
				</span>
				<span class="info">
					&copy;&nbsp;{new Date().getFullYear()}&nbsp;
					{chrome.runtime.getManifest().author}
				</span>
				<div class="links">
					<span class="link">
						<a
							href="https://forms.office.com/r/JR9KksWHJD"
							target="_blank"
							rel="noreferrer"
						>
							<i class="codicon codicon-feedback" />
							&nbsp;
							<span>FeedBack</span>
						</a>
					</span>
					<span class="link">
						<a
							href="https://github.com/gobosan/d-comments"
							target="_blank"
							rel="noreferrer"
						>
							<i class="codicon codicon-mark-github" />
							&nbsp;
							<span>GitHub</span>
						</a>
					</span>
				</div>
			</footer>
		</>
	);
};

export default Options;
