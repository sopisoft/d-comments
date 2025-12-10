import { AppShell, Group, Tabs, Title } from "@mantine/core";
import { ConfigurationsPanel, QuickOptionsPanel, SurveyFormPanel, useTheme } from "@/config";
import { NgListPanel } from "@/config/components/NgListPanel";

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
          </div>
        </AppShell.Main>
      </AppShell>
    </Tabs>
  );
}
