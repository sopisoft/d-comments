import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField } from './Fields';

const meta = {
  title: 'Settings/Fields/NumberField',
  component: NumberField,
  parameters: { layout: 'padded' },
  args: { configKey: 'comment_timing_offset', label: 'タイミングオフセット', description: 'ミリ秒単位で調整します' },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
