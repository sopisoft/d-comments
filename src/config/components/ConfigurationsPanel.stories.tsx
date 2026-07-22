import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfigurationsPanel } from './ConfigurationsPanel';

const meta = {
  title: 'Settings/ConfigurationsPanel',
  component: ConfigurationsPanel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ConfigurationsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
