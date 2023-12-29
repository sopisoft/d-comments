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
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import browser from "webextension-polyfill";
import "../global.css";
import Editor from "./editor";
import "./options.scss";

const Options = () => {
  return (
    <>
      <header>
        <span className="inner">
          <i className="codicon codicon-settings-gear" />
        </span>
        <h1>設定</h1>
      </header>
      <div className="wrapper">
        <div id="left-side">
          <div>
            <h2>ポップアップ</h2>
            <Editor _key="show_last_searched_video_id" />
            <Editor _key="auto_search" />
          </div>
          <div>
            <h2>作品ページ</h2>
            <Editor _key="add_button_to_show_comments_while_playing" />
            <Editor _key="open_in_new_tab_when_clicking_show_comments_while_playing_button" />
          </div>
          <div>
            <h2>コメントの種類</h2>
            <Editor _key="show_owner_comments" />
            <Editor _key="show_main_comments" />
            <Editor _key="show_easy_comments" />
          </div>
          <div>
            <h2>ニコニコ動画へのログイン</h2>
            <Editor _key="allow_login_to_nicovideo" />
          </div>
        </div>
        <div id="right-side">
          <div>
            <h2>視聴ページ</h2>
            <Editor _key="enable_scroll_mode" />
            <Editor _key="scroll_interval_ms" />
            <Editor _key="comment_area_width_px" />
            <Editor _key="show_comment_scrollbar" />
          </div>
          <div>
            <h2>コメント欄の色</h2>
            <Editor _key="comment_area_background_color" />
            <Editor _key="comment_area_opacity_percent" />
            <Editor _key="comment_text_color" />
          </div>
          <div>
            <h2>コメントの表示方法</h2>
            <Editor _key="comment_rendering_method" />
          </div>
          <h2>コメントリストのオーバーレイ</h2>
          <Editor _key="distance_from_top_percent" />
          <Editor _key="distance_from_left_percent" />
          <Editor _key="comment_area_height_percent" />
        </div>
      </div>
      <footer>
        <span className="info">
          {browser.runtime.getManifest().name}
          &nbsp;-&nbsp;Version&nbsp;{browser.runtime.getManifest().version}
        </span>
        <span className="info">
          &copy;&nbsp;{new Date().getFullYear()}&nbsp;
          {browser.runtime.getManifest().author}
        </span>
        <div className="links">
          <span className="link">
            <a
              href="https://forms.office.com/r/JR9KksWHJD"
              target="_blank"
              rel="noreferrer"
            >
              <i className="codicon codicon-feedback" />
              &nbsp;
              <span>FeedBack</span>
            </a>
          </span>
          <span className="link">
            <a
              href="https://github.com/gobosan/d-comments"
              target="_blank"
              rel="noreferrer"
            >
              <i className="codicon codicon-mark-github" />
              &nbsp;
              <span>GitHub</span>
            </a>
          </span>
        </div>
      </footer>
    </>
  );
};

const root = document.createElement("div");
root.id = "options";
document.body.appendChild(root);

createRoot(root).render(
  <RecoilRoot>
    <Options />
  </RecoilRoot>
);
