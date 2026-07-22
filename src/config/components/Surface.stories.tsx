import { Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ui } from '@/config/theme';
import { Surface } from './Surface';

const meta = {
  title: 'Foundation/Surface',
  component: Surface,
  args: { children: 'StorybookサンプルのSurface', p: 'md', radius: 'md' },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Group align="stretch" grow>
      {(['base', 'elevated', 'surface', 'deep'] as const).map((tone) => (
        <Surface key={tone} tone={tone} p="md" radius="md">
          <Stack gap="xs">
            <Text fw={ui.font.weight.semibold}>{tone}</Text>
            <Text size="sm">Storybookサンプルとして背景と境界線を確認</Text>
          </Stack>
        </Surface>
      ))}
    </Group>
  ),
};
