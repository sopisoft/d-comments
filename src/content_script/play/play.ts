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
  /** コメントコンテナ上にマウスカーソルがあるか */
  isMouseOver: false,
  /** コメントリストのUlをスクール中か */
  isUlScrolling: false,
  /** 作品再生時刻 */
  time: "",
  /** ページのURL */
  href: window.location.href,
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
  comments: [] as any,
  lists: [] as HTMLElement[],
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
  /**
   * 設定の変更を監視する
   */
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `設定 ${key} (${namespace}) が更新されました`,
        `\n更新前 : ${oldValue} | 更新後 : ${newValue}`
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
          showComments();
          break;
        }
        case "通常コメント": {
          configs.mainThread = newValue;
          showComments();
          break;
        }
        case "かんたんコメント": {
          configs.easyThread = newValue;
          showComments();
          break;
        }
      }
    }
  });
  window.addEventListener(
    "resize",
    () => {
      status.windowHeight = window.innerHeight;
    },
    { passive: true }
  );

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
    showComments();
  });

  /**
   * コメントリストのUl
   */
  const ul = document.createElement("ul");
  container.appendChild(ul);
  ul.style.display = "none";
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
    { passive: true }
  );
  ul.addEventListener(
    "mouseover",
    () => {
      status.isMouseOver = true;
      checkIsScrollModeEnabled();
    },
    { passive: true }
  );
  ul.addEventListener(
    "mouseleave",
    () => {
      status.isMouseOver = false;
      checkIsScrollModeEnabled();
    },
    { passive: true }
  );

  /**
   * スクロールモード
   */
  const checkIsScrollModeEnabled = () => {
    if (configs.ScrollConfig === true) {
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

  /**
   * 再生時刻
   */
  const setCurrentTime = () => {
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
  const getComments = async (callback: (comments: any) => any) => {
    const a = async () => {
      global.comments.length = 0;
      configs.ownerThread && global.comments.push(getThreadComments("owner"));
    };
    const b = async () => {
      configs.mainThread && global.comments.push(getThreadComments("main"));
    };
    const c = async () => {
      configs.easyThread && global.comments.push(getThreadComments("easy"));
    };
    const d = async () => {
      callback(global.comments.flat(1));
    };
    a()
      .then(() => b())
      .then(() => c())
      .then(() => d());
  };

  /**
   * コメントを再生時刻でソートする
   * @returns コメント
   */
  const sortComments = async (comments) => {
    comments.filter((comment: { [x: string]: number }) => {
      return comment["score"] > 0;
    });
    comments.sort((a: { [x: string]: number }, b: { [x: string]: number }) => {
      return a["vposMs"] - b["vposMs"];
    });
    return comments;
  };

  /**
   * コメントリストを設置する
   */
  const setComments = (comments) => {
    global.lists.length = 0;
    const contents = async (comments: any[]) => {
      comments.map((comment: { [x: string]: string; body: string }) => {
        const li = document.createElement("li");
        li.innerText = comment.body;
        li.setAttribute("data-time", comment["vposMs"]);
        global.lists.push(li);
      });
      return global.lists;
    };
    contents(comments).then((lists) => {
      const df = document.createDocumentFragment();
      lists.map((list) => {
        df.appendChild(list);
      });
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
      ul.appendChild(df);
    });
  };

  /**
   * URLの変更を監視する
   * URLが変更されたら作品パートが変更されたと判断し、コメントの再読み込みを促す
   */
  const checkLocationNow = () => {
    if (status.href !== location.href) {
      ul.remove();
      d.style.display = "block";
      d.innerText =
        "作品パートが変更されました。\nコメントを再取得してください。";
      container.appendChild(b);
      status.href = location.href;
    }
    window.requestAnimationFrame(checkLocationNow);
  };
  window.requestAnimationFrame(checkLocationNow);

  /** コメントを再生時刻に合わせてスクロールする */
  const scroll = (callBack) => {
    if ((Math.round(callBack / 10) * 10) % configs.autoScrollInterval === 0) {
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
        status.scrollHeight = target.offsetTop - ul.offsetHeight;

        const scrollLength = Math.abs(
          status.scrollHeight - status.scrolledHeight
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
   * コメントリストを表示する
   */
  const showComments = () => {
    getComments((comments) => {
      if (comments.length > 0) {
        sortComments(comments).then((comments) => {
          setComments(comments);
          d.innerText = "";
          d.style.display = "none";
          b.remove();
          ul.style.display = "block";
          window.requestAnimationFrame(scroll);
        });
      } else {
        d.style.display = "block";
        d.innerText = "表示できるコメントはありません。";
        while (ul.firstChild) {
          ul.removeChild(ul.firstChild);
        }
        ul.style.display = "none";
      }
    });
  };
};

export default play;
