import { AppShell, Group, Tabs } from "@mantine/core";
import ConfigrationsPanel from "./panels/configs";
import QuickOptionsPanel from "./panels/quick";

function Options() {
  return (
    <Tabs defaultValue="configurations" variant="pills">
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Tabs.List grow>
              <Tabs.Tab value="quick">クイック設定</Tabs.Tab>
              <Tabs.Tab value="configurations">詳細設定</Tabs.Tab>
            </Tabs.List>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Tabs.Panel value="quick">
            <QuickOptionsPanel />
          </Tabs.Panel>
          <Tabs.Panel value="configurations">
            <ConfigrationsPanel />
          </Tabs.Panel>
        </AppShell.Main>
      </AppShell>
    </Tabs>
  );
}

export default Options;
