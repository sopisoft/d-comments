import { Box, Divider, Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { MdDarkMode, MdLightMode, MdPalette, MdSettings } from "react-icons/md";
import { setConfig } from "@/config";
import { useTheme } from "@/config/hooks/useTheme";
import { type ColorMode, ui } from "@/config/theme";

const modes: [ColorMode, string, typeof MdLightMode][] = [
  ["light", "ライト", MdLightMode],
  ["dark", "ダーク", MdDarkMode],
  ["auto", "自動", MdSettings],
];

export function ThemeSettingsPanel() {
  const { configMode, palette, styles } = useTheme();
  return (
    <Stack gap="lg">
      <Group gap="sm">
        <MdPalette size={24} color={palette.accent} />
        <Title order={3} fw={600} c={styles.text.primary}>
          テーマ設定
        </Title>
      </Group>
      <Divider color={styles.border.subtle} />
      <Box
        p="md"
        style={{
          borderRadius: ui.radius.md,
          background: styles.bg.elevated,
          border: `1px solid ${styles.border.default}`,
        }}
      >
        <Stack gap="xs">
          <Text size="sm" fw={500} c={styles.text.primary}>
            カラーモード
          </Text>
          <SegmentedControl
            value={configMode}
            onChange={(v) => setConfig("theme_color_mode", v as ColorMode)}
            fullWidth
            data={modes.map(([v, l, I]) => ({
              value: v,
              label: (
                <Group gap={6} justify="center">
                  <I size={16} />
                  {l}
                </Group>
              ),
            }))}
            style={{
              color: styles.text.primary,
              background: styles.bg.surface,
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
