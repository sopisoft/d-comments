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

const status = {
  scroll: false,
};

/**
 * スレッドデータからコメントを設置する
 * @param threadData
 * @param b コメントコンテナを閉じるボタン
 * @param s ステータス
 * @param container コメントコンテナ
 * @param d エラーメッセージ表示用 paragraph
 * @param video
 */
const play = (
  threadData: any,
  b: HTMLButtonElement,
  s: HTMLDivElement,
  container: HTMLDivElement,
  d: HTMLDivElement,
  video: HTMLVideoElement
) => {
  console.log("threads", threadData["threads"]);
  const threads = threadData["threads"];

  let time = new Object();
  setTimeout(function main() {
    if (!status.scroll) {
      const hours = `${
        Math.floor(video.currentTime / 3600) > 0
          ? Math.floor(video.currentTime / 3600) + "&nbsp;時間&nbsp;"
          : ""
      }`;
      const minutes = `${
        Math.floor(video.currentTime / 60) % 60 > 0
          ? (Math.floor(video.currentTime / 60) % 60) + "&nbsp;分&nbsp;"
          : ""
      }`;
      const seconds = `${Math.floor(video.currentTime % 60)}&nbsp;秒`;
      if (time !== `${hours}${minutes}${seconds}`) {
        time = `${hours}${minutes}${seconds}`;
        s.innerHTML = `${hours}${minutes}${seconds}`;
      }
    }
    setTimeout(main, 100);
  }, 100);

  /**
   * 任意のスレッドのコメントを表示する
   * @param fork コメントの fork
   * @returns コメント
   */
  const getThreadComments = (fork: string) => {
    const thread = threads
      .filter((thread: { [x: string]: string }) => {
        return thread["fork"] === fork;
      })
      .map((thread: any) => {
        return thread;
      });
    if (thread.length > 1) {
      return thread[1]["comments"];
    }
    return thread[0]["comments"];
  };

  //const ownerThread = getThreadComments("owner");
  const mainThread = getThreadComments("main");
  //const easyThread = getThreadComments("easy");

  /**
   * コメントを再生時刻でソートする
   * @returns コメント
   */
  const getComments = async () => {
    const comments = mainThread;
    comments.filter((comment: { [x: string]: number }) => {
      return comment["score"] > 0;
    });
    comments.sort((a: { [x: string]: number }, b: { [x: string]: number }) => {
      return a["vposMs"] - b["vposMs"];
    });
    return comments;
  };

  /**
   * コメントリストのUl
   */
  const ul = document.createElement("ul");
  container.appendChild(ul);

  /**
   * スクロールモード
   */
  let isMouseOver = false;
  let isScrollMode = false;
  let ScrollConfig = false;
  Config.getConfig("スクロールモードを利用可能にする", (value) => {
    ScrollConfig = value as boolean;
  });
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if ((key = "スクロールモードを利用可能にする")) {
        ScrollConfig = newValue;
      }
    }
  });

  const checkIsScrollModeEnabled = () => {
    if (ScrollConfig === true) {
      isScrollMode = isMouseOver;
      if (isMouseOver) {
        status.scroll = true;
        s.innerText = "スクロールモード";
        s.style.background = "#eb5528";
        s.style.color = "#ffffff";
      } else {
        status.scroll = false;
        s.style.background = "#000000cc";
      }
    } else {
      isScrollMode = false;
      status.scroll = false;
      s.style.background = "#000000cc";
    }
  };
  ul.addEventListener("mouseover", () => {
    isMouseOver = true;
    checkIsScrollModeEnabled();
  });
  ul.addEventListener("mouseleave", () => {
    isMouseOver = false;
    checkIsScrollModeEnabled();
  });

  /**
   * コメントを取得して表示する
   */
  getComments().then((comments) => {
    d.innerHTML = "";
    d.style.display = "none";
    b.remove();

    const contents = async (comments: any[]) => {
      const lists = [] as HTMLElement[];
      comments.map((comment: { [x: string]: string; body: string }) => {
        const li = document.createElement("li");
        li.innerText = comment.body;
        li.setAttribute("data-time", comment["vposMs"]);
        lists.push(li);
      });
      return lists;
    };
    contents(comments).then((lists) => {
      const df = document.createDocumentFragment();
      lists.map((list) => {
        df.appendChild(list);
      });
      ul.appendChild(df);
    });

    /*
    URLの変更を監視する
    URLが変更されたら作品パートが変更されたと判断し、コメントの再読み込みを促す
    */
    let href = new Object();
    href = window.location.href;
    setInterval(() => {
      if (href !== location.href) {
        ul.remove();
        d.style.display = "block";
        d.innerHTML =
          "<p>作品パートが変更されました。</p><a>コメントを再取得してください。</a>";
        container.appendChild(b);
        href = location.href;
      }
    }, 1000);

    // コメントを再生時刻に合わせてスクロールする
    setTimeout(function main() {
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
      if (target && !isScrollMode) {
        const scrollHeight = target.offsetTop - ul.offsetHeight;

        let windowHeight = window.innerHeight;
        window.addEventListener("resize", () => {
          windowHeight = window.innerHeight;
        });

        let scrolledHeight = ul.scrollTop;
        ul.addEventListener("scroll", () => {
          scrolledHeight = ul.scrollTop;
        });

        const scrollLength = Math.abs(scrollHeight - scrolledHeight);
        if (windowHeight / 2 - scrollLength > 0) {
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
      setTimeout(main, 100);
    }, 100);
  });
};

export default play;
