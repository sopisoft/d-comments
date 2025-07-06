import { Fieldset, Stack, Title } from "@mantine/core";
import { NumberField, SwitchField } from "./fields";

function QuickOptionsPanel() {
  return (
    <Fieldset maw="600px" legend={<Title order={2}>クイックオプション</Title>}>
      <Stack>
        <SwitchField
          configKey="login"
          label="ニコニコにログイン"
          description="ニコニコ動画にログインすると、ニコニコ動画とNGユーザー・NGワードの同期ができます。"
        />
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
        <SwitchField
          configKey="enable_auto_scroll"
          label="自動スクロール"
          description="コメントの自動スクロールを有効にします。"
        />
        <NumberField
          configKey="comment_timing_offset"
          label="コメント表示タイミングオフセット"
          description="コメントの表示タイミングを調整します（ミリ秒単位）。"
        />
      </Stack>
    </Fieldset>
  );
}

export default QuickOptionsPanel;
