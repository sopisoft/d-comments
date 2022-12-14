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
  /** スクロールモードかどうか */
  isScrollMode: false,
  /** 設定「スクロールモードを利用可能にする」の値 */
  ScrollConfig: true,
  /** コメントコンテナ上にマウスカーソルがあるか */
  isMouseOver: false,
  /** 作品再生時刻 */
  time: "",
};

let windowScrolledHeight = window.scrollY;
window.addEventListener("scroll", () => {
  windowScrolledHeight = window.scrollY;
});

let windowInnerHeight = window.innerHeight;
window.addEventListener("resize", () => {
  windowInnerHeight = window.innerHeight;
});

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
  /**
   * 設定の変更を監視する
   */
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `設定 ${key} (namespace "${namespace}" ) が更新されました`,
        `\n更新前 : ${oldValue} | 更新後 : ${newValue}`
      );
      switch (key) {
        case "スクロールモードを利用可能にする":
          status.ScrollConfig = newValue;
          break;
        case "コメント欄の幅 (0～100%)":
          const n = Number(newValue);
          const w = (100 - n) as number;
          video.style.width = String(w) + "%";
          container.style.width = String(newValue) + "%";
          break;
      }
    }
  });
  Config.getConfig("スクロールモードを利用可能にする", (value) => {
    status.ScrollConfig = value as boolean;
  });

  /**
   * 再生時刻
   */
  setTimeout(function main() {
    if (!status.isScrollMode) {
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
      if (status.time !== `${hours}${minutes}${seconds}`) {
        status.time = `${hours}${minutes}${seconds}`;
        s.innerHTML = status.time;
      }
    }
    setTimeout(main, 120);
  }, 120);

  /**
   * 任意のスレッドのコメントを表示する
   * @param fork コメントの fork
   * @returns コメント
   */
  const getThreadComments = (fork: string) => {
    const threads = threadData["threads"]
      .filter((thread: { [x: string]: string }) => {
        return thread["fork"] === fork;
      })
      .map((thread: any) => {
        return thread;
      });
    if (threads.length > 1) {
      return threads[1]["comments"];
    }
    return threads[0]["comments"];
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
  const checkIsScrollModeEnabled = () => {
    if (status.ScrollConfig === true) {
      if (status.isMouseOver) {
        status.isScrollMode = true;
        s.innerText = "スクロールモード";
        s.style.background = "#eb5528";
        s.style.color = "#ffffff";
      } else {
        s.innerHTML = status.time;
        status.isScrollMode = false;
        s.style.background = "#000000cc";
      }
    } else {
      status.isScrollMode = false;
      s.innerHTML = status.time;
      status.isScrollMode = false;
      s.style.background = "#000000cc";
    }
  };
  ul.addEventListener("mouseover", () => {
    status.isMouseOver = true;
    checkIsScrollModeEnabled();
  });
  ul.addEventListener("mouseleave", () => {
    status.isMouseOver = false;
    checkIsScrollModeEnabled();
  });

  /**
   * コメントを取得して表示する
   */
  getComments().then((comments) => {
    d.innerText = "";
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
        d.innerText =
          "作品パートが変更されました。\nコメントを再取得してください。";
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
      if (target && !status.isScrollMode) {
        /**
         * コメントコンテナのスクロール必要量
         **/
        const scrollHeight = target.offsetTop - ul.offsetHeight;

        let ulScrolledHeight = ul.scrollTop;
        ul.addEventListener("scroll", () => {
          ulScrolledHeight = ul.scrollTop;
        });

        const ulScrollLength = Math.abs(scrollHeight - ulScrolledHeight);

        /**
         * コメントコンテナのスクロールがコンテナの高さの½以上必要か
         **/
        const isScrollBehaviorSmooth =
          windowInnerHeight / 2 - ulScrollLength > 0;
        /**
         * ページ全体が⅛以上スクロールされたか
         **/
        const isWindowScrolledEnough =
          windowScrolledHeight - windowInnerHeight / 8 > 0;

        if (isScrollBehaviorSmooth && !isWindowScrolledEnough) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        } else if (!isWindowScrolledEnough) {
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
