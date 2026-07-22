import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuickOptionsPanel } from './QuickOptionsPanel';

const meta = { title: 'Settings/QuickOptionsPanel', component: QuickOptionsPanel } satisfies Meta<
  typeof QuickOptionsPanel
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
