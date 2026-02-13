import { Accordion, Anchor, Badge, Code, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MdBugReport, MdHelp, MdOpenInNew, MdSettings, MdStorage } from 'react-icons/md';
import { useTheme } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

const toJsonValue = (value: unknown): JsonValue => {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.map(toJsonValue);
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, toJsonValue(v)]));
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value);
};

const toJsonObject = (value: unknown): JsonObject =>
  typeof value === 'object' && value !== null ? (toJsonValue(value) as JsonObject) : {};

function formUrl(): URL {
  const version = browser.runtime.getManifest().version;
  const url = new URL('https://forms.office.com/Pages/ResponsePage.aspx');
  url.searchParams.append('id', 'DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABWTsPtUNkUyNzMwSFkyNEVENTExTVdINUNBUDBFNC4u');
  url.searchParams.append('r4fc5e3af4be04561a824b6564847f811', version);
  return url;
}

export function OtherPanel(): React.ReactElement {
  const { styles: ps } = useTheme();
  const [stored, setStored] = useState<JsonObject>({});
  useEffect(() => {
    browser.storage.local.get().then((items) => setStored(toJsonObject(items)));
  }, []);

  const manifest = browser.runtime.getManifest();
  const panelStyle = {
    background: ps.bg.elevated,
    border: `1px solid ${ps.border.default}`,
  };
  const linkIcon = <MdOpenInNew size={12} style={{ opacity: 0.6 }} />;

  return (
    <Stack gap="lg" p="md">
      <Paper p="lg" radius="md" ta="center" style={panelStyle}>
        <Stack align="center" gap="xs">
          <Title order={3} fw={600} c={ps.text.primary}>
            {manifest.name}
          </Title>
          <Badge variant="light" color="orange" size="lg">
            v{manifest.version}
          </Badge>
        </Stack>
      </Paper>

      <Paper p="md" radius="md" style={panelStyle}>
        <Stack gap="sm">
          <Anchor href={formUrl().toString()} target="_blank" rel="noopener noreferrer" size="sm">
            <Group gap="xs">
              <MdBugReport size={16} />
              不具合報告{linkIcon}
            </Group>
          </Anchor>
          <Divider color={ps.border.subtle} />
          <Anchor
            href={browser.runtime.getURL('/usage.html').toString()}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <Group gap="xs">
              <MdHelp size={16} />
              使用方法{linkIcon}
            </Group>
          </Anchor>
          <Divider color={ps.border.subtle} />
          <Anchor
            href={browser.runtime.getURL('/options.html').toString()}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <Group gap="xs">
              <MdSettings size={16} />
              詳細設定ページを開く{linkIcon}
            </Group>
          </Anchor>
        </Stack>
      </Paper>

      <Accordion variant="separated" radius="md" styles={{ control: { padding: ui.space.md }, item: panelStyle }}>
        <Accordion.Item value="storage">
          <Accordion.Control>
            <Group gap="xs">
              <MdStorage size={16} color={ps.text.primary} />
              <Text size="sm" c={ps.text.primary}>
                ストレージの内容
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion
              variant="contained"
              radius="sm"
              styles={{
                item: {
                  background: ps.bg.base,
                  borderColor: ps.border.default,
                },
              }}
            >
              {Object.entries(stored).map(([key, value]) => (
                <Accordion.Item value={key} key={key}>
                  <Accordion.Control>
                    <Text size="xs" ff="monospace">
                      {key}
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Code block style={{ background: ps.bg.deep, fontSize: '0.75rem' }}>
                      {JSON.stringify(value, null, 2)}
                    </Code>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
