import { Stack, Switch, Title } from "@mantine/core";
import { useState } from "react";
import {
  type ConfigKeysWithUIType,
  type ConfigValue,
  getConfig,
  getDefaultValue,
  setConfig,
} from "@/config";

function SwitchField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"switch">;
  label: string;
  description: string;
}) {
  const [value, setValue] = useState<ConfigValue<typeof configKey> | null>(
    null
  );

  getConfig(configKey, setValue);

  function save_value(value: ConfigValue<typeof configKey>) {
    setConfig(configKey, value);
    setValue(value);
  }

  return (
    <Switch
      label={label}
      description={description}
      checked={value ?? getDefaultValue(configKey)}
      disabled={value === null}
      onChange={(event) => save_value(event.currentTarget.checked)}
    />
  );
}

function QuickOptionsPanel() {
  return (
    <Stack>
      <Title order={2}>クイックオプション</Title>
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
    </Stack>
  );
}

export default QuickOptionsPanel;
