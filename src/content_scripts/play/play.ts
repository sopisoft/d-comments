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
import { setWorkInfo } from "../danime_dom/watch";

import NiconiComments from "@xpadev-net/niconicomments";

const status = {
	/** スクロールモードかどうか */
	isScrollMode: false,
	/** コメントコンテナ上にマウスカーソルがあるか */
	isMouseOver: false,
	/** コメントリストのUlをスクール中か */
	isUlScrolling: false,
	/** 作品再生時刻 */
	time: "",
	/** ビューポートの高さ */
	windowHeight: window.innerHeight,
	/** コメント欄のスクロール必要量 */
	scrollHeight: 0,
	/** コメント欄のスクロール量 */
	scrolledHeight: 0,
};

const configs = {
	/** 設定「スクロールモードを利用可能にする」の値 */
	ScrollConfig: true,
	/** 設定「自動スクロールの実行間隔 (ミリ秒)」の値 */
	autoScrollInterval: 600,
	/** 投稿者コメントを表示するか */
	ownerThread: false,
	/** 通常コメントを表示するか */
	mainThread: false,
	/** かんたんコメントを表示するか */
	easyThread: false,
};

const global = {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	comments: [] as any,
	lists: [] as HTMLElement[],
};

/**
 * スレッドデータからコメントを設置する
 * @param threadData
 * @param button_closes_comment_container コメントコンテナを閉じるボタン
 * @param status_bar ステータス表示バー
 * @param container コメントコンテナ
 * @param error_messages_bar エラーメッセージ表示バー
 * @param video
 */
const play = (
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	threadData: any,
	button_closes_comment_container: HTMLButtonElement,
	status_bar: HTMLDivElement,
	container: HTMLDivElement,
	error_messages_bar: HTMLDivElement,
	video: HTMLVideoElement,
) => {
	/**
	 * 設定の変更を監視する
	 */
	chrome.storage.onChanged.addListener((changes, namespace) => {
		for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
			console.log(
				`設定 ${key} (${namespace}) が更新されました`,
				`\n更新前 : ${oldValue} | 更新後 : ${newValue}`,
			);
			switch (key) {
				case "スクロールモードを利用可能にする":
					configs.ScrollConfig = newValue;
					break;
				case "自動スクロールの実行間隔 (ミリ秒)":
					configs.autoScrollInterval = newValue;
					break;
				case "投稿者コメント": {
					configs.ownerThread = newValue;
					renderComments();
					break;
				}
				case "通常コメント": {
					configs.mainThread = newValue;
					renderComments();
					break;
				}
				case "かんたんコメント": {
					configs.easyThread = newValue;
					renderComments();
					break;
				}
				case "way_to_render_comments": {
					renderComments();
					break;
				}
			}
		}
	});
	window.addEventListener("resize", () => {
		status.windowHeight = window.innerHeight;
	});

	/**
	 * ステータスに設定値を設定する
	 */
	Config.getConfig("スクロールモードを利用可能にする", (value) => {
		configs.ScrollConfig = value as boolean;
	});
	Config.getConfig("自動スクロールの実行間隔 (ミリ秒)", (value) => {
		configs.autoScrollInterval = value as number;
	});
	Config.getConfig("投稿者コメント", (value) => {
		configs.ownerThread = value as boolean;
	});
	Config.getConfig("通常コメント", (value) => {
		configs.mainThread = value as boolean;
	});
	Config.getConfig("かんたんコメント", (value) => {
		configs.easyThread = value as boolean;
		renderComments();
	});

	/**
	 * コメントリストのUl
	 */
	const ul = document.createElement("ul");
	Object.assign(ul.style, {
		borderTop: "0.1px solid #484848",
		marginBlockStart: "0px",
		marginBlockEnd: "0px",
		paddingInlineStart: "0px",
		zIndex: 1,
		listStyle: "none",
		overflow: "hidden",
		overflowY: "scroll",
	});
	ul.style.display = "none";
	container.appendChild(ul);
	status.scrolledHeight = ul.scrollTop;
	ul.addEventListener(
		"scroll",
		() => {
			if (!status.isUlScrolling) {
				status.isUlScrolling = true;
				window.requestAnimationFrame(() => {
					status.scrolledHeight = ul.scrollTop;
					status.isUlScrolling = false;
				});
			}
		},
		{ passive: true },
	);
	ul.addEventListener(
		"mouseover",
		() => {
			status.isMouseOver = true;
			checkIsScrollModeEnabled();
		},
		{ passive: true },
	);
	ul.addEventListener(
		"mouseleave",
		() => {
			status.isMouseOver = false;
			checkIsScrollModeEnabled();
		},
		{ passive: true },
	);

	/**
	 * スクロールモード
	 */
	const checkIsScrollModeEnabled = () => {
		if (configs.ScrollConfig && status.isMouseOver) {
			status.isScrollMode = true;
			status_bar.innerText = "スクロールモード";
			status_bar.style.backgroundColor = "rgb(235 80 40 / 100%)";
		} else if (!status.isMouseOver) {
			status.isScrollMode = false;
			window.requestAnimationFrame(setCurrentTime);
			status_bar.style.backgroundColor = "rgba(0, 0, 0, 0)";
		}
	};

	/**
	 * 再生時刻
	 */
	const setCurrentTime = () => {
		if (!status.isScrollMode) {
			const hours = `${
				Math.floor(video.currentTime / 3600) > 0
					? `${Math.floor(video.currentTime / 3600)} 時間 `
					: ""
			}`;
			const minutes = `${
				Math.floor(video.currentTime / 60) % 60 > 0
					? `${Math.floor(video.currentTime / 60) % 60} 分 `
					: ""
			}`;
			const seconds = `${Math.floor(video.currentTime % 60)} 秒`;
			if (`${hours}${minutes}${seconds}` !== status_bar.innerText) {
				status.time = `${hours}${minutes}${seconds}`;
				status_bar.innerText = status.time;
			}
		}
		window.requestAnimationFrame(setCurrentTime);
	};
	window.requestAnimationFrame(setCurrentTime);

	/**
	 * 任意のスレッドのコメントを返す
	 * @param fork コメントの fork
	 * @returns コメント
	 */
	const getThreadComments = (fork: string) => {
		const threads = threadData["threads"]
			.filter((thread: { [x: string]: string }) => {
				return thread["fork"] === fork;
			})
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
			.map((thread: any) => {
				return thread;
			});
		// main thread が二つある場合があり、この時 thread[1] を返す
		if (threads.length > 1) {
			return threads[1]["comments"];
		}
		return threads[0]["comments"];
	};

	/**
	 * 指定されたコメントを返す
	 * @param Callback
	 */

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const getComments = async (callback: (comments: any) => any) => {
		global.comments.length = 0;
		(async () => {
			configs.ownerThread && global.comments.push(getThreadComments("owner"));
			configs.mainThread && global.comments.push(getThreadComments("main"));
			configs.easyThread && global.comments.push(getThreadComments("easy"));
		})().then(() => {
			callback(global.comments.flat(1));
		});
	};

	/**
	 * コメントを再生時刻でソートする
	 * @returns コメント
	 */
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const sortComments = async (comments: any[][]) => {
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		function filterComments(comments: any[]) {
			return comments.filter((comment: { [x: string]: number }) => {
				return comment["score"] >= 0;
			});
		}
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		function sortComments(comments: any[][]) {
			return comments.sort(
				// rome-ignore lint/suspicious/noExplicitAny: <explanation>
				(a: any[], b: any[]) => {
					// @ts-ignore
					return a["vposMs"] - b["vposMs"];
				},
			);
		}
		let result = [];
		result = filterComments(comments);
		result = sortComments(result);
		return result;
	};

	/**
	 * コメントリストを設置する
	 */

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const setComments = (comments: any[]) => {
		global.lists.length = 0;
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		const contents = async (comments: any[]) => {
			comments.map((comment: { [x: string]: string; body: string }) => {
				const li = document.createElement("li");
				li.innerText = comment.body;
				Object.assign(li.style, {
					fontSize: "16px",
					lineHeight: 1.4,
					padding: "5px",
					borderBottom: "1px solid #484848d1",
				});
				li.setAttribute("data-time", comment["vposMs"]);
				global.lists.push(li);
			});
			return global.lists;
		};
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		const appendList = (lists: any[]) => {
			const df = document.createDocumentFragment();
			lists.map((list) => {
				df.appendChild(list);
			});
			while (ul.firstChild) {
				ul.removeChild(ul.firstChild);
			}
			ul.appendChild(df);
		};
		contents(comments).then((lists) => {
			appendList(lists);
		});
		window.requestAnimationFrame(scroll);
	};

	/**
	 * フレームの読み込みが完了したとき作品パートが変更されたと判断し、コメントの再読み込みを促す
	 */
	video.addEventListener("loadeddata", () => {
		ul.remove();
		error_messages_bar.style.display = "block";
		error_messages_bar.innerText =
			"作品パートが変更されました。\nコメントを再取得してください。";
		container.appendChild(button_closes_comment_container);
		setWorkInfo();
	});

	/** コメントを再生時刻に合わせてスクロールする */
	const scroll = (callBack: number) => {
		if ((Math.round(callBack / 10) * 10) % configs.autoScrollInterval === 0) {
			const currentTime = Math.round(video.currentTime * 1000);

			const li = ul.querySelectorAll(
				"li[data-time]",
			) as NodeListOf<HTMLElement>;

			const list = new Array<HTMLElement>();
			for (let i = 0; i < li.length; i++) {
				const time = Number(li[i].getAttribute("data-time"));
				if (currentTime > time) {
					list.push(li[i]);
				} else {
					list.unshift(li[i]) || null;
				}
			}

			const target =
				(list[li.length - 1] as HTMLElement) ?? (list[0] as HTMLElement);

			if (target && !status.isScrollMode) {
				status.scrollHeight = target.offsetTop - ul.offsetHeight;

				const scrollLength = Math.abs(
					status.scrollHeight - status.scrolledHeight,
				);
				if (status.windowHeight / 2 - scrollLength > 0) {
					target.scrollIntoView({
						behavior: "smooth",
						block: "end",
						inline: "nearest",
					});
				} else {
					ul.scroll({
						top: status.scrollHeight,
						behavior: "instant" as ScrollBehavior,
					});
				}
			}
		}
		window.requestAnimationFrame(scroll);
	};

	/**
	 * 右から左に流れるコメントを設置
	 */
	const setFlowComments = () => {
		const canvas = document.createElement("canvas");
		canvas.width = 1920;
		canvas.height = 1080;
		Object.assign(canvas.style, {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			background: "transparent",
			zIndex: 2,
		});
		canvas.id = "d-comments-canvas";
		document.getElementById("d-comments-canvas")?.remove();
		video.parentElement?.appendChild(canvas);
		const setCanvasStyle = () => {
			if (video.clientWidth / video.clientHeight > 1920 / 1080) {
				canvas.style.height = `${video.clientHeight}px`;
				canvas.style.width = `${(video.clientHeight / 1080) * 1920}px`;
			} else {
				canvas.style.width = `${video.clientWidth}px`;
				canvas.style.height = `${(video.clientWidth / 1920) * 1080}px`;
			}
		};
		setCanvasStyle();
		(window || video)?.addEventListener("resize", () => {
			setCanvasStyle(), { passive: true };
		});
		const data = threadData["threads"];
		const nicoComments = new NiconiComments(canvas, data, {
			format: "v1",
			keepCA: true,
			scale: 1,
		});
		const render = (callBack: number) => {
			if ((Math.round(callBack / 10) * 10) % 10 === 0) {
				nicoComments.drawCanvas(Math.floor(video.currentTime * 100));
			}
			window.requestAnimationFrame(render);
		};
		window.requestAnimationFrame(render);
	};

	/**
	 * コメントリストを表示する
	 */
	const renderComments = () => {
		container.style.display = "flex";
		document.getElementById("d-comments-canvas")?.remove();
		getComments((comments) => {
			if (comments.length > 0) {
				Config.getConfig("way_to_render_comments", (value) => {
					if (value === "right_to_left") {
						container.style.display = "none";
						setFlowComments();
					} /*else if (value === "right_to_left_and_list") {
						setFlowComments();
						sortComments(comments).then((comments) => {
							setComments(comments);
							ul.style.display = "block";
						});
					} */ else {
						sortComments(comments).then((comments) => {
							setComments(comments);
							ul.style.display = "block";
						});
					}
				});
				error_messages_bar.innerText = "";
				error_messages_bar.style.display = "none";
				button_closes_comment_container.remove();
				window.requestAnimationFrame(setCurrentTime);
			} else {
				error_messages_bar.style.display = "block";
				error_messages_bar.innerText = "表示できるコメントはありません。";
				while (ul.firstChild) {
					ul.removeChild(ul.firstChild);
				}
				ul.style.display = "none";
			}
		});
	};
};

export default play;
