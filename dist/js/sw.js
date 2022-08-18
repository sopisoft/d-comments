/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

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
 * 任意の範囲のランダムな整数を返す
 * @param min 最小値
 * @param max 最大値
 * @returns min 以上 max 以下のランダムな整数
 */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "movieData": {
            // 動画情報を取得
            const actionTrackId = Math.random().toString(36).slice(-10) +
                "_" +
                getRandomInt(10 ** 12, 10 ** 13);
            const url = `https://www.nicovideo.jp/api/watch/v3_guest/${message.movieId}`;
            const params = {
                _frontendId: "6",
                _frontendVersion: "0",
                actionTrackId: actionTrackId,
            };
            fetch(url + "?" + new URLSearchParams(params), {
                credentials: "omit",
                headers: {
                    "x-frontend-id": "6",
                    "x-frontend-version": "0",
                },
            })
                .then((res) => {
                return res.json();
            })
                .then((json) => {
                sendResponse(json);
            })
                .catch((err) => {
                sendResponse(err);
            });
            return true;
        }
        case "threadData": {
            // コメントスレッドの情報とコメントを取得
            const nvComment = message.watchData["data"]["comment"]["nvComment"];
            const serverUrl = nvComment["server"] + "/v1/threads";
            const jsonBody = {
                threadKey: nvComment["threadKey"],
                params: nvComment["params"],
                additionals: {},
            };
            fetch(serverUrl + "?_frontendId=6", {
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-id": "6",
                    "x-frontend-version": "0",
                },
                method: "POST",
                body: JSON.stringify(jsonBody),
            })
                .then((res) => {
                return res.json();
            })
                .then((json) => {
                sendResponse(json["data"]);
            })
                .catch((err) => {
                sendResponse(err);
            });
            return true;
        }
        case "search": {
            const endpoint = "https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search";
            const params = {
                q: message.word,
                targets: "title,description,tags",
                _sort: "-commentCounter",
                fields: "contentId,title,thumbnailUrl,commentCounter,viewCounter,lengthSeconds,userId,channelId",
                _limit: "40",
                _context: "d-comments",
            };
            /**
             * スナップショットAPIを使って動画を検索する
             * @see https://site.nicovideo.jp/search-api-docs/snapshot
             */
            fetch(endpoint + "?" + new URLSearchParams(params), {
                headers: {
                    "User-Agent": message.UserAgent,
                },
            })
                .then((res) => {
                return res.json();
            })
                .then((json) => {
                sendResponse(json);
            })
                .catch((err) => {
                sendResponse(err);
            });
            return true;
        }
        case "user": {
            const url = "https://nvapi.nicovideo.jp/v1/users/" + message.id;
            fetch(url, {
                headers: {
                    "User-Agent": message.UserAgent,
                    "x-frontend-id": "6",
                    "x-frontend-version": "0",
                },
            })
                .then((res) => {
                return res.json();
            })
                .then((json) => {
                sendResponse(json);
            })
                .catch((err) => {
                sendResponse(err);
            });
            return true;
        }
        case "channel": {
            const url = "https://public.api.nicovideo.jp/v1/channel/channelapp/channels/" +
                message.id +
                ".json";
            fetch(url)
                .then((res) => {
                return res.json();
            })
                .then((json) => {
                sendResponse(json);
            })
                .catch((err) => {
                sendResponse(err);
            });
            return true;
        }
        default:
            return false;
    }
});
exports["default"] = {};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3cuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVFQUF1RSxnQkFBZ0I7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Qsa0JBQWUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kLWNvbW1lbnRzLy4vc3JjL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qXHJcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBkLWNvbW1lbnRzLlxyXG5cclxuICAgIGQtY29tbWVudHMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxyXG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcclxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXHJcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxyXG5cclxuICAgIGQtY29tbWVudHMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcclxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXHJcbiAgICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxyXG5cclxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXHJcbiAgICBhbG9uZyB3aXRoIGQtY29tbWVudHMuICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxyXG4qL1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiDku7vmhI/jga7nr4Tlm7Ljga7jg6njg7Pjg4Djg6DjgarmlbTmlbDjgpLov5TjgZlcclxuICogQHBhcmFtIG1pbiDmnIDlsI/lgKRcclxuICogQHBhcmFtIG1heCDmnIDlpKflgKRcclxuICogQHJldHVybnMgbWluIOS7peS4iiBtYXgg5Lul5LiL44Gu44Op44Oz44OA44Og44Gq5pW05pWwXHJcbiAqL1xyXG5jb25zdCBnZXRSYW5kb21JbnQgPSAobWluLCBtYXgpID0+IHtcclxuICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcclxufTtcclxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFwibW92aWVEYXRhXCI6IHtcclxuICAgICAgICAgICAgLy8g5YuV55S75oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvblRyYWNrSWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgtMTApICtcclxuICAgICAgICAgICAgICAgIFwiX1wiICtcclxuICAgICAgICAgICAgICAgIGdldFJhbmRvbUludCgxMCAqKiAxMiwgMTAgKiogMTMpO1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly93d3cubmljb3ZpZGVvLmpwL2FwaS93YXRjaC92M19ndWVzdC8ke21lc3NhZ2UubW92aWVJZH1gO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgICAgICBfZnJvbnRlbmRJZDogXCI2XCIsXHJcbiAgICAgICAgICAgICAgICBfZnJvbnRlbmRWZXJzaW9uOiBcIjBcIixcclxuICAgICAgICAgICAgICAgIGFjdGlvblRyYWNrSWQ6IGFjdGlvblRyYWNrSWQsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZldGNoKHVybCArIFwiP1wiICsgbmV3IFVSTFNlYXJjaFBhcmFtcyhwYXJhbXMpLCB7XHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJvbWl0XCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ4LWZyb250ZW5kLWlkXCI6IFwiNlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwieC1mcm9udGVuZC12ZXJzaW9uXCI6IFwiMFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGpzb24pID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZShqc29uKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIFwidGhyZWFkRGF0YVwiOiB7XHJcbiAgICAgICAgICAgIC8vIOOCs+ODoeODs+ODiOOCueODrOODg+ODieOBruaDheWgseOBqOOCs+ODoeODs+ODiOOCkuWPluW+l1xyXG4gICAgICAgICAgICBjb25zdCBudkNvbW1lbnQgPSBtZXNzYWdlLndhdGNoRGF0YVtcImRhdGFcIl1bXCJjb21tZW50XCJdW1wibnZDb21tZW50XCJdO1xyXG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXJVcmwgPSBudkNvbW1lbnRbXCJzZXJ2ZXJcIl0gKyBcIi92MS90aHJlYWRzXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IGpzb25Cb2R5ID0ge1xyXG4gICAgICAgICAgICAgICAgdGhyZWFkS2V5OiBudkNvbW1lbnRbXCJ0aHJlYWRLZXlcIl0sXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IG52Q29tbWVudFtcInBhcmFtc1wiXSxcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxzOiB7fSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZmV0Y2goc2VydmVyVXJsICsgXCI/X2Zyb250ZW5kSWQ9NlwiLCB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ4LWZyb250ZW5kLWlkXCI6IFwiNlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwieC1mcm9udGVuZC12ZXJzaW9uXCI6IFwiMFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShqc29uQm9keSksXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChqc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoanNvbltcImRhdGFcIl0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZShlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgXCJzZWFyY2hcIjoge1xyXG4gICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IFwiaHR0cHM6Ly9hcGkuc2VhcmNoLm5pY292aWRlby5qcC9hcGkvdjIvc25hcHNob3QvdmlkZW8vY29udGVudHMvc2VhcmNoXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgICAgICAgICAgIHE6IG1lc3NhZ2Uud29yZCxcclxuICAgICAgICAgICAgICAgIHRhcmdldHM6IFwidGl0bGUsZGVzY3JpcHRpb24sdGFnc1wiLFxyXG4gICAgICAgICAgICAgICAgX3NvcnQ6IFwiLWNvbW1lbnRDb3VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICBmaWVsZHM6IFwiY29udGVudElkLHRpdGxlLHRodW1ibmFpbFVybCxjb21tZW50Q291bnRlcix2aWV3Q291bnRlcixsZW5ndGhTZWNvbmRzLHVzZXJJZCxjaGFubmVsSWRcIixcclxuICAgICAgICAgICAgICAgIF9saW1pdDogXCI0MFwiLFxyXG4gICAgICAgICAgICAgICAgX2NvbnRleHQ6IFwiZC1jb21tZW50c1wiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog44K544OK44OD44OX44K344On44OD44OIQVBJ44KS5L2/44Gj44Gm5YuV55S744KS5qSc57Si44GZ44KLXHJcbiAgICAgICAgICAgICAqIEBzZWUgaHR0cHM6Ly9zaXRlLm5pY292aWRlby5qcC9zZWFyY2gtYXBpLWRvY3Mvc25hcHNob3RcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZldGNoKGVuZHBvaW50ICsgXCI/XCIgKyBuZXcgVVJMU2VhcmNoUGFyYW1zKHBhcmFtcyksIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIlVzZXItQWdlbnRcIjogbWVzc2FnZS5Vc2VyQWdlbnQsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoanNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKGpzb24pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZShlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgXCJ1c2VyXCI6IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gXCJodHRwczovL252YXBpLm5pY292aWRlby5qcC92MS91c2Vycy9cIiArIG1lc3NhZ2UuaWQ7XHJcbiAgICAgICAgICAgIGZldGNoKHVybCwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlci1BZ2VudFwiOiBtZXNzYWdlLlVzZXJBZ2VudCxcclxuICAgICAgICAgICAgICAgICAgICBcIngtZnJvbnRlbmQtaWRcIjogXCI2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ4LWZyb250ZW5kLXZlcnNpb25cIjogXCIwXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoanNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKGpzb24pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZShlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgXCJjaGFubmVsXCI6IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gXCJodHRwczovL3B1YmxpYy5hcGkubmljb3ZpZGVvLmpwL3YxL2NoYW5uZWwvY2hhbm5lbGFwcC9jaGFubmVscy9cIiArXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlLmlkICtcclxuICAgICAgICAgICAgICAgIFwiLmpzb25cIjtcclxuICAgICAgICAgICAgZmV0Y2godXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoanNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKGpzb24pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZShlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHt9O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=