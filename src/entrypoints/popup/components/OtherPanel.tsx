import { Accordion, Anchor, Badge, Code, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MdBugReport, MdHelp, MdOpenInNew, MdSettings, MdStorage } from 'react-icons/md';
import { Surface } from '@/config/components/Surface';
import { useTheme } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';
import { logger } from '@/lib/logger';

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toJsonValue = (value: unknown): JsonValue => {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.map(toJsonValue);
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toJsonValue(v)]));
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value);
};

const toJsonObject = (value: unknown): JsonObject => {
  if (!isRecord(value)) return {};
  const object: JsonObject = {};
  for (const [key, item] of Object.entries(value)) object[key] = toJsonValue(item);
  return object;
};

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
    browser.storage.local
      .get()
      .then((items) => setStored(toJsonObject(items)))
      .catch(logger.error);
  }, []);

  const manifest = browser.runtime.getManifest();
  const panelStyle = { background: ps.bg.elevated, border: `1px solid ${ps.border.default}` };
  const linkIcon = <MdOpenInNew size={ui.icon.xs} style={{ opacity: 0.6 }} />;

  return (
    <Stack gap="lg" p="md">
      <Surface p="lg" radius="md" ta="center" style={panelStyle}>
        <Stack align="center" gap="xs">
          <Title order={3} fw={ui.font.weight.semibold} c={ps.text.primary}>
            {manifest.name}
          </Title>
          <Badge variant="light" color="dark" size="lg">
            v{manifest.version}
          </Badge>
        </Stack>
      </Surface>

      <Surface p="md" radius="md" style={panelStyle}>
        <Stack gap="sm">
          <Anchor href={formUrl().toString()} target="_blank" rel="noopener noreferrer" size="sm">
            <Group gap="xs">
              <MdBugReport size={ui.icon.md} />
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
              <MdHelp size={ui.icon.md} />
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
              <MdSettings size={ui.icon.md} />
              詳細設定ページを開く{linkIcon}
            </Group>
          </Anchor>
        </Stack>
      </Surface>

      <Accordion variant="separated" radius="md" styles={{ control: { padding: ui.space.md }, item: panelStyle }}>
        <Accordion.Item value="storage">
          <Accordion.Control>
            <Group gap="xs">
              <MdStorage size={ui.icon.md} color={ps.text.primary} />
              <Text size="sm" c={ps.text.primary}>
                ストレージの内容
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion
              variant="contained"
              radius="sm"
              styles={{ item: { background: ps.bg.base, borderColor: ps.border.default } }}
            >
              {Object.entries(stored).map(([key, value]) => (
                <Accordion.Item value={key} key={key}>
                  <Accordion.Control>
                    <Text size="xs" ff="monospace">
                      {key}
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Code block style={{ background: ps.bg.deep, fontSize: ui.font.size.xs }}>
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
