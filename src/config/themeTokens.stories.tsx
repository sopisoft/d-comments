import { Badge, ColorSwatch, Group, Paper, Stack, Text, Title } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { readableTextOnHex } from '@/lib/color';
import { useTheme } from './hooks/useTheme';
import { ui } from './themeTokens';

const meta = {
  title: 'Foundation/Design tokens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPalette: Story = {
  render: () => <ColorPaletteStory />,
};

export const Spacing: Story = {
  render: () => <SpacingStory />,
};

export const Radii: Story = {
  render: () => <RadiiStory />,
};

export const Typography: Story = {
  render: () => <TypographyStory />,
};

function ColorPaletteStory(): React.ReactElement {
  const { palette } = useTheme();
  const colors = [
    ['Base', palette.bg.base],
    ['Elevated', palette.bg.elevated],
    ['Surface', palette.bg.surface],
    ['Deep', palette.bg.deep],
    ['Accent', palette.accent],
  ] as const;
  const accentText = readableTextOnHex(palette.accent);

  return (
    <TokenFrame title="カラーと境界線" description="画面の背景、文字、アクセントで使用する色です。">
      <Stack gap={ui.space.sm}>
        {colors.map(([name, color]) => (
          <Paper
            key={name}
            p={ui.space.sm}
            style={{ background: color, border: `1px solid ${palette.border.default}` }}
          >
            <Group justify="space-between" align="center">
              <Group gap={ui.space.sm}>
                <ColorSwatch color={color} size={ui.icon.xl} />
                <Text size="sm" c={name === 'Accent' ? accentText : palette.text.primary} fw={ui.font.weight.semibold}>
                  {name}
                </Text>
              </Group>
              <Badge variant="light">{color}</Badge>
            </Group>
          </Paper>
        ))}
      </Stack>
    </TokenFrame>
  );
}

function SpacingStory(): React.ReactElement {
  const { palette } = useTheme();
  return (
    <TokenFrame title="余白" description="余白トークンをパネル内のコンテンツ間隔として表示します。">
      <Stack gap={ui.space.sm}>
        {Object.entries(ui.space).map(([name, value]) => (
          <Paper
            key={name}
            style={{
              background: palette.bg.deep,
              border: `1px solid ${palette.border.subtle}`,
              padding: value,
            }}
          >
            <Group justify="space-between" align="center">
              <Text size="sm" fw={ui.font.weight.semibold}>
                {name}
              </Text>
              <Text size="xs" c={palette.text.secondary}>
                コンテンツとの距離 {value}px
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>
    </TokenFrame>
  );
}

function RadiiStory(): React.ReactElement {
  const { palette } = useTheme();
  return (
    <TokenFrame title="角丸" description="カードや入力要素に適用する角丸の違いを表示します。">
      <Group align="stretch" gap={ui.space.sm} wrap="wrap">
        {Object.entries(ui.radius).map(([name, value]) => (
          <Paper
            key={name}
            style={{
              background: palette.bg.surface,
              border: `1px solid ${palette.border.default}`,
              borderRadius: value,
              flex: '1 1 120px',
              minHeight: 72,
              padding: ui.space.md,
            }}
          >
            <Text size="sm" fw={ui.font.weight.semibold}>
              {name}
            </Text>
            <Text size="xs" c={palette.text.secondary}>
              {value}px
            </Text>
          </Paper>
        ))}
      </Group>
    </TokenFrame>
  );
}

function TypographyStory(): React.ReactElement {
  const { palette } = useTheme();
  return (
    <TokenFrame title="タイポグラフィ" description="フォントサイズ、太さ、行間を実際のテキストで確認します。">
      <Stack gap={ui.space.md}>
        {Object.entries(ui.font.size).map(([name, value]) => (
          <Paper key={name} p={ui.space.sm} style={{ background: palette.bg.surface }}>
            <Text
              style={{
                color: palette.text.primary,
                fontSize: value,
                fontWeight: ui.font.weight.medium,
                lineHeight: ui.font.lineHeight.normal,
              }}
            >
              {name} — Storybookサンプルのテキスト
            </Text>
          </Paper>
        ))}
      </Stack>
    </TokenFrame>
  );
}

function TokenFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}): React.ReactElement {
  const { palette } = useTheme();
  return (
    <Stack gap={ui.space.lg} maw={640}>
      <Stack gap={ui.space.xs}>
        <Title order={2}>{title}</Title>
        <Text c={palette.text.secondary} size="sm">
          {description}
        </Text>
      </Stack>
      <Paper withBorder p={ui.space.lg} radius={ui.radius.md}>
        {children}
      </Paper>
    </Stack>
  );
}
