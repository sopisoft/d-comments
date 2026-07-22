import type { Meta, StoryObj } from '@storybook/react-vite';
import { OtherPanel } from './OtherPanel';

const meta = {
  title: 'Popup/OtherPanel',
  component: OtherPanel,
  parameters: { popup: true },
} satisfies Meta<typeof OtherPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
