import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchForm } from './SearchForm';

const meta = {
  title: 'Popup/SearchForm',
  component: SearchForm,
  parameters: { popup: true },
  args: { addVideos: async () => {}, initialWord: 'まちカドまぞく' },
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
