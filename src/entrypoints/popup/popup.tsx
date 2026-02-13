import { AppShell, Group, Tabs, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTheme } from '@/config/hooks/useTheme';
import { getActiveTabId } from '@/messaging/runtime';
import { FetchPanel } from './components/FetchPanel';
import { OtherPanel } from './components/OtherPanel';
import { SettingsPanel } from './components/SettingsPanel';

const PLAYING_PATH = 'animestore/sc_d_pc?partId=';

export function Popup(): React.ReactElement {
  const { styles: ps } = useTheme();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = await getActiveTabId();
      if (cancelled || id === null) return;
      const tab = await browser.tabs.get(id);
      setUrl(tab.url ?? '');
      setTitle(tab.title ?? '');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canFetch = url.includes(PLAYING_PATH);

  return (
    <Tabs defaultValue="fetch" variant="pills" style={{ backgroundColor: ps.bg.base, height: '600px', width: '720px' }}>
      <AppShell
        header={{ height: 56 }}
        padding="md"
        styles={{
          header: {
            backgroundColor: ps.bg.elevated,
            borderBottom: `1px solid ${ps.border.default}`,
          },
          main: { backgroundColor: ps.bg.surface },
          root: { backgroundColor: ps.bg.surface },
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
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  height: '300px',
                  justifyContent: 'center',
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
