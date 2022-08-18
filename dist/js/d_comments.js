/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/content_script/index.ts":
/*!*************************************!*\
  !*** ./src/content_script/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const util = __importStar(__webpack_require__(/*! ./util */ "./src/content_script/util.ts"));
const watchPage_1 = __importDefault(__webpack_require__(/*! ./watchPage */ "./src/content_script/watchPage.ts"));
const href = window.location.href;
const isMenuPage = href.match(/https:\/\/animestore\.docomo\.ne\.jp\/animestore\/ci_pc\?workId=\d+/)
    ? true
    : false;
const isWatchPage = href.match(/https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/)
    ? true
    : false;
window.onload = async () => {
    switch (true) {
        case isMenuPage:
            util.addMenu();
            break;
        case isWatchPage: {
            let url = new Object();
            url = window.location.href;
            setInterval(() => {
                if (url !== window.location.href) {
                    url = window.location.href;
                    util.setInfo();
                }
            }, 1000);
            util.setInfo();
            break;
        }
    }
};
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "showComments" && isWatchPage) {
        (0, watchPage_1.default)(message.movieId);
    }
});


/***/ }),

/***/ "./src/content_script/style.ts":
/*!*************************************!*\
  !*** ./src/content_script/style.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * 視聴ページで追加する要素のスタイル
 */
const style = document.createElement("style");
style.innerHTML = `
            #d-comments-wrapper {
              display:flex;
              width:100%;
              height:100%;
              z-index:1;
            }
            #d-comments-container {
              z-index:1;
              width:300px;
              display:flex;
              flex-direction:column;
              overflow:hidden;
              overflow-y:scroll;
              color:white;
            }
            #d-comments-container ::-webkit-scrollbar {
              display: none;
            }
            #d-comments-container #d-comments-watch {
              text-align:center;
            }
            #d-comments-container #d-comments-close {
              width:80%;
              margin:0 auto;
              border-radius:10px;
              cursor:pointer;
            }
            #d-comments-container ul {
              margin-block-start:0px;
              margin-block-end:0px;
              padding-inline-start:0px;
              z-index:1;
              list-style:none;
              overflow:hidden;
              overflow-y:scroll;
            }
            #d-comments-container ul li {
              font-size:16px;
              padding:5px;
              border-bottom:1px solid rgb(12 0 193);
            }
            *::-webkit-scrollbar {
              display: none;
            }
            `;
exports["default"] = style;


/***/ }),

/***/ "./src/content_script/util.ts":
/*!************************************!*\
  !*** ./src/content_script/util.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setInfo = exports.addMenu = void 0;
/**
 * 作品ページの各パートに新しいタブで開くボタンを追加する
 */
const addMenu = () => {
    const items = document.querySelectorAll(".itemModule.list a");
    for (const item of items) {
        const partID = item?.getAttribute("href")?.replace(/[^0-9]/g, "");
        const bgColor = window.getComputedStyle(item).backgroundColor;
        const a = document.createElement("a");
        a.href = `sc_d_pc?partId=${partID}`;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.id = `d-comments-${partID}`;
        a.innerText = "コメントを表示しながら再生";
        item.parentElement?.parentElement?.appendChild(a);
        const style = document.createElement("style");
        style.innerHTML = `
      #d-comments-${partID} {
        text-align:center;
        border-top: 1px solid rgb(224 224 224);
        background-color: ${bgColor};
      }
    `;
        document.head.appendChild(style);
    }
};
exports.addMenu = addMenu;
/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 */
const setInfo = async () => {
    const apiUrl = document
        .getElementById("restApiUrl")
        ?.getAttribute("value")
        ?.split("&")[0];
    const res = await fetch(`${apiUrl}&${window.location.search.split("?")[1]}`);
    const data = await res.json();
    const title = data["data"]["title"];
    const description = data["data"]["partExp"];
    document.title = title ?? document.title;
    document
        .querySelector("meta[name=Description]")
        ?.setAttribute("content", description);
};
exports.setInfo = setInfo;


/***/ }),

/***/ "./src/content_script/watchPage.ts":
/*!*****************************************!*\
  !*** ./src/content_script/watchPage.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const style_1 = __importDefault(__webpack_require__(/*! ./style */ "./src/content_script/style.ts"));
const showComments = async (movieId) => {
    const video = document.getElementById("video");
    document.head.appendChild(style_1.default);
    /**
     * すべての要素をラップする
     */
    const wrapper = document.getElementById("d-comments-wrapper") ??
        document.createElement("div");
    if (!document.getElementById("d-comments-wrapper")) {
        wrapper.id = "d-comments-wrapper";
        video.parentElement?.before(wrapper);
        wrapper.append(video.parentElement);
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
        const hours = `${Math.floor(video.currentTime / 3600) > 0
            ? Math.floor(video.currentTime / 3600) + "&nbsp;時間&nbsp;"
            : ""}`;
        const minutes = `${Math.floor(video.currentTime / 60) % 60 > 0
            ? (Math.floor(video.currentTime / 60) % 60) + "&nbsp;分&nbsp;"
            : ""}`;
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
    chrome.runtime.sendMessage({
        type: "movieData",
        movieId: movieId,
    }, (watchData) => {
        console.log("watchData", watchData);
        if (!watchData) {
            return;
        }
        if (watchData["meta"]["status"] !== 200) {
            console.log("error", watchData ? watchData["meta"]["status"] : "Error");
            if (watchData["data"]["reasonCode"] === "PPV_VIDEO") {
                p.style.display = "block";
                p.textContent = "有料動画のためコメントを取得できませんでした。";
                container.appendChild(p);
                container.appendChild(b);
                return;
            }
            else {
                p.style.display = "block";
                p.innerHTML = `<p>コメントの取得に失敗しました。</p><p>エラーコード: ${watchData["data"]["reasonCode"]}</p>`;
                container.appendChild(p);
                container.appendChild(b);
                return;
            }
        }
        else {
            chrome.runtime.sendMessage({
                type: "threadData",
                watchData: watchData,
            }, async (threadData) => {
                console.log("threads", threadData["threads"]);
                const threads = threadData["threads"];
                /**
                 * 任意のスレッドのコメントを表示する
                 * @param fork コメントの fork
                 * @returns コメント
                 */
                const getThreadComments = (fork) => {
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
                    p.remove();
                    b.remove();
                    const contents = async (comments) => {
                        const lists = [];
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
                    href = window.location.href;
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
                    setTimeout(function main() {
                        const currentTime = Math.round(video.currentTime * 1000);
                        const li = ul.querySelectorAll("li[data-time]");
                        const list = new Array();
                        for (let i = 0; i < li.length; i++) {
                            const time = Number(li[i].getAttribute("data-time"));
                            if (currentTime > time) {
                                list.push(li[i]);
                            }
                            else {
                                list.unshift(li[i]) || null;
                            }
                        }
                        const target = list[li.length - 1] ??
                            list[0];
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
            });
        }
    });
};
exports["default"] = showComments;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/content_script/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGVBQWU7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBLGtCQUFlOzs7Ozs7O1VDek5mO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kLWNvbW1lbnRzLy4vc3JjL2NvbnRlbnRfc2NyaXB0L2luZGV4LnRzIiwid2VicGFjazovL2QtY29tbWVudHMvLi9zcmMvY29udGVudF9zY3JpcHQvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vZC1jb21tZW50cy8uL3NyYy9jb250ZW50X3NjcmlwdC91dGlsLnRzIiwid2VicGFjazovL2QtY29tbWVudHMvLi9zcmMvY29udGVudF9zY3JpcHQvd2F0Y2hQYWdlLnRzIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZC1jb21tZW50cy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2QtY29tbWVudHMvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG4vKlxyXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZC1jb21tZW50cy5cclxuXHJcbiAgICBkLWNvbW1lbnRzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcclxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XHJcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxyXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cclxuXHJcbiAgICBkLWNvbW1lbnRzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXHJcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxyXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxyXG4gICAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cclxuXHJcbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxyXG4gICAgYWxvbmcgd2l0aCBkLWNvbW1lbnRzLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cclxuKi9cclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn0pO1xyXG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB1dGlsID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL3V0aWxcIikpO1xyXG5jb25zdCB3YXRjaFBhZ2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi93YXRjaFBhZ2VcIikpO1xyXG5jb25zdCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbmNvbnN0IGlzTWVudVBhZ2UgPSBocmVmLm1hdGNoKC9odHRwczpcXC9cXC9hbmltZXN0b3JlXFwuZG9jb21vXFwubmVcXC5qcFxcL2FuaW1lc3RvcmVcXC9jaV9wY1xcP3dvcmtJZD1cXGQrLylcclxuICAgID8gdHJ1ZVxyXG4gICAgOiBmYWxzZTtcclxuY29uc3QgaXNXYXRjaFBhZ2UgPSBocmVmLm1hdGNoKC9odHRwczpcXC9cXC9hbmltZXN0b3JlXFwuZG9jb21vXFwubmVcXC5qcFxcL2FuaW1lc3RvcmVcXC9zY19kX3BjXFw/cGFydElkPVxcZCsvKVxyXG4gICAgPyB0cnVlXHJcbiAgICA6IGZhbHNlO1xyXG53aW5kb3cub25sb2FkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgY2FzZSBpc01lbnVQYWdlOlxyXG4gICAgICAgICAgICB1dGlsLmFkZE1lbnUoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBpc1dhdGNoUGFnZToge1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gbmV3IE9iamVjdCgpO1xyXG4gICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVybCAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLnNldEluZm8oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0SW5mbygpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJzaG93Q29tbWVudHNcIiAmJiBpc1dhdGNoUGFnZSkge1xyXG4gICAgICAgICgwLCB3YXRjaFBhZ2VfMS5kZWZhdWx0KShtZXNzYWdlLm1vdmllSWQpO1xyXG4gICAgfVxyXG59KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qXHJcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBkLWNvbW1lbnRzLlxyXG5cclxuICAgIGQtY29tbWVudHMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxyXG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcclxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXHJcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxyXG5cclxuICAgIGQtY29tbWVudHMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcclxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXHJcbiAgICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxyXG5cclxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXHJcbiAgICBhbG9uZyB3aXRoIGQtY29tbWVudHMuICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxyXG4qL1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiDoppbogbTjg5rjg7zjgrjjgafov73liqDjgZnjgovopoHntKDjga7jgrnjgr/jgqTjg6tcclxuICovXHJcbmNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG5zdHlsZS5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAjZC1jb21tZW50cy13cmFwcGVyIHtcbiAgICAgICAgICAgICAgZGlzcGxheTpmbGV4O1xuICAgICAgICAgICAgICB3aWR0aDoxMDAlO1xuICAgICAgICAgICAgICBoZWlnaHQ6MTAwJTtcbiAgICAgICAgICAgICAgei1pbmRleDoxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgI2QtY29tbWVudHMtY29udGFpbmVyIHtcbiAgICAgICAgICAgICAgei1pbmRleDoxO1xuICAgICAgICAgICAgICB3aWR0aDozMDBweDtcbiAgICAgICAgICAgICAgZGlzcGxheTpmbGV4O1xuICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjpjb2x1bW47XG4gICAgICAgICAgICAgIG92ZXJmbG93OmhpZGRlbjtcbiAgICAgICAgICAgICAgb3ZlcmZsb3cteTpzY3JvbGw7XG4gICAgICAgICAgICAgIGNvbG9yOndoaXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgI2QtY29tbWVudHMtY29udGFpbmVyIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgI2QtY29tbWVudHMtY29udGFpbmVyICNkLWNvbW1lbnRzLXdhdGNoIHtcbiAgICAgICAgICAgICAgdGV4dC1hbGlnbjpjZW50ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAjZC1jb21tZW50cy1jb250YWluZXIgI2QtY29tbWVudHMtY2xvc2Uge1xuICAgICAgICAgICAgICB3aWR0aDo4MCU7XG4gICAgICAgICAgICAgIG1hcmdpbjowIGF1dG87XG4gICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6MTBweDtcbiAgICAgICAgICAgICAgY3Vyc29yOnBvaW50ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAjZC1jb21tZW50cy1jb250YWluZXIgdWwge1xuICAgICAgICAgICAgICBtYXJnaW4tYmxvY2stc3RhcnQ6MHB4O1xuICAgICAgICAgICAgICBtYXJnaW4tYmxvY2stZW5kOjBweDtcbiAgICAgICAgICAgICAgcGFkZGluZy1pbmxpbmUtc3RhcnQ6MHB4O1xuICAgICAgICAgICAgICB6LWluZGV4OjE7XG4gICAgICAgICAgICAgIGxpc3Qtc3R5bGU6bm9uZTtcbiAgICAgICAgICAgICAgb3ZlcmZsb3c6aGlkZGVuO1xuICAgICAgICAgICAgICBvdmVyZmxvdy15OnNjcm9sbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICNkLWNvbW1lbnRzLWNvbnRhaW5lciB1bCBsaSB7XG4gICAgICAgICAgICAgIGZvbnQtc2l6ZToxNnB4O1xuICAgICAgICAgICAgICBwYWRkaW5nOjVweDtcbiAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbToxcHggc29saWQgcmdiKDEyIDAgMTkzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICo6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGA7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHN0eWxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuLypcclxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGQtY29tbWVudHMuXHJcblxyXG4gICAgZC1jb21tZW50cyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XHJcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxyXG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcblxyXG4gICAgZC1jb21tZW50cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxyXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcclxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcclxuICAgIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXHJcblxyXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcclxuICAgIGFsb25nIHdpdGggZC1jb21tZW50cy4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXHJcbiovXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5zZXRJbmZvID0gZXhwb3J0cy5hZGRNZW51ID0gdm9pZCAwO1xyXG4vKipcclxuICog5L2c5ZOB44Oa44O844K444Gu5ZCE44OR44O844OI44Gr5paw44GX44GE44K/44OW44Gn6ZaL44GP44Oc44K/44Oz44KS6L+95Yqg44GZ44KLXHJcbiAqL1xyXG5jb25zdCBhZGRNZW51ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLml0ZW1Nb2R1bGUubGlzdCBhXCIpO1xyXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgY29uc3QgcGFydElEID0gaXRlbT8uZ2V0QXR0cmlidXRlKFwiaHJlZlwiKT8ucmVwbGFjZSgvW14wLTldL2csIFwiXCIpO1xyXG4gICAgICAgIGNvbnN0IGJnQ29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpdGVtKS5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGEuaHJlZiA9IGBzY19kX3BjP3BhcnRJZD0ke3BhcnRJRH1gO1xyXG4gICAgICAgIGEudGFyZ2V0ID0gXCJfYmxhbmtcIjtcclxuICAgICAgICBhLnJlbCA9IFwibm9vcGVuZXIgbm9yZWZlcnJlclwiO1xyXG4gICAgICAgIGEuaWQgPSBgZC1jb21tZW50cy0ke3BhcnRJRH1gO1xyXG4gICAgICAgIGEuaW5uZXJUZXh0ID0gXCLjgrPjg6Hjg7Pjg4jjgpLooajnpLrjgZfjgarjgYzjgonlho3nlJ9cIjtcclxuICAgICAgICBpdGVtLnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGBcbiAgICAgICNkLWNvbW1lbnRzLSR7cGFydElEfSB7XG4gICAgICAgIHRleHQtYWxpZ246Y2VudGVyO1xuICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiKDIyNCAyMjQgMjI0KTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtiZ0NvbG9yfTtcbiAgICAgIH1cbiAgICBgO1xyXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLmFkZE1lbnUgPSBhZGRNZW51O1xyXG4vKipcclxuICog6KaW6IG044Oa44O844K444GnIHRpdGxlIOOBqCBkZXNjcmlwdGlvbiDjgpLjg5Hjg7zjg4jjgr/jgqTjg4jjg6vjgajoqqzmmI7jgavmm7jjgY3mj5vjgYjjgotcclxuICovXHJcbmNvbnN0IHNldEluZm8gPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBhcGlVcmwgPSBkb2N1bWVudFxyXG4gICAgICAgIC5nZXRFbGVtZW50QnlJZChcInJlc3RBcGlVcmxcIilcclxuICAgICAgICA/LmdldEF0dHJpYnV0ZShcInZhbHVlXCIpXHJcbiAgICAgICAgPy5zcGxpdChcIiZcIilbMF07XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHthcGlVcmx9JiR7d2luZG93LmxvY2F0aW9uLnNlYXJjaC5zcGxpdChcIj9cIilbMV19YCk7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgIGNvbnN0IHRpdGxlID0gZGF0YVtcImRhdGFcIl1bXCJ0aXRsZVwiXTtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZGF0YVtcImRhdGFcIl1bXCJwYXJ0RXhwXCJdO1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZSA/PyBkb2N1bWVudC50aXRsZTtcclxuICAgIGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9RGVzY3JpcHRpb25dXCIpXHJcbiAgICAgICAgPy5zZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIsIGRlc2NyaXB0aW9uKTtcclxufTtcclxuZXhwb3J0cy5zZXRJbmZvID0gc2V0SW5mbztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qXHJcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBkLWNvbW1lbnRzLlxyXG5cclxuICAgIGQtY29tbWVudHMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxyXG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcclxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXHJcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxyXG5cclxuICAgIGQtY29tbWVudHMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcclxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXHJcbiAgICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxyXG5cclxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXHJcbiAgICBhbG9uZyB3aXRoIGQtY29tbWVudHMuICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxyXG4qL1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHN0eWxlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vc3R5bGVcIikpO1xyXG5jb25zdCBzaG93Q29tbWVudHMgPSBhc3luYyAobW92aWVJZCkgPT4ge1xyXG4gICAgY29uc3QgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpO1xyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZV8xLmRlZmF1bHQpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDjgZnjgbnjgabjga7opoHntKDjgpLjg6njg4Pjg5fjgZnjgotcclxuICAgICAqL1xyXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZC1jb21tZW50cy13cmFwcGVyXCIpID8/XHJcbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkLWNvbW1lbnRzLXdyYXBwZXJcIikpIHtcclxuICAgICAgICB3cmFwcGVyLmlkID0gXCJkLWNvbW1lbnRzLXdyYXBwZXJcIjtcclxuICAgICAgICB2aWRlby5wYXJlbnRFbGVtZW50Py5iZWZvcmUod3JhcHBlcik7XHJcbiAgICAgICAgd3JhcHBlci5hcHBlbmQodmlkZW8ucGFyZW50RWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImQtY29tbWVudHMtY29udGFpbmVyXCIpICYmXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkLWNvbW1lbnRzLWNvbnRhaW5lclwiKT8ucmVtb3ZlKCk7XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODoeODs+ODiOOCs+ODs+ODhuODilxyXG4gICAgICovXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29udGFpbmVyLmlkID0gXCJkLWNvbW1lbnRzLWNvbnRhaW5lclwiO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDkvZzlk4Hlho3nlJ/mmYLliLvjgpLooajnpLrjgZnjgotcclxuICAgICAqL1xyXG4gICAgY29uc3Qgd2F0Y2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgd2F0Y2guaWQgPSBcImQtY29tbWVudHMtd2F0Y2hcIjtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3YXRjaCk7XHJcbiAgICBsZXQgdGltZSA9IG5ldyBPYmplY3QoKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gbWFpbigpIHtcclxuICAgICAgICBjb25zdCBob3VycyA9IGAke01hdGguZmxvb3IodmlkZW8uY3VycmVudFRpbWUgLyAzNjAwKSA+IDBcclxuICAgICAgICAgICAgPyBNYXRoLmZsb29yKHZpZGVvLmN1cnJlbnRUaW1lIC8gMzYwMCkgKyBcIiZuYnNwO+aZgumWkyZuYnNwO1wiXHJcbiAgICAgICAgICAgIDogXCJcIn1gO1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBgJHtNYXRoLmZsb29yKHZpZGVvLmN1cnJlbnRUaW1lIC8gNjApICUgNjAgPiAwXHJcbiAgICAgICAgICAgID8gKE1hdGguZmxvb3IodmlkZW8uY3VycmVudFRpbWUgLyA2MCkgJSA2MCkgKyBcIiZuYnNwO+WIhiZuYnNwO1wiXHJcbiAgICAgICAgICAgIDogXCJcIn1gO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBgJHtNYXRoLmZsb29yKHZpZGVvLmN1cnJlbnRUaW1lICUgNjApfSZuYnNwO+enkmA7XHJcbiAgICAgICAgaWYgKHRpbWUgIT09IGAke2hvdXJzfSR7bWludXRlc30ke3NlY29uZHN9YCkge1xyXG4gICAgICAgICAgICB0aW1lID0gYCR7aG91cnN9JHttaW51dGVzfSR7c2Vjb25kc31gO1xyXG4gICAgICAgICAgICB3YXRjaC5pbm5lckhUTUwgPSBgJHtob3Vyc30ke21pbnV0ZXN9JHtzZWNvbmRzfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFRpbWVvdXQobWFpbiwgMTAwKTtcclxuICAgIH0sIDEwMCk7XHJcbiAgICAvKipcclxuICAgICAqIOOCqOODqeODvOODoeODg+OCu+ODvOOCuOihqOekuueUqCBwYXJhZ3JhcGhcclxuICAgICAqL1xyXG4gICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg6Hjg7Pjg4jjgrPjg7Pjg4bjg4rjgpLplonjgZjjgovjg5zjgr/jg7NcclxuICAgICAqL1xyXG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBiLmlkID0gXCJkLWNvbW1lbnRzLWNsb3NlXCI7XHJcbiAgICBiLnRleHRDb250ZW50ID0gXCLjgrXjgqTjg4njg5Djg7zjgpLplonjgZjjgotcIjtcclxuICAgIGIuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcclxuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBiLnBhcmVudEVsZW1lbnQ/LnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgdHlwZTogXCJtb3ZpZURhdGFcIixcclxuICAgICAgICBtb3ZpZUlkOiBtb3ZpZUlkLFxyXG4gICAgfSwgKHdhdGNoRGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwid2F0Y2hEYXRhXCIsIHdhdGNoRGF0YSk7XHJcbiAgICAgICAgaWYgKCF3YXRjaERhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2F0Y2hEYXRhW1wibWV0YVwiXVtcInN0YXR1c1wiXSAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIiwgd2F0Y2hEYXRhID8gd2F0Y2hEYXRhW1wibWV0YVwiXVtcInN0YXR1c1wiXSA6IFwiRXJyb3JcIik7XHJcbiAgICAgICAgICAgIGlmICh3YXRjaERhdGFbXCJkYXRhXCJdW1wicmVhc29uQ29kZVwiXSA9PT0gXCJQUFZfVklERU9cIikge1xyXG4gICAgICAgICAgICAgICAgcC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IFwi5pyJ5paZ5YuV55S744Gu44Gf44KB44Kz44Oh44Oz44OI44KS5Y+W5b6X44Gn44GN44G+44Gb44KT44Gn44GX44Gf44CCXCI7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgICAgICBwLmlubmVySFRNTCA9IGA8cD7jgrPjg6Hjg7Pjg4jjga7lj5blvpfjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgII8L3A+PHA+44Ko44Op44O844Kz44O844OJOiAke3dhdGNoRGF0YVtcImRhdGFcIl1bXCJyZWFzb25Db2RlXCJdfTwvcD5gO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInRocmVhZERhdGFcIixcclxuICAgICAgICAgICAgICAgIHdhdGNoRGF0YTogd2F0Y2hEYXRhLFxyXG4gICAgICAgICAgICB9LCBhc3luYyAodGhyZWFkRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aHJlYWRzXCIsIHRocmVhZERhdGFbXCJ0aHJlYWRzXCJdKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRocmVhZHMgPSB0aHJlYWREYXRhW1widGhyZWFkc1wiXTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog5Lu75oSP44Gu44K544Os44OD44OJ44Gu44Kz44Oh44Oz44OI44KS6KGo56S644GZ44KLXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gZm9yayDjgrPjg6Hjg7Pjg4jjga4gZm9ya1xyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMg44Kz44Oh44Oz44OIXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNvbnN0IGdldFRocmVhZENvbW1lbnRzID0gKGZvcmspID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aHJlYWQgPSB0aHJlYWRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHRocmVhZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyZWFkW1wiZm9ya1wiXSA9PT0gZm9yaztcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCh0aHJlYWQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocmVhZDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhyZWFkLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocmVhZFsxXVtcImNvbW1lbnRzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyZWFkWzBdW1wiY29tbWVudHNcIl07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLy9jb25zdCBvd25lclRocmVhZCA9IGdldFRocmVhZENvbW1lbnRzKFwib3duZXJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYWluVGhyZWFkID0gZ2V0VGhyZWFkQ29tbWVudHMoXCJtYWluXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zdCBlYXN5VGhyZWFkID0gZ2V0VGhyZWFkQ29tbWVudHMoXCJlYXN5XCIpO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDjgrPjg6Hjg7Pjg4jjgpLlho3nlJ/mmYLliLvjgafjgr3jg7zjg4jjgZnjgotcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIOOCs+ODoeODs+ODiFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnZXRDb21tZW50cyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50cyA9IG1haW5UaHJlYWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHMuZmlsdGVyKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21tZW50W1wic2NvcmVcIl0gPiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFbXCJ2cG9zTXNcIl0gLSBiW1widnBvc01zXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21tZW50cztcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOOCs+ODoeODs+ODiOODquOCueODiOOBrlVsXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IGdldENvbW1lbnRzKCkudGhlbigoY29tbWVudHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBhc3luYyAoY29tbWVudHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHMubWFwKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpLmlubmVyVGV4dCA9IGNvbW1lbnQuYm9keTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpLnNldEF0dHJpYnV0ZShcImRhdGEtdGltZVwiLCBjb21tZW50W1widnBvc01zXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RzLnB1c2gobGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RzO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMoY29tbWVudHMpLnRoZW4oKGxpc3RzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRmID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0cy5tYXAoKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLmFwcGVuZENoaWxkKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdWwuYXBwZW5kQ2hpbGQoZGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgIFVSTOOBruWkieabtOOCkuebo+imluOBmeOCi1xyXG4gICAgICAgICAgICAgICAgICAgICBVUkzjgYzlpInmm7TjgZXjgozjgZ/jgonkvZzlk4Hjg5Hjg7zjg4jjgYzlpInmm7TjgZXjgozjgZ/jgajliKTmlq3jgZfjgIHjgrPjg6Hjg7Pjg4jjga7lho3oqq3jgb/ovrzjgb/jgpLkv4PjgZlcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaHJlZiA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZiAhPT0gbG9jYXRpb24uaHJlZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWwucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIuS9nOWTgeODkeODvOODiOOBjOWkieabtOOBleOCjOOBvuOBl+OBn+OAglwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCLjgrPjg6Hjg7Pjg4jjgpLlho3lj5blvpfjgZfjgabjgY/jgaDjgZXjgYTjgIJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWYgPSBsb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g44Kz44Oh44Oz44OI44KS5YaN55Sf5pmC5Yi744Gr5ZCI44KP44Gb44Gm44K544Kv44Ot44O844Or44GZ44KLXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiBtYWluKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IE1hdGgucm91bmQodmlkZW8uY3VycmVudFRpbWUgKiAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGkgPSB1bC5xdWVyeVNlbGVjdG9yQWxsKFwibGlbZGF0YS10aW1lXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gTnVtYmVyKGxpW2ldLmdldEF0dHJpYnV0ZShcImRhdGEtdGltZVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgPiB0aW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGxpW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QudW5zaGlmdChsaVtpXSkgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBsaXN0W2xpLmxlbmd0aCAtIDFdID8/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGwgPSB0YXJnZXQub2Zmc2V0VG9wIC0gdWwub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWwuc2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHNjcm9sbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogXCJzbW9vdGhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobWFpbiwgMTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSBzaG93Q29tbWVudHM7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb250ZW50X3NjcmlwdC9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==