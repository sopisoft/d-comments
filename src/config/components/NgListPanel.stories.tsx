import type { Meta, StoryObj } from '@storybook/react-vite';
import { NgListPanel } from './NgListPanel';

const meta = {
  title: 'Settings/NgListPanel',
  component: NgListPanel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NgListPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
