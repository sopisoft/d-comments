import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SettingsPanel } from './SettingsPanel';

const meta = {
  title: 'Popup/SettingsPanel',
  component: SettingsPanel,
  parameters: { popup: true },
} satisfies Meta<typeof SettingsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: /オプションページ/ })).toBeVisible();
  },
};
