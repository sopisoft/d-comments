import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControlField } from './Fields';

const meta = {
  title: 'Settings/Fields/SegmentedControlField',
  component: SegmentedControlField,
  parameters: { layout: 'padded' },
  args: {
    configKey: 'theme_color_mode',
    label: 'カラーモード',
  },
} satisfies Meta<typeof SegmentedControlField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
