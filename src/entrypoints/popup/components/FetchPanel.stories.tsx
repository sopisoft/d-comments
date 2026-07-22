import type { Meta, StoryObj } from '@storybook/react-vite';
import { FetchPanel } from './FetchPanel';

const meta = {
  title: 'Popup/FetchPanel',
  component: FetchPanel,
  parameters: { popup: true },
  args: { title: 'サンプル作品' },
} satisfies Meta<typeof FetchPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
