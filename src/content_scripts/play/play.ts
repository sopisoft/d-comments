// /*
//     This file is part of d-comments.

//     d-comments is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     d-comments is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
// */

// import * as Config from "@/config";
// import { type config, getConfig } from "@/config";
// import { setWorkInfo } from "../danime_dom/watch";

// import NiconiComments, { type InputFormat } from "@xpadev-net/niconicomments";
// import browser from "webextension-polyfill";

// /**
//  * スレッドデータからコメントを設置する
//  * @param threadData
//  * @param button_closes_comment_container コメントコンテナを閉じるボタン
//  * @param status_bar ステータス表示バー
//  * @param container コメントコンテナ
//  * @param error_messages_bar エラーメッセージ表示バー
//  * @param video
//  */
// const play = (
//   threadData: Threads,
//   button_closes_comment_container: HTMLButtonElement,
//   status_bar: HTMLDivElement,
//   container: HTMLDivElement,
//   error_messages_bar: HTMLDivElement,
//   video: HTMLVideoElement
// ) => {

//   /**
//    * コメントリストを設置する
//    */

//   const setComments = (comments: nv_comment[]) => {
//     const contents = async (comments: nv_comment[]) => {
//       const lists: HTMLElement[] = [];
//       comments.map((comment) => {
//         const li = document.createElement("li");
//         li.innerText = comment.body;
//         Object.assign(li.style, {
//           fontSize: "16px",
//           lineHeight: 1.4,
//           padding: "5px",
//           borderBottom: "1px solid #484848d1",
//         });
//         li.setAttribute("data-time", comment.vposMs.toString());
//         lists.push(li);
//       });
//       return lists;
//     };

//     const appendList = (lists: HTMLElement[]) => {
//       const df = document.createDocumentFragment();
//       lists.map((list) => {
//         df.appendChild(list);
//       });
//       while (ul.firstChild) {
//         ul.removeChild(ul.firstChild);
//       }
//       ul.appendChild(df);
//     };
//     contents(comments).then((lists) => {
//       appendList(lists);
//     });
//     window.requestAnimationFrame(scroll);
//   };

//   /**
//    * コメントリストを表示する
//    */
//   const renderComments = () => {
//     container.style.display = "flex";
//     document.getElementById("d-comments-canvas")?.remove();
//     getComments((comments) => {
//       if (comments.length > 0) {
//         Config.getConfig("comment_rendering_method", (value) => {
//           if (value === "right_to_left") {
//             container.style.display = "none";
//             setFlowComments();
//           } /*else if (value === "right_to_left_and_list") {
// 						setFlowComments();
// 						sortComments(comments).then((comments) => {
// 							setComments(comments);
// 							ul.style.display = "block";
// 						});
// 					} */ else {
//             sortComments(comments).then((comments) => {
//               setComments(comments);
//               ul.style.display = "block";
//             });
//           }
//         });
//         error_messages_bar.innerText = "";
//         error_messages_bar.style.display = "none";
//         button_closes_comment_container.remove();
//         window.requestAnimationFrame(setCurrentTime);
//       } else {
//         error_messages_bar.style.display = "block";
//         error_messages_bar.innerText = "表示できるコメントはありません。";
//         while (ul.firstChild) {
//           ul.removeChild(ul.firstChild);
//         }
//         ul.style.display = "none";
//       }
//     });
//   };
// };

// export default play;
