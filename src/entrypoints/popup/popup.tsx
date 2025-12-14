import { AppShell, Group, Tabs, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTheme } from "@/config/hooks/useTheme";
import { getActiveTabId } from "@/messaging/runtime";
import { FetchPanel } from "./components/FetchPanel";
import { OtherPanel } from "./components/OtherPanel";
import { SettingsPanel } from "./components/SettingsPanel";

const PLAYING_PATH = "animestore/sc_d_pc?partId=";

export function Popup() {
  const { styles: ps } = useTheme();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = await getActiveTabId();
      if (cancelled || id === null) return;
      const tab = await browser.tabs.get(id);
      setUrl(tab.url ?? "");
      setTitle(tab.title ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canFetch = url.includes(PLAYING_PATH);

  return (
    <Tabs defaultValue="fetch" variant="pills" style={{ width: "720px", height: "600px", backgroundColor: ps.bg.base }}>
      <AppShell
        header={{ height: 56 }}
        padding="md"
        styles={{
          root: { backgroundColor: ps.bg.surface },
          main: { backgroundColor: ps.bg.surface },
          header: {
            backgroundColor: ps.bg.elevated,
            borderBottom: `1px solid ${ps.border.default}`,
          },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Title order={5} c={ps.accent}>
              d-comments
            </Title>
            <Tabs.List>
              <Tabs.Tab value="fetch" size="sm">
                コメント取得
              </Tabs.Tab>
              <Tabs.Tab value="settings" size="sm">
                設定
              </Tabs.Tab>
              <Tabs.Tab value="other" size="sm">
                その他
              </Tabs.Tab>
            </Tabs.List>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Tabs.Panel value="fetch">
            {canFetch ? (
              <FetchPanel title={title} />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "300px",
                  gap: "16px",
                }}
              >
                <Text size="lg" c={ps.text.muted}>
                  dアニメストアの視聴ページでご利用ください
                </Text>
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="settings">
            <SettingsPanel />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <OtherPanel />
          </Tabs.Panel>
        </AppShell.Main>
      </AppShell>
    </Tabs>
  );
}
