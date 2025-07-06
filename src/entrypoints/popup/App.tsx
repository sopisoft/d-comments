"use client";

import { AppShell, Group, Tabs, Text } from "@mantine/core";
import FetchPanel from "./components/FetchPanel";
import OtherPanel from "./components/OtherPanel";
import SettingsPanel from "./components/SettingsPanel";

function App() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => setUrl(tabs[0].url ?? ""));
  }, []);

  function isPlayingTab(url: string) {
    return url.includes("animestore/sc_d_pc?partId=");
  }

  return (
    <Tabs
      defaultValue="fetch"
      variant="pills"
      style={{ width: "720px", height: "600px" }}
    >
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Tabs.List grow>
              <Tabs.Tab value="fetch">コメント取得</Tabs.Tab>
              <Tabs.Tab value="settings">設定</Tabs.Tab>
              <Tabs.Tab value="other">その他</Tabs.Tab>
            </Tabs.List>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Tabs.Panel value="fetch">
            {isPlayingTab(url) ? (
              <FetchPanel />
            ) : (
              <Text>dアニメストアの視聴ページでご利用ください。</Text>
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

export default App;
