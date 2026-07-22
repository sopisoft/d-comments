import { Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MdSettings } from 'react-icons/md';
import { SectionCard } from './SectionCard';

const meta = {
  title: 'Foundation/SectionCard',
  component: SectionCard,
  args: {
    title: 'Storybookサンプルの設定セクション',
    description: '共通の見出しとSurfaceを持つサンプルです',
    icon: MdSettings,
    children: null,
  },
} satisfies Meta<typeof SectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SectionCard {...args}>
      <Text>Storybookサンプルのコンテンツを配置します。</Text>
    </SectionCard>
  ),
};
