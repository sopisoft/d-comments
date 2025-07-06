import { Fieldset, Grid, Stack, Title } from "@mantine/core";
import {
  CheckboxField,
  CheckboxGroupField,
  ColorField,
  NumberField,
  SliderField,
  SwitchField,
} from "./fields";

function ConfigrationsPanel() {
  return (
    <Grid>
      <Grid.Col span={{ base: 6, md: 3 }}>
        <Fieldset legend={<Title order={2}>一般の設定</Title>}>
          <SwitchField
            configKey="login"
            label="ニコニコにログイン"
            description="ニコニコ動画にログインすると、ニコニコ動画とNGユーザー・NGワードの同期ができます。"
          />
        </Fieldset>

        <Fieldset legend={<Title order={2}>自動化設定</Title>} mt="lg">
          <Stack align="stretch" justify="center" gap="lg">
            <SwitchField
              configKey="auto_search"
              label="自動検索"
              description="ポップアップを開いたときに、自動的に検索を行います。"
            />
            <SwitchField
              configKey="enable_auto_play"
              label="自動再生"
              description="作品の視聴開始と同時に、コメントを取得して再生します。"
            />
          </Stack>
        </Fieldset>

        <Fieldset legend={<Title order={2}>サイドバーの設定</Title>} mt="lg">
          <Stack align="stretch" justify="center" gap="lg">
            <SwitchField
              configKey="enable_auto_scroll"
              label="自動スクロール"
              description="コメントの自動スクロールを有効にします。"
            />
            <NumberField
              configKey="comment_area_width_px"
              label="サイドバーの幅（px）"
              description="サイドバーの幅をピクセル単位で設定します。"
            />
            <ColorField
              configKey="comment_area_background_color"
              label="サイドバーの背景色"
              description="サイドバーの背景色を設定します。"
            />
            <ColorField
              configKey="comment_text_color"
              label="コメントの色"
              description="コメントのテキスト色を設定します。"
            />
            <NumberField
              configKey="comment_area_font_size_px"
              label="コメントのサイズ（px）"
              description="コメントのサイズをピクセル単位で設定します。"
            />
            <SliderField
              configKey="comment_area_opacity_percentage"
              label="コメントの透明度"
              description="コメントの透明度を設定します。"
            />
            <SliderField
              configKey="nicoarea_scale"
              label="コメントの拡大率"
              description="コメントの拡大率を設定します。"
            />
            <CheckboxGroupField
              configKey="visible_comments"
              label="表示するコメント"
              description="表示するコメントを選択します。"
            />
          </Stack>
        </Fieldset>
      </Grid.Col>

      <Grid.Col span={{ base: 6, md: 3 }}>
        <Fieldset legend={<Title order={2}>コメントの設定</Title>}>
          <Stack align="stretch" justify="center" gap="lg">
            <SwitchField
              configKey="load_comments_on_next_video"
              label="次の動画でコメントを読み込む"
              description="次の動画が始まったときに、自動的にコメントを読み込みます。"
            />
            <CheckboxField
              configKey="show_comments_in_list"
              label="コメントをリストで表示"
              description="コメントをリスト形式で表示します。"
            />
            <CheckboxField
              configKey="show_nicoru_count"
              label="ニコる数を表示"
              description="コメントのニコる数（いいね）を表示します。"
            />
            <CheckboxField
              configKey="show_comments_in_niconico_style"
              label="ニコニコ風コメント表示"
              description="コメントをニコニコ動画風に表示します。"
            />
            <CheckboxField
              configKey="channels_only"
              label="チャンネルのみ"
              description="チャンネルのコメントのみを表示します。"
            />
            <NumberField
              configKey="comment_timing_offset"
              label="コメント表示タイミングオフセット"
              description="コメントの表示タイミングを調整します（ミリ秒単位）。"
            />
          </Stack>
        </Fieldset>

        <Fieldset legend={<Title order={2}>アドオンの設定</Title>} mt="lg">
          <Stack align="stretch" justify="center" gap="lg">
            <SwitchField
              configKey="enable_addon_smooth_player"
              label="スムーズプレイヤーを有効にする"
              description="プレイヤーのスムーズな再生を有効にします。"
            />
            <SwitchField
              configKey="enable_addon_disable_new_window"
              label="新しいウィンドウを無効にする"
              description="新しいウィンドウでの表示を無効にします。"
            />
          </Stack>
        </Fieldset>

        <Fieldset legend={<Title order={2}>作品ページ</Title>} mt="lg">
          <Stack align="stretch" justify="center" gap="lg">
            <SwitchField
              configKey="enable_addon_add_button_to_play"
              label="再生ボタンを追加"
              description="再生ページにボタンを追加します。"
            />
            <SwitchField
              configKey="addon_option_play_in_same_tab"
              label="同じタブで再生"
              description="動画を同じタブで再生します。"
            />
          </Stack>
        </Fieldset>
      </Grid.Col>
    </Grid>
  );
}

export default ConfigrationsPanel;
