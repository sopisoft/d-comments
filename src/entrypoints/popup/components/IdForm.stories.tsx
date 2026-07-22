import type { Meta, StoryObj } from '@storybook/react-vite';
import { IdForm } from './IdForm';

const meta = {
  title: 'Popup/IdForm',
  component: IdForm,
  parameters: { popup: true },
  args: { addPlaying: async () => {} },
} satisfies Meta<typeof IdForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
