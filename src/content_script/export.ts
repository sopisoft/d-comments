/*
    This file is part of d-comments_For_DMM-TV.

    d-comments_For_DMM-TV is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments_For_DMM-TV is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments_For_DMM-TV.  If not, see <https://www.gnu.org/licenses/>.
*/

const exportJson = (movieId: string) => {
  chrome.runtime.sendMessage(
    {
      type: "movieData",
      movieId: movieId,
    },
    (movieData) => {
      if (!movieData || movieData["meta"]["status"] !== 200) {
        window.alert("動画情報の取得に失敗しました");
      } else {
        chrome.runtime.sendMessage(
          {
            type: "threadData",
            movieData: movieData,
          },
          (threadData) => {
            const fileName = movieData["data"]["video"]["title"];
            const jsonBody = {
              version: 1,
              movieId: movieId,
              movieData: movieData,
              threadData: threadData,
            };
            const data = JSON.stringify(jsonBody);
            saveFile(fileName, data);
          }
        );
      }
    }
  );
};

/**
 * ファイルを保存する
 * @param fileName ファイル名
 * @param data 内容
 */
const saveFile = async (fileName: string, data: string) => {
  /*File System Access API が不安定なので現状では採用しない
  const handle = await window.showSaveFilePicker({
    suggestedName: fileName,
    types: [
      {
        description: "JSON File",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  });
  const writable = await handle.createWritable();
  await writable.write(data);
  await writable.close();
  */
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  document.body.removeChild(link);
};

export default exportJson;
