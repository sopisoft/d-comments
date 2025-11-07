import { AppShell, Group, Tabs } from "@mantine/core";
import {
  ConfigurationsPanel,
  QuickOptionsPanel,
  SurveyFormPanel,
} from "@/config";
import { NgListPanel } from "@/config/components/NgListPanel";

export function Options() {
  return (
    <Tabs defaultValue="configurations" variant="pills">
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Tabs.List grow>
              <Tabs.Tab value="quick">クイック設定</Tabs.Tab>
              <Tabs.Tab value="configurations">詳細設定</Tabs.Tab>
              <Tabs.Tab value="ng">NG 管理</Tabs.Tab>
              <Tabs.Tab value="form">フォーム</Tabs.Tab>
            </Tabs.List>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
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
        </AppShell.Main>
      </AppShell>
    </Tabs>
  );
}
