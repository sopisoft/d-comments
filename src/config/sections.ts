import type { IconType } from "react-icons";
import {
  MdAutorenew,
  MdChat,
  MdExtension,
  MdMovie,
  MdOutlineVideoStable,
  MdPalette,
  MdSearch,
  MdViewSidebar,
} from "react-icons/md";
import type { ConfigKeysWithUIType } from "./defaults";
import type { UiType } from "./types";

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
    key: "search",
    title: "検索設定",
    description: "動画検索に関する設定",
    icon: MdSearch,
    fields: [
      {
        configKey: "login",
        label: "ニコニコにログイン",
        description: "ニコニコ動画にログインすると、ニコニコ動画とNGユーザー・NGワードの同期ができます。",
      },
      {
        configKey: "channels_only",
        label: "チャンネルのみ",
        description: "チャンネルのコメントのみを検索・表示します。",
      },
    ],
  },
  {
    key: "automation",
    title: "自動化設定",
    description: "検索や再生の自動化を切り替えます",
    icon: MdAutorenew,
    fields: [
      {
        configKey: "auto_search",
        label: "自動検索",
        description: "ポップアップを開いたときに、自動的に検索を行います。",
      },
      {
        configKey: "enable_auto_play",
        label: "自動再生",
        description: "作品の視聴開始と同時に、コメントを取得して再生します。",
      },
    ],
  },
  {
    key: "comments",
    title: "コメントの設定",
    description: "コメントの表示方法やフィルタリングを調整します．サイドバーとレンダラー両方に影響します",
    icon: MdChat,
    fields: [
      {
        configKey: "comment_timing_offset",
        label: "コメント表示タイミングオフセット",
        description: "コメントの表示タイミングを調整します（ミリ秒単位）。",
      },
      {
        configKey: "comment_area_opacity_percentage",
        label: "コメントの透明度",
        description: "コメントの透明度を設定します。",
      },
      {
        configKey: "nicoarea_scale",
        label: "コメントの拡大率",
        description: "コメントの拡大率を設定します。",
      },
      {
        configKey: "visible_comments",
        label: "表示するコメント",
        description: "表示するコメントを選択します。",
      },
    ],
  },
  {
    key: "sidebar",
    title: "サイドバーの設定",
    description: "コメントサイドバーの表示方法を調整します",
    icon: MdViewSidebar,
    fields: [
      {
        configKey: "show_comments_in_list",
        label: "コメントをリストで表示",
        description: "サイドバーを展開し、コメントをリスト形式で表示します。",
      },
      {
        configKey: "show_nicoru_count",
        label: "ニコる数を表示",
        description: "コメントのニコる数（いいね）を表示します。",
      },
      {
        configKey: "enable_auto_scroll",
        label: "自動スクロール",
        description: "コメントの自動スクロールを有効にします。",
      },
      {
        configKey: "enable_smooth_scrolling",
        label: "スムーズスクロール",
        description: "コメントリストのスクロールをスムーズにします。",
      },
      {
        configKey: "comment_area_width_px",
        label: "サイドバーの幅（px）",
        description: "サイドバーの幅をピクセル単位で設定します。",
      },
      {
        configKey: "comment_area_font_size_px",
        label: "コメントのサイズ（px）",
        description: "コメントのサイズをピクセル単位で設定します。",
      },
    ],
  },
  {
    key: "renderer",
    title: "コメントレンダラーの設定",
    description: "動画上にオーバレイ表示されるコメントの描画方法を調整します",
    icon: MdOutlineVideoStable,
    fields: [
      {
        configKey: "show_comments_in_niconico_style",
        label: "ニコニコ風コメント表示",
        description: "ニコニコ動画風のコメント表示を有効にします。",
      },
      {
        configKey: "use_new_renderer",
        label: "新しいレンダラーを使用",
        description:
          "新しいレンダラーを使用してコメントを描画します。開発中の機能のため、不具合が発生する可能性があります。",
      },
      {
        configKey: "comment_renderer_fps",
        label: "コメントレンダラーのFPS",
        description: "コメントレンダラーの最大描画フレームレートを設定します。",
      },
    ],
  },
  {
    key: "addons",
    title: "アドオンの設定",
    description: "追加機能のオン/オフを切り替えます",
    icon: MdExtension,
    fields: [
      {
        configKey: "enable_addon_smooth_player",
        label: "スムーズプレイヤーを有効にする",
        description: "プレイヤーのスムーズな再生を有効にします。",
      },
      {
        configKey: "enable_addon_disable_new_window",
        label: "新しいウィンドウを無効にする",
        description: "新しいウィンドウでの表示を無効にします。",
      },
    ],
  },
  {
    key: "work",
    title: "作品ページ",
    description: "作品ページ固有の挙動を設定します",
    icon: MdMovie,
    fields: [
      {
        configKey: "enable_addon_add_button_to_play",
        label: "再生ボタンを追加",
        description: "再生ページにボタンを追加します。",
      },
      {
        configKey: "addon_option_play_in_same_tab",
        label: "同じタブで再生",
        description: "動画を同じタブで再生します。",
      },
    ],
  },
  {
    key: "theme",
    title: "テーマ",
    description: "配色やカラーモードを調整します",
    icon: MdPalette,
    fields: [
      {
        configKey: "theme_color_mode",
        label: "テーマ設定",
        description: "カラーモードを選択します。",
      },
    ],
  },
];
