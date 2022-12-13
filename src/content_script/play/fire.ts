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

import init from "./init";
import play from "./play";

/**
 * 発火用関数
 * @param movieId
 * @param data ファイルからコメントを読み込むときコメントデータ。ファイルからの読み込みでない場合は、undefined。
 */
const fire = async (movieId: string, data: string) => {
  const { b, s, container, d, video } = init();
  if (data) {
    const e = JSON.parse(data);
    if (e["threadData"]) {
      play(e["threadData"], b, s, container, d, video);
    } else {
      d.style.display = "block";
      d.innerHTML = "<p>コメントの取得に失敗しました。</p>";
      container.appendChild(b);
      return;
    }
  } else {
    chrome.runtime.sendMessage(
      {
        type: "movieData",
        movieId: movieId,
      },
      (movieData) => {
        console.log("movieData", movieData);
        if (!movieData) {
          d.style.display = "block";
          d.innerHTML = "<p>動画情報の取得に失敗しました。</p>";
          container.appendChild(b);
          return;
        }
        if (movieData["meta"]["status"] !== 200) {
          console.log(
            "error",
            movieData ? movieData["meta"]["status"] : "Error"
          );
          if (movieData["data"]) {
            if (movieData["data"]["reasonCode"] === "PPV_VIDEO") {
              d.style.display = "block";
              d.innerHTML =
                "<p>有料動画のためコメントを取得できませんでした。</p>";
              container.appendChild(b);
              return;
            } else {
              d.style.display = "block";
              d.innerHTML = `<p>コメントの取得に失敗しました。</p><p><span>コード</span><span>${movieData["data"]["reasonCode"]}</span></p>`;
              container.appendChild(b);
              return;
            }
          } else {
            d.style.display = "block";
            d.innerHTML = `<p>動画情報の取得に失敗しました。</p><p><span>エラーコード</span><span>${movieData["meta"]["status"]}</span></p>`;
            container.appendChild(b);
            return;
          }
        } else {
          chrome.runtime.sendMessage(
            {
              type: "threadData",
              movieData: movieData,
            },
            (threadData) => {
              play(threadData, b, s, container, d, video);
            }
          );
        }
      }
    );
  }
};

export default fire;
