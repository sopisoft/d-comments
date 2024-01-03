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
import { type config, getConfig } from "../config";
import { setWorkInfo } from "../danime_dom/watch";

import NiconiComments, { type InputFormat } from "@xpadev-net/niconicomments";
import browser from "webextension-polyfill";

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
  threadData: Threads,
  button_closes_comment_container: HTMLButtonElement,
  status_bar: HTMLDivElement,
  container: HTMLDivElement,
  error_messages_bar: HTMLDivElement,
  video: HTMLVideoElement
) => {
  /**
   * 設定の変更を監視する
   */
  browser.storage.onChanged.addListener((changes) => {
    for (const [key] of Object.entries(changes) as [
      config["key"],
      browser.Storage.StorageChange,
    ][]) {
      switch (key) {
        case "show_owner_comments": {
          renderComments();
          break;
        }
        case "show_main_comments": {
          renderComments();
          break;
        }
        case "show_easy_comments": {
          renderComments();
          break;
        }
        case "comment_rendering_method": {
          renderComments();
          break;
        }
      }
    }
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

  ul.addEventListener("mouseover" || "mouseleave", async () => {
    const isMouseOver = ul.matches(":hover");
    if ((await getConfig("enable_scroll_mode")) && isMouseOver) {
      status_bar.innerText = "スクロールモード";
      status_bar.style.backgroundColor = "rgb(235 80 40 / 100%)";
    } else if (!isMouseOver) {
      window.requestAnimationFrame(setCurrentTime);
      status_bar.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
  });

  /**
   * 再生時刻
   */
  const setCurrentTime = () => {
    if (!ul.matches(":hover")) {
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
        status_bar.innerText = `${hours}${minutes}${seconds}`;
      }
    }
    window.requestAnimationFrame(setCurrentTime);
  };
  window.requestAnimationFrame(setCurrentTime);

  /**
   * 指定されたコメントを返す
   * @param Callback
   */

  const getComments = async (callback: (comments: nv_comment[]) => void) => {
    const threads = threadData.threads;
    const comments: nv_comment[] = [];

    function f(fork: thread["forkLabel"]) {
      for (const thread of threads) {
        thread
          .filter((thread) => thread.fork === fork)
          .map((thread) => {
            thread.comments.map((comment) => {
              comments.push(comment);
            });
          });
      }
    }
    switch (true) {
      case await getConfig("show_owner_comments"):
        f("owner");
        break;
      case await getConfig("show_main_comments"):
        f("main");
        break;
      case await getConfig("show_easy_comments"):
        f("easy");
        break;
    }

    callback(comments);
  };

  /**
   * コメントを再生時刻でソートする
   * @returns コメント
   */

  const sortComments = async (comments: nv_comment[]) => {
    function filterComments(comments: nv_comment[]) {
      return comments.filter((comment) => {
        return comment.score >= 0;
      });
    }

    function sortComments(comments: nv_comment[]) {
      return comments.sort((a, b) => {
        return a.vposMs - b.vposMs;
      });
    }
    let result = [];
    result = filterComments(comments);
    result = sortComments(result);
    return result;
  };

  /**
   * コメントリストを設置する
   */

  const setComments = (comments: nv_comment[]) => {
    const contents = async (comments: nv_comment[]) => {
      const lists: HTMLElement[] = [];
      comments.map((comment) => {
        const li = document.createElement("li");
        li.innerText = comment.body;
        Object.assign(li.style, {
          fontSize: "16px",
          lineHeight: 1.4,
          padding: "5px",
          borderBottom: "1px solid #484848d1",
        });
        li.setAttribute("data-time", comment.vposMs.toString());
        lists.push(li);
      });
      return lists;
    };

    const appendList = (lists: HTMLElement[]) => {
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
  const scroll = async (callBack: number) => {
    if (
      (Math.round(callBack / 10) * 10) %
        Number(await getConfig("scroll_interval_ms")) ===
      0
    ) {
      const currentTime = Math.round(video.currentTime * 1000);

      const li = ul.querySelectorAll(
        "li[data-time]"
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

      if (target && !ul.matches(":hover")) {
        const scrollHeight = target.offsetTop - ul.offsetHeight;

        const scrollLength = Math.abs(scrollHeight - ul.scrollTop);
        if (window.innerHeight / 2 - scrollLength > 0) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        } else {
          ul.scroll({
            top: scrollHeight,
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
    (window || video)?.addEventListener(
      "resize",
      () => {
        setCanvasStyle();
      },
      { passive: true }
    );
    const nicoComments = new NiconiComments(
      canvas,
      threadData.threads as unknown as InputFormat,
      {
        format: "v1",
        keepCA: true,
        scale: 1,
      }
    );
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
        Config.getConfig("comment_rendering_method", (value) => {
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
