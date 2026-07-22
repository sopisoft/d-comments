import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popup } from './popup';

const meta = {
  title: 'Pages/Popup',
  component: Popup,
  parameters: { layout: 'fullscreen', popup: true },
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDAnimePlayingPage: Story = {
  parameters: {
    extension: {
      activeTab: {
        id: 10,
        title: 'サンプル作品 - dアニメストア',
        url: 'https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=storybook',
      },
    },
  },
};

export const OnOtherPage: Story = {
  parameters: {
    extension: {
      activeTab: {
        id: 11,
        title: '別のページ',
        url: 'https://example.com/',
      },
    },
  },
};
