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
import { Separator } from "@/components/ui/separator";
import Editor from "./editor";

function Options() {
  const CardWrapper = (props: {
    title: string;
    description: string;
    content: React.ReactNode;
  }) => {
    return (
      <Card className="m-4 w-[32rem] border-2 border-gray-200">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 m-auto">{props.content}</CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-wrap justify-center after:content-[''] after:block after:w-[32rem] after:m-4">
      <CardWrapper
        title="ポップアップ"
        description="拡張機能のアイコンをクリックすると表示される、ポップアップページの設定です。"
        content={
          <>
            <Editor _key="show_last_searched_video_id" />
            <Separator />
            <Editor _key="auto_search" />
          </>
        }
      />

      <CardWrapper
        title="作品ページ"
        description="作品ページの設定です。"
        content={
          <>
            <Editor _key="add_button_to_show_comments_while_playing" />
            <Separator />
            <Editor _key="make_play_button_open_new_tab" />
          </>
        }
      />

      <CardWrapper
        title="コメントの種類"
        description="表示するコメントの種類を選択します。"
        content={
          <>
            <Editor _key="show_owner_comments" />
            <Separator />
            <Editor _key="show_main_comments" />
            <Separator />
            <Editor _key="show_easy_comments" />
          </>
        }
      />

      <CardWrapper
        title="ニコニコ動画へのログイン"
        description="詳細は「つかいかた」をご覧ください。"
        content={<Editor _key="allow_login_to_nicovideo" />}
      />

      <CardWrapper
        title="視聴ページ"
        description="作品視聴ページの設定です。"
        content={
          <>
            <Editor _key="enable_scroll_mode" />
            <Separator />
            <Editor _key="scroll_interval_ms" />
            <Separator />
            <Editor _key="comment_area_width_px" />
            <Separator />
            <Editor _key="show_comment_scrollbar" />
          </>
        }
      />

      <CardWrapper
        title="コメント欄の色"
        description="コメント欄の色を設定します。"
        content={
          <>
            <Editor _key="comment_area_background_color" />
            <Separator />
            <Editor _key="comment_area_opacity_percentage" />
            <Separator />
            <Editor _key="comment_text_color" />
          </>
        }
      />

      <CardWrapper
        title="コメントの表示方法"
        description="コメントの表示方法を設定します。"
        content={<Editor _key="comment_rendering_method" />}
      />

      <CardWrapper
        title="コメントリストのオーバーレイ"
        description="コメントリストのオーバーレイの設定です。"
        content={
          <>
            <Editor _key="distance_from_top_percent" />
            <Separator />
            <Editor _key="distance_from_left_percent" />
            <Separator />
            <Editor _key="comment_area_height_percent" />
          </>
        }
      />
    </div>
  );
}

export default Options;
