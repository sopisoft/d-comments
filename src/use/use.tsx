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

import React from "react";
import * as ReactDOM from "react-dom/client";
import ReactModal from "react-modal";
import "./use.scss";

const steps = [
  {
    step: 1,
    text: "準備",
    children: [
      {
        text: "ドコモアニメストアの任意のアニメ作品ページにアクセスします。",
        img: "img/menu.png",
        imgAlt: "再生ボタンが追加された作品ページ",
      },
      {
        text: "各パートに表示された「コメントを表示しながら再生」ボタンをクリックします。",
        img: null,
        imgAlt: null,
      },
    ],
  },
  {
    step: 2,
    text: "ポップアップの操作",
    children: [
      {
        text: "前項で選択したパートの再生ページが新しいタブで開かます",
        img: null,
        imgAlt: null,
      },
      {
        text: "再生ページで再生が開始されたら、拡張機能のポップアップを開きます。",
        img: "img/popup.png",
        imgAlt: "拡張機能のポップアップページ",
      },
      {
        text: "ポップアップでニコニコ動画の動画検索が始まります。",
        img: null,
        imgAlt: null,
      },
      {
        text: "動画リストからコメントを表示したい動画選択します。",
        img: null,
        imgAlt: null,
      },
      {
        text: "動画ID欄に前項で選択した動画のIDが入力されます。",
        img: null,
        imgAlt: null,
      },
    ],
  },
  {
    step: 3,
    text: "コメントの表示",
    children: [
      {
        text: "動画ID欄に指定の動画IDが入力されていることを確認します。",
        img: null,
        imgAlt: null,
      },
      {
        text: "「表示」ボタンをクリックするとコメントが表示されます。",
        img: "img/comments.png",
        imgAlt: "コメントが表示された様子",
      },
    ],
  },
];

type modal = {
  isOpen: boolean;
  img: string;
  imgAlt: string;
};

const Use = () => {
  const [modalState, setModal] = React.useState<modal>({
    isOpen: false,
    img: "",
    imgAlt: "",
  });
  const openModal = (img: string, imgAlt: string) => {
    setModal({
      isOpen: true,
      img: img,
      imgAlt: imgAlt,
    });
  };

  ReactModal.setAppElement(document.getElementById("root"));

  return (
    <>
      <h1>つかいかた</h1>
      {steps.map((step, i) => (
        <section key={i}>
          <h2>
            <span className="number">{i + 1}.&nbsp;</span>
            <span className="text">{step.text}</span>
          </h2>
          {step.children.map((child, j) => (
            <div key={j} className="step">
              <p>
                <span className="number">
                  {i + 1}-{j + 1}.&nbsp;
                </span>
                <span className="text">{child.text}</span>
              </p>
              {child.img && (
                <img
                  src={child.img}
                  alt={child.imgAlt}
                  onClick={() => openModal(child.img, child.imgAlt)}
                />
              )}
            </div>
          ))}
        </section>
      ))}

      <ReactModal
        isOpen={modalState.isOpen}
        onRequestClose={() => setModal({ isOpen: false, img: "", imgAlt: "" })}
      >
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setModal({ isOpen: false, img: "", imgAlt: "" })}
            >
              &times;
            </span>
            <img src={modalState.img} alt={modalState.imgAlt} />
          </div>
        </div>
      </ReactModal>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Use />);
