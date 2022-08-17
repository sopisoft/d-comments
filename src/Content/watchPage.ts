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

import style from "./style";

const showComments = async (movieId: string) => {
  const video = document.getElementById("video") as HTMLVideoElement;
  document.head.appendChild(style);

  /**
   * すべての要素をラップする
   */
  const wrapper =
    document.getElementById("d-comments-wrapper") ??
    document.createElement("div");
  if (!document.getElementById("d-comments-wrapper")) {
    wrapper.id = "d-comments-wrapper";
    video.parentElement?.before(wrapper);
    wrapper.append(video.parentElement as HTMLElement);
  }

  document.getElementById("d-comments-container") &&
    document.getElementById("d-comments-container")?.remove();
  /**
   * コメントコンテナ
   */
  const container = document.createElement("div");
  container.id = "d-comments-container";
  wrapper.appendChild(container);

  /**
   * 作品再生時刻を表示する
   */
  const watch = document.createElement("div");
  watch.id = "d-comments-watch";
  container.appendChild(watch);
  let time = new Object();
  setTimeout(function main() {
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
      watch.innerHTML = `${hours}${minutes}${seconds}`;
    }
    setTimeout(main, 100);
  }, 100);

  /**
   * エラーメッセージ表示用 paragraph
   */
  const p = document.createElement("p");
  p.style.display = "block";
  p.textContent = "コメントを読み込んでいます...";
  container.appendChild(p);

  /**
   * コメントコンテナを閉じるボタン
   */
  const b = document.createElement("button");
  b.id = "d-comments-close";
  b.textContent = "サイドバーを閉じる";
  b.setAttribute("type", "button");
  b.addEventListener("click", () => {
    b.parentElement?.remove();
  });

  chrome.runtime.sendMessage(
    {
      type: "movieData",
      movieId: movieId,
    },
    (watchData) => {
      console.log("watchData", watchData);
      if (!watchData) {
        return;
      }
      if (watchData["meta"]["status"] !== 200) {
        console.log("error", watchData ? watchData["meta"]["status"] : "Error");
        if (watchData["data"]["reasonCode"] === "PPV_VIDEO") {
          p.style.display = "block";
          p.textContent = "有料動画のためコメントを取得できませんでした。";
          container.appendChild(b);
          return;
        } else {
          p.style.display = "block";
          p.innerHTML = `<p>コメントの取得に失敗しました。</p><p>エラーコード: ${watchData["data"]["reasonCode"]}</p>`;
          container.appendChild(b);
          return;
        }
      } else {
        chrome.runtime.sendMessage(
          {
            type: "threadData",
            watchData: watchData,
          },
          async (threadData) => {
            console.log("threads", threadData["threads"]);
            const threads = threadData["threads"];

            /**
             * 任意のスレッドのコメントを表示する
             * @param fork コメントの fork
             * @returns コメント
             */
            const getThreadComments = (fork: string) => {
              const thread = threads
                .filter((thread) => {
                  return thread["fork"] === fork;
                })
                .map((thread) => {
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
              comments.filter((comment) => {
                return comment["score"] > 0;
              });
              comments.sort((a, b) => {
                return a["vposMs"] - b["vposMs"];
              });
              return comments;
            };

            /**
             * コメントリストのUl
             */
            const ul = document.createElement("ul");
            container.appendChild(ul);

            await getComments().then((comments) => {
              p.style.display = "none";
              p.textContent = "";
              b.remove();

              const contents = async (comments) => {
                const lists = [] as HTMLElement[];
                comments.map((comment) => {
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
              href = location.href;
              setInterval(() => {
                if (href !== location.href) {
                  ul.remove();
                  p.style.display = "block";
                  p.textContent =
                    "作品パートが変更されました。" +
                    "コメントを再取得してください。";
                  container.appendChild(b);
                  href = location.href;
                }
              }, 1000);

              // コメントを再生時刻に合わせてスクロールする
              const li = ul.querySelectorAll(
                "li[data-time]"
              ) as NodeListOf<HTMLElement>;
              setTimeout(function main() {
                const currentTime = Math.round(video.currentTime * 1000);
                const list = [] as HTMLElement[]; // 再生時刻に合致するコメントを格納する配列
                for (let i = 0; i < li.length; i++) {
                  const time = Number(li[i].getAttribute("data-time"));
                  if (currentTime > time) {
                    list.push(li[i]);
                  } else {
                    list.unshift(li[i]) || null;
                  }
                }

                const target =
                  (list[li.length - 1] as HTMLElement) ??
                  (list[0] as HTMLElement);
                if (target) {
                  const scroll = target.offsetTop - ul.offsetHeight;
                  ul.scroll({
                    top: scroll,
                    behavior: "smooth",
                  });
                }
                setTimeout(main, 100);
              }, 100);
            });
          }
        );
      }
    }
  );
};

export default showComments;
