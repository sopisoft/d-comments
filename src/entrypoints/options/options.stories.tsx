import type { Meta, StoryObj } from '@storybook/react-vite';
import { Options } from './options';

const meta = { title: 'Pages/Options', component: Options, parameters: { layout: 'fullscreen' } } satisfies Meta<
  typeof Options
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
