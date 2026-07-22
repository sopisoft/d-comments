import type { Meta, StoryObj } from '@storybook/react-vite';
import { SliderField } from './Fields';

const meta = {
  title: 'Settings/Fields/SliderField',
  component: SliderField,
  parameters: { layout: 'padded' },
  args: {
    configKey: 'comment_area_opacity_percentage',
    label: 'コメントの透明度',
  },
} satisfies Meta<typeof SliderField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
