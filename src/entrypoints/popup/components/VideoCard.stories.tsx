import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoCard } from './VideoCard';

const meta = {
  title: 'Popup/VideoCard',
  component: VideoCard,
  parameters: { popup: true },
  args: {
    item: {
      contentId: 'so35384944',
      title: 'Storybook用のサンプル動画タイトル',
      description: '',
      commentCounter: 1234,
      viewCounter: 56789,
      lengthSeconds: 154,
      isDAnime: true,
      thumbnailUrl: 'https://placehold.co/320x180/25262B/EB5528?text=d-comments',
    },
    playing: false,
    togglePlaying: async () => {},
  },
} satisfies Meta<typeof VideoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Playing: Story = { args: { playing: true } };
