import type { IconType } from 'react-icons';
import {
  MdAutorenew,
  MdChat,
  MdExtension,
  MdMovie,
  MdOutlineVideoStable,
  MdPalette,
  MdSearch,
  MdViewSidebar,
} from 'react-icons/md';
import type { ConfigKeysWithUIType } from './defaults';
import type { UiType } from './types';

export type SectionField = {
  label: string;
  description?: string;
} & {
  [T in UiType]: { configKey: ConfigKeysWithUIType<T> };
}[UiType];

export type SectionDefinition = {
  key: string;
  title: string;
  description?: string;
  icon?: IconType;
  fields: SectionField[];
};

export const configSections: SectionDefinition[] = [
  {
    description: '動画検索に関する設定',
    fields: [
      {
        configKey: 'login',
        label: 'ニコニコにログイン',
        description: 'ニコニコ動画にログインすると、ニコニコ動画とNGユーザー・NGワードの同期ができます。',
      },
      {
        configKey: 'channels_only',
        label: 'チャンネルのみ',
        description: 'チャンネルのコメントのみを検索・表示します。',
      },
    ],
    icon: MdSearch,
    key: 'search',
    title: '検索設定',
  },
  {
    description: '検索や再生の自動化を切り替えます',
    fields: [
      {
        configKey: 'auto_search',
        label: '自動検索',
        description: 'ポップアップを開いたときに、自動的に検索を行います。',
      },
      {
        configKey: 'enable_auto_play',
        label: '自動再生',
        description: '作品の視聴開始と同時に、コメントを取得して再生します。',
      },
    ],
    icon: MdAutorenew,
    key: 'automation',
    title: '自動化設定',
  },
  {
    description: 'コメントの表示方法やフィルタリングを調整します．サイドバーとレンダラー両方に影響します',
    fields: [
      {
        configKey: 'comment_timing_offset',
        label: 'コメント表示タイミングオフセット',
        description: 'コメントの表示タイミングを調整します（ミリ秒単位）。',
      },
      {
        configKey: 'comment_area_opacity_percentage',
        label: 'コメントの透明度',
        description: 'コメントの透明度を設定します。',
      },
      {
        configKey: 'nicoarea_scale',
        label: 'コメントの拡大率',
        description: 'コメントの拡大率を設定します。',
      },
      {
        configKey: 'visible_comments',
        label: '表示するコメント',
        description: '表示するコメントを選択します。',
      },
    ],
    icon: MdChat,
    key: 'comments',
    title: 'コメントの設定',
  },
  {
    description: 'コメントサイドバーの表示方法を調整します',
    fields: [
      {
        configKey: 'show_comments_in_list',
        label: 'コメントをリストで表示',
        description: 'サイドバーを展開し、コメントをリスト形式で表示します。',
      },
      {
        configKey: 'show_nicoru_count',
        label: 'ニコる数を表示',
        description: 'コメントのニコる数（いいね）を表示します。',
      },
      {
        configKey: 'enable_auto_scroll',
        label: '自動スクロール',
        description: 'コメントの自動スクロールを有効にします。',
      },
      {
        configKey: 'enable_smooth_scrolling',
        label: 'スムーズスクロール',
        description: 'コメントリストのスクロールをスムーズにします。',
      },
      {
        configKey: 'comment_area_width_px',
        label: 'サイドバーの幅（px）',
        description: 'サイドバーの幅をピクセル単位で設定します。',
      },
      {
        configKey: 'comment_area_font_size_px',
        label: 'コメントのサイズ（px）',
        description: 'コメントのサイズをピクセル単位で設定します。',
      },
    ],
    icon: MdViewSidebar,
    key: 'sidebar',
    title: 'サイドバーの設定',
  },
  {
    description: '動画上にオーバレイ表示されるコメントの描画方法を調整します',
    fields: [
      {
        configKey: 'show_comments_in_niconico_style',
        label: 'ニコニコ風コメント表示',
        description: 'ニコニコ動画風のコメント表示を有効にします。',
      },
      {
        configKey: 'use_new_renderer',
        label: '新しいレンダラーを使用',
        description:
          '新しいレンダラーを使用してコメントを描画します。開発中の機能のため、不具合が発生する可能性があります。',
      },
      {
        configKey: 'comment_renderer_fps',
        label: 'コメントレンダラーのFPS',
        description: 'コメントレンダラーの最大描画フレームレートを設定します。',
      },
    ],
    icon: MdOutlineVideoStable,
    key: 'renderer',
    title: 'コメントレンダラーの設定',
  },
  {
    description: '追加機能のオン/オフを切り替えます',
    fields: [
      {
        configKey: 'enable_addon_disable_new_window',
        label: '新しいウィンドウを無効にする',
        description: '新しいウィンドウでの表示を無効にします。',
      },
    ],
    icon: MdExtension,
    key: 'addons',
    title: 'アドオンの設定',
  },
  {
    description: '作品ページ固有の挙動を設定します',
    fields: [
      {
        configKey: 'enable_addon_add_button_to_play',
        label: '再生ボタンを追加',
        description: '再生ページにボタンを追加します。',
      },
      {
        configKey: 'addon_option_play_in_same_tab',
        label: '同じタブで再生',
        description: '動画を同じタブで再生します。',
      },
    ],
    icon: MdMovie,
    key: 'work',
    title: '作品ページ',
  },
  {
    description: '配色やカラーモードを調整します',
    fields: [
      {
        configKey: 'theme_color_mode',
        label: 'テーマ設定',
        description: 'カラーモードを選択します。',
      },
    ],
    icon: MdPalette,
    key: 'theme',
    title: 'テーマ',
  },
];
