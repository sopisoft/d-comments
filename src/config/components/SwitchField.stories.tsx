import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchField } from './Fields';

const meta = {
  title: 'Settings/Fields/SwitchField',
  component: SwitchField,
  parameters: { layout: 'padded' },
  args: {
    configKey: 'auto_search',
    label: '自動検索',
    description: 'ポップアップ表示時に検索します',
  },
} satisfies Meta<typeof SwitchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
