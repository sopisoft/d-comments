import { Box } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { createPalette } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';
import type { NvCommentItem, Threads } from '@/types/api';
import { createSidebarStyles, type SidebarConfig } from '../context/SidebarContext';
import { SidebarComments } from './SidebarComments';

const config = {
  mode: 'light',
  palette: createPalette('light'),
  width: ui.layout.sidebarStoryWidth,
  fontSize: ui.font.size.md,
  opacity: 100,
  visibility: true,
  showNicoru: true,
  scrollSmoothly: false,
  timingOffset: 0,
  fps: 60,
  alpha: (a: number) => `rgba(33, 37, 41, ${a})`,
  setWidth: () => {},
  saveWidth: () => {},
} satisfies SidebarConfig;

const comments: NvCommentItem[] = Array.from({ length: 50 }, (_, index) => {
  const no = index + 1;
  const body = `コメント ${no}`;
  return {
    id: `storybook-sidebar-${no}`,
    no,
    body,
    vposMs: no * 12000,
    commands: [],
    userId: `storybook-user-${no}`,
    isPremium: no % 2 === 0,
    score: 0,
    postedAt: '2026-01-01T00:00:00.000Z',
    nicoruCount: no * 2,
    nicoruId: null,
    source: 'leaf',
    isMyPost: false,
  };
});

const threads: Threads = [
  {
    id: 1,
    fork: 'main',
    commentCount: comments.length,
    comments,
  },
];

const meta = {
  title: 'Sidebar/SidebarComments',
  component: SidebarComments,
  args: { threads, config, video: null, styles: createSidebarStyles(config) },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <Box
      h="100vh"
      w={ui.layout.sidebarStoryWidth}
      style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
    >
      <SidebarComments {...args} />
    </Box>
  ),
} satisfies Meta<typeof SidebarComments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('コメント 1')).toBeVisible();
    await expect(canvas.getByText(/コメント:\s*50/)).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'コメント: コメント 2' }));
    await expect(within(document.body).getByRole('dialog')).toBeVisible();
    await expect(canvas.getByText(/No\.2/)).toBeVisible();

    await userEvent.click(within(document.body).getByRole('button', { name: '閉じる' }));
    await expect(within(document.body).queryByRole('dialog')).toBeNull();
  },
};
