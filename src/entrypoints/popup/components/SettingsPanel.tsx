import { Anchor, Stack } from "@mantine/core";
import QuickOptionsPanel from "@/entrypoints/options/panels/quick";

function SettingsPanel() {
  return (
    <Stack p="sm" gap="xl">
      <QuickOptionsPanel />
      <Anchor
        href={browser.runtime.getURL("/options.html").toString()}
        target="_blank"
        rel="noopener noreferrer"
      >
        詳細設定ページを開く
      </Anchor>
    </Stack>
  );
}

export default SettingsPanel;
