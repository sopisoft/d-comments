import { Anchor, Divider, Group, Stack, Text } from '@mantine/core';
import { MdOpenInNew } from 'react-icons/md';
import { QuickOptionsPanel } from '@/config/components/QuickOptionsPanel';
import { useTheme } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';

export function SettingsPanel(): React.ReactElement {
  const { styles: ps } = useTheme();
  return (
    <Stack p="md" gap="lg">
      <QuickOptionsPanel />
      <Divider color={ps.border.default} />
      <div
        style={{
          background: ps.bg.elevated,
          border: ps.panel.border,
          borderRadius: ui.radius.md,
          padding: ui.space.md,
        }}
      >
        <Group justify="space-between" align="center">
          <Text size="sm" c={ps.text.muted}>
            より詳細な設定はオプションページで行えます
          </Text>
          <Anchor
            href={browser.runtime.getURL('/options.html').toString()}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            fw={500}
          >
            <Group gap={4}>
              詳細設定ページを開く
              <MdOpenInNew size={14} />
            </Group>
          </Anchor>
        </Group>
      </div>
    </Stack>
  );
}
