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

import { Match, Switch, createSignal } from "solid-js";
import { render } from "solid-js/web";

import * as Config from "../content_scripts/config";
import "./popup.scss";

const Popup = () => {
	const [tabPage, setTabPage] = createSignal("");

	const [movieId, setMovieId] = createSignal("");
	const [word, setWord] = createSignal("");

	const [owner, setOwner] = createSignal<Owner>();
	const [result, setResult] = createSignal<SearchResult>();

	type SearchResult = {
		meta: {
			status: number;
			totalCount: number;
			id: string;
		};
		data: {
			contentId: string;
			title: string;
			userId: string;
			channelId: string;
			commentCounter: number;
			thumbnailUrl: string;
			viewCounter: number;
			lengthSeconds: number;
		}[];
	};

	type Owner = {
		contentId: string;
		ownerId: string;
		ownerName: string;
		ownerIconUrl: string;
	}[];

	/**
	 * 作品視聴ページか判定
	 * @param href window.location.href
	 * @returns boolean
	 */
	const isWatchPage = (href: string) => {
		return href.match(
			/https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/,
		)
			? true
			: false;
	};

	/**
	 * 視聴ページでコメントを表示する
	 */
	const sendMessage = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			isWatchPage(tabs[0]?.url ?? "") &&
				chrome.tabs.sendMessage(tabs[0].id as number, {
					type: "renderComments",
					movieId: movieId(),
					data: undefined,
				}),
				(response: string) => {
					console.log(response);
				};
		});
	};

	/**
	 * コメントをファイルで出力する
	 */
	const exportJson = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			isWatchPage(tabs[0]?.url ?? "") &&
				chrome.tabs.sendMessage(tabs[0].id as number, {
					type: "exportJson",
					movieId: movieId(),
				}),
				(response: string) => {
					console.log(response);
				};
		});
	};

	/**
	 * 動画ID用 Input ハンドラ
	 */
	const handler = (value: string) => {
		window.localStorage.setItem("movieId", value);
		setMovieId(value);
	};

	/**
	 * コメントファイル Input ハンドラ
	 */

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onFileInputChange = (e: any) => {
		console.log(e.target.files);
		const f = e.target.files?.[0];
		if (f) {
			const reader = new FileReader();
			reader.onload = () => {
				console.log("FileData", reader.result);
				loadFile(reader.result as string);
			};
			reader.readAsText(f);
		} else {
			return;
		}
	};

	/**
	 * コメントファイル読み込み
	 */
	const loadFile = (data: string) => {
		if (data.length > 0) {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				isWatchPage(tabs[0]?.url ?? "") &&
					chrome.tabs.sendMessage(tabs[0].id as number, {
						type: "renderComments",
						movieId: movieId(),
						data: data,
					}),
					(response: string) => {
						console.log(response);
					};
			});
		}
	};

	/**
	 * スナップショットAPIを使ってキーワードで動画を検索
	 * @param word キーワード
	 * @returns 動画情報
	 * @see https://site.nicovideo.jp/search-api-docs/snapshot
	 */
	const search = async (word: string) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			isWatchPage(tabs[0]?.url ?? "") &&
				chrome.runtime.sendMessage(
					{
						type: "search",
						word: word,
						UserAgent: "d-comments",
					},
					(response) => {
						if (response.meta.status === 200) {
							console.log("検索結果", response);
							setResult(response);
							response.data.forEach(
								(item: {
									userId: string;
									contentId: string;
									channelId: string;
								}) => {
									const isUser = item.userId ? true : false;
									getOwnerInfo(
										item.contentId,
										isUser ? item.userId : item.channelId,
										isUser ? true : false,
									);
								},
							);
						} else {
							return;
						}
					},
				);
		});
	};

	/**
	 * 動画投稿者の名前、アイコンURLを取得
	 * @param contentId 動画ID
	 * @param ownerId ユーザーID または チャンネルID
	 * @param isUser ユーザーかチャンネルか
	 * @returns 動画投稿者の名前、アイコンURL
	 */
	const getOwnerInfo = (
		contentId: string,
		ownerId: string,
		isUser: boolean,
	) => {
		const res: Owner = [];
		chrome.runtime.sendMessage(
			{
				type: isUser ? "user" : "channel",
				id: ownerId,
				UserAgent: navigator.userAgent ?? "",
			},
			(response) => {
				if (response.meta.status === 200) {
					const setOwnerInfo = async () => {
						res.push({
							contentId: contentId,
							ownerId: ownerId,
							ownerName: isUser
								? response.data.user.nickname
								: response.data.channel.name,
							ownerIconUrl: isUser
								? response.data.user.icons.small
								: response.data.channel.thumbnailSmallUrl,
						});
					};
					setOwnerInfo().then(() => {
						setOwner((owner) => (owner ? [...owner, ...res] : res));
					});
				} else {
					return;
				}
			},
		);
		return res;
	};

	const init = (title: string) => {
		Config.getConfig(
			"ポップアップを開いたとき最後に入力した動画IDを表示する",
			(value) => {
				if (value === true) {
					setMovieId(window.localStorage.getItem("movieId") ?? "");
				}
			},
		);
		Config.getConfig(
			"ポップアップを開いたとき自動で動画検索を開始する",
			(value) => {
				if (value === true) {
					setWord(title);
					search(title);
				}
			},
		);
	};

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		console.log(tabs[0]?.url);
		isWatchPage(tabs[0]?.url ?? "") &&
			(setTabPage("watch"), init(tabs[0]?.title ?? ""));
	});

	return (
		<>
			<a
				aria-label="設定"
				href={chrome.runtime.getURL("src/options/index.html")}
				class="btn-option"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span>
					<i class="codicon codicon-settings-gear" />
				</span>
			</a>

			<Switch fallback={NotActive}>
				<Match when={tabPage() === "watch"}>
					<label>
						<p>
							動画ID
							<a
								href="https://dic.nicovideo.jp/a/id"
								target="_blank"
								rel="noopener noreferrer"
							>
								【詳細】
							</a>
						</p>
						<div>
							<input
								class="input-movieId"
								value={movieId()}
								onInput={(e) => handler((e.target as HTMLInputElement).value)}
							/>
							<button
								type="button"
								aria-label="コメントをファイルで出力する"
								class="btn btn-text"
								onClick={() => {
									exportJson();
								}}
							>
								保存
							</button>
							<button
								type="button"
								aria-label="視聴ページでコメントを表示する"
								class="btn btn-text"
								onClick={() => {
									sendMessage();
								}}
							>
								表示
							</button>
						</div>
					</label>
					<label>
						<p>コメントファイル読み込み</p>
						<div>
							<input
								class="input-file"
								type="file"
								accept=".json"
								onChange={onFileInputChange}
							/>
						</div>
					</label>
					<label>
						<p>検索ワード</p>
						<div>
							<input
								class="input-search"
								value={word()}
								onChange={(e) => setWord((e.target as HTMLInputElement).value)}
							/>
							<button
								type="button"
								aria-label="検索"
								class="btn btn-icon"
								onClick={() => {
									search(word());
								}}
							>
								<span>
									<i class="codicon codicon-search" />
								</span>
							</button>
						</div>
					</label>
					<ul class="result">
						{result()?.meta?.status === 200 &&
							result()?.data?.map((item, index) => (
								// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
								<li
									onClick={() => {
										handler(item.contentId);
									}}
								>
									{/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
									<a class="title">
										<span>{item.title}</span>
									</a>
									<div class="wrapper">
										<img src={item.thumbnailUrl} alt={item.title} />
										<div class="info">
											<p>動画情報</p>
											<div class="owner">
												<img
													src={
														owner()?.find(
															(ownerItem) =>
																ownerItem.contentId === item.contentId,
														)?.ownerIconUrl
													}
													alt={
														owner()?.find(
															(ownerItem) =>
																ownerItem.contentId === item.contentId,
														)?.ownerName
													}
												/>
												<p>
													{
														owner()?.find(
															(ownerItem) =>
																ownerItem.contentId === item.contentId,
														)?.ownerName
													}
												</p>
											</div>
											{/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
											<a>再生数&emsp;&emsp;&nbsp;:&nbsp;{item.viewCounter}</a>
											{/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
											<a>コメント数&nbsp;:&nbsp;{item.commentCounter}</a>
											{/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
											<a>
												動画の尺&emsp;&nbsp;:&nbsp;
												{Math.floor(item.lengthSeconds / 3600) > 0
													? `${Math.floor(item.lengthSeconds / 3600)}時間`
													: ""}
												{Math.floor(item.lengthSeconds / 60) > 0
													? `${Math.floor(item.lengthSeconds / 60)}分`
													: ""}
												{item.lengthSeconds % 60}秒
											</a>
										</div>
									</div>
								</li>
							))}
					</ul>
				</Match>
			</Switch>
		</>
	);
};

const NotActive = () => {
	return (
		<div class="not-active">
			<div class="message">
				<i class="codicon codicon-info" />
				<p>現在のタブでは使用できません。</p>
			</div>
			<div class="link">
				<a
					href={chrome.runtime.getURL("src/options/index.html")}
					target="_blank"
					rel="noopener noreferrer"
					class="btn"
				>
					<i class="codicon codicon-settings-gear" />
					<span>設定</span>
				</a>
			</div>
			<div class="link">
				<a
					href={chrome.runtime.getURL("src/use/index.html")}
					target="_blank"
					rel="noopener noreferrer"
					class="btn"
				>
					<i class="codicon codicon-question" />
					<span>つかいかた</span>
				</a>
			</div>
		</div>
	);
};

render(() => Popup, document.querySelector("body")!);
