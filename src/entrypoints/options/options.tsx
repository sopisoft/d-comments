import { Anchor, AppShell, Group, Paper, Tabs, Title } from "@mantine/core";
import { MdOpenInNew } from "react-icons/md";
import { ConfigurationsPanel } from "@/config/components/ConfigurationsPanel";
import { NgListPanel } from "@/config/components/NgListPanel";
import { QuickOptionsPanel } from "@/config/components/QuickOptionsPanel";
import { SurveyFormPanel } from "@/config/components/SurveyForm";
import { useTheme } from "@/config/hooks/useTheme";

export function Options() {
  const { styles: ps } = useTheme();
  return (
    <Tabs defaultValue="configurations" variant="pills">
      <AppShell header={{ height: 56 }} padding="lg">
        <AppShell.Header
          style={{
            backgroundColor: ps.bg.elevated,
            borderBottom: `1px solid ${ps.border.default}`,
          }}
        >
          <Group h="100%" px="lg" justify="space-between">
            <Title order={4} c={ps.accent}>
              d-comments 設定
            </Title>
            <Tabs.List>
              <Tabs.Tab value="quick">クイック設定</Tabs.Tab>
              <Tabs.Tab value="configurations">詳細設定</Tabs.Tab>
              <Tabs.Tab value="ng">NG 管理</Tabs.Tab>
              <Tabs.Tab value="form">フォーム</Tabs.Tab>
              <Tabs.Tab value="usage">使用方法</Tabs.Tab>
            </Tabs.List>
          </Group>
        </AppShell.Header>
        <AppShell.Main
          style={{
            color: ps.text.primary,
            backgroundColor: ps.bg.surface,
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Tabs.Panel value="quick">
              <QuickOptionsPanel />
            </Tabs.Panel>
            <Tabs.Panel value="configurations">
              <ConfigurationsPanel />
            </Tabs.Panel>
            <Tabs.Panel value="ng">
              <NgListPanel />
            </Tabs.Panel>
            <Tabs.Panel value="form">
              <SurveyFormPanel />
            </Tabs.Panel>
            <Tabs.Panel value="usage">
              <Paper p="md" radius="md">
                <Anchor href="usage.html" target="_blank" rel="noopener noreferrer">
                  <Title order={4} fw={600} c={ps.accent}>
                    つかいかたを新しいタブで開く
                    <MdOpenInNew size={12} style={{ opacity: 0.6 }} />
                  </Title>
                </Anchor>
              </Paper>
              <iframe title="Usage" src="usage.html" style={{ width: "100%", height: "80vh", border: "none" }} />
            </Tabs.Panel>
          </div>
        </AppShell.Main>
      </AppShell>
    </Tabs>
  );
}
