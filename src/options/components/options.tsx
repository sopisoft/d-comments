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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditorCheckbox from "./editor_checkbox";
import EditorColor from "./editor_color";
import EditorNumber from "./editor_number";
import EditorSlider from "./editor_slider";
import EditorSwitch from "./editor_switch";
import EditorTextList from "./editor_text_list";

const CardWrapper = ({
  title,
  description,
  children,
}: { title: string; description: string; children: React.ReactNode }) => {
  return (
    <Card className="m-4 w-[32rem] border-2 border-gray-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 m-auto">{children}</CardContent>
    </Card>
  );
};

function Options() {
  return (
    <div className="flex flex-wrap justify-center after:content-[''] after:block after:w-[32rem] after:m-4">
      <CardWrapper title="基本設定" description="">
        <EditorSwitch
          _key="enable_auto_play"
          text="自動で動画検索/再生を開始する"
        />
        <EditorCheckbox
          _key="channels_only"
          text="コメントをチャンネルからのみ取得"
        />
      </CardWrapper>

      <CardWrapper
        title="ポップアップ"
        description="拡張機能のアイコンをクリックすると表示される、ポップアップページの設定です。"
      >
        <EditorSwitch
          _key="auto_search"
          text="ポップアップを開いたとき自動で動画検索を開始する"
        />
      </CardWrapper>

      <CardWrapper title="作品ページ" description="作品ページの設定です。">
        <EditorSwitch
          _key="add_button_to_show_comments_while_playing"
          text="作品ページに「コメントを表示しながら再生」ボタンを追加する"
        />
        <EditorSwitch
          _key="make_play_button_open_new_tab"
          text="「コメントを表示しながら再生」ボタンでは新しいタブで開く"
        />
      </CardWrapper>

      <CardWrapper
        title="コメントの種類"
        description="表示するコメントの種類を選択します。"
      >
        <EditorCheckbox _key="show_owner_comments" text="投稿者コメント" />
        <EditorCheckbox _key="show_main_comments" text="通常コメント" />
        <EditorCheckbox _key="show_easy_comments" text="かんたんコメント" />
      </CardWrapper>

      <CardWrapper
        title="ニコニコ動画へのログイン"
        description="詳細は「つかいかた」をご覧ください。"
      >
        <EditorSwitch
          _key="allow_login_to_nicovideo"
          text="ニコニコ動画へのログインを許可する"
        />
      </CardWrapper>

      <CardWrapper title="視聴ページ" description="作品視聴ページの設定です。">
        <EditorSwitch
          _key="enable_auto_scroll"
          text="コメント欄を自動スクロールする"
        />
        <EditorNumber _key="comment_area_width_px" text="コメント欄の幅 (px)" />
        <EditorNumber
          _key="comment_area_font_size_px"
          text="コメント欄の文字サイズ (px)"
        />
        <EditorSlider
          _key="nicoarea_scale"
          text="ニコニコ動画風コメントの拡大率"
        />
        <EditorSwitch
          _key="load_comments_on_next_video"
          text="連続再生時に自動で次の動画のコメントを読み込む"
        />
      </CardWrapper>

      <CardWrapper
        title="コメント欄の色"
        description="コメント欄の色を設定します。"
      >
        <EditorColor
          _key="comment_area_background_color"
          text="コメント欄の背景色"
        />
        <EditorSlider
          _key="comment_area_opacity_percentage"
          text="コメント欄の不透明度 (%)"
        />
        <EditorColor _key="comment_text_color" text="コメントの文字色" />
      </CardWrapper>

      <CardWrapper
        title="コメントの表示方法"
        description="コメントの表示方法を設定します。"
      >
        <EditorCheckbox
          _key="show_comments_in_list"
          text="コメントをリスト形式で表示"
        />
        <EditorCheckbox
          _key="show_comments_in_niconico_style"
          text="コメントをニコニコ動画風に表示"
        />
      </CardWrapper>

      <CardWrapper
        title="コメントのNGユーザー/NGワード"
        description="コメント欄に表示されないユーザー名やワードを設定します。正規表現も使用できます。"
      >
        <EditorTextList _key="comment_ng_words" text="NGワード" />
        <EditorTextList _key="comment_ng_users" text="NGユーザー" />
      </CardWrapper>
    </div>
  );
}

export default Options;
