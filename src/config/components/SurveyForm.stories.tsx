import type { Meta, StoryObj } from '@storybook/react-vite';
import { SurveyFormPanel } from './SurveyForm';

const meta = {
  title: 'Settings/SurveyFormPanel',
  component: SurveyFormPanel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SurveyFormPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
