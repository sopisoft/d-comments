import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxGroupField } from './Fields';

const meta = {
  title: 'Settings/Fields/CheckboxGroupField',
  component: CheckboxGroupField,
  parameters: { layout: 'padded' },
  args: {
    configKey: 'visible_comments',
    label: '表示するコメント',
  },
} satisfies Meta<typeof CheckboxGroupField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
