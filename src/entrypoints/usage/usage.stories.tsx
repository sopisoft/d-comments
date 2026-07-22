import type { Meta, StoryObj } from '@storybook/react-vite';
import { Usage } from './usage';

const meta = {
  title: 'Pages/Usage',
  component: Usage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Usage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
