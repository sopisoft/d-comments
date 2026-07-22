import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { useTheme } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';
import { CommentDetailView } from './CommentDetailView';
import type { ThemeProps } from './types';

const theme: ThemeProps = {
  alpha: (a) => `rgba(248, 249, 250, ${a})`,
  fontSizePx: ui.font.size.md,
  palette: {
    accent: '#B93815',
    bg: { base: '#1A1B1E', elevated: '#25262B', surface: '#2C2E33', deep: '#373A40' },
    text: { primary: '#F8F9FA', secondary: '#DEE2E6', muted: '#ADB5BD' },
    border: { default: '#495057', subtle: '#3D4349' },
  },
  showNicoru: true,
};

const meta = {
  title: 'Comments/CommentDetailView',
  component: CommentDetailView,
  render: (args) => <ThemeAwareCommentDetail {...args} />,
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
    onSeek: () => {},
    onClose: () => {},
  },
} satisfies Meta<typeof CommentDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'NGワード' })).toBeVisible();
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
    await expect(canvas.getByRole('button', { name: '再生位置へ移動' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'ユーザーを NG 登録' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'NG ワードとして登録' })).toBeVisible();
  },
};

function ThemeAwareCommentDetail(args: React.ComponentProps<typeof CommentDetailView>): React.ReactElement {
  const { palette } = useTheme();
  const theme: ThemeProps = {
    ...args.theme,
    alpha: (a) => ui.alpha(palette.text.primary, a),
    palette,
  };
  return <CommentDetailView {...args} theme={theme} />;
}
