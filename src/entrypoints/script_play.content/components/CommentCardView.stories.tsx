import type { Meta, StoryObj } from '@storybook/react-vite';
import { ui } from '@/config/theme';
import { CommentCardView } from './CommentCardView';
import type { ThemeProps } from './types';

const theme: ThemeProps = {
  fontSizePx: ui.font.size.md,
  palette: {
    accent: '#B93815',
    bg: { base: '#1A1B1E', elevated: '#25262B', surface: '#2C2E33', deep: '#373A40' },
    text: { primary: '#F8F9FA', secondary: '#DEE2E6', muted: '#ADB5BD' },
    border: { default: '#495057', subtle: '#3D4349' },
  },
  showNicoru: true,
  alpha: (a) => `rgba(248, 249, 250, ${a})`,
};

const meta = {
  title: 'Comments/CommentCardView',
  component: CommentCardView,
  args: {
    comment: {
      id: 'storybook-comment',
      no: 1,
      body: 'Storybookサンプルのコメント',
      vposMs: 123000,
      commands: [],
      userId: 'storybook-user',
      isPremium: false,
      score: 0,
      postedAt: '2026-01-01T00:00:00.000Z',
      nicoruCount: 12,
      nicoruId: null,
      source: 'leaf',
      isMyPost: false,
    },
    theme,
    isActive: false,
    hovered: false,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
    showDivider: false,
  },
} satisfies Meta<typeof CommentCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { isActive: true } };
export const WithoutNicoru: Story = { args: { theme: { ...theme, showNicoru: false } } };
