import type { ConfigKeysWithUIType } from "@/config/";

export type SwitchFieldConfig = {
  id: string;
  kind: "switch";
  configKey: ConfigKeysWithUIType<"switch">;
  label: string;
  description: string;
};

export type CheckboxFieldConfig = {
  id: string;
  kind: "checkbox";
  configKey: ConfigKeysWithUIType<"checkbox">;
  label: string;
  description: string;
};

export type NumberFieldConfig = {
  id: string;
  kind: "number";
  configKey: ConfigKeysWithUIType<"number">;
  label: string;
  description: string;
};

export type SliderFieldConfig = {
  id: string;
  kind: "slider";
  configKey: ConfigKeysWithUIType<"slider">;
  label: string;
  description: string;
};

export type ColorFieldConfig = {
  id: string;
  kind: "color";
  configKey: ConfigKeysWithUIType<"color">;
  label: string;
  description: string;
};

export type CheckboxGroupFieldConfig = {
  id: string;
  kind: "checkbox_group";
  configKey: ConfigKeysWithUIType<"checkbox_group">;
  label: string;
  description: string;
};

export type SectionField =
  | SwitchFieldConfig
  | CheckboxFieldConfig
  | NumberFieldConfig
  | SliderFieldConfig
  | ColorFieldConfig
  | CheckboxGroupFieldConfig;

export type SectionDefinition = {
  key: string;
  title: string;
  fields: SectionField[];
};

export const configSections: SectionDefinition[] = [
  {
    key: "general",
    title: "一般の設定",
    fields: [
      {
        id: "login",
        kind: "switch",
        configKey: "login",
        label: "ニコニコにログイン",
        description:
          "ニコニコ動画にログインすると、ニコニコ動画とNGユーザー・NGワードの同期ができます。",
      },
    ],
  },
  {
    key: "automation",
    title: "自動化設定",
    fields: [
      {
        id: "auto_search",
        kind: "switch",
        configKey: "auto_search",
        label: "自動検索",
        description: "ポップアップを開いたときに、自動的に検索を行います。",
      },
      {
        id: "enable_auto_play",
        kind: "switch",
        configKey: "enable_auto_play",
        label: "自動再生",
        description: "作品の視聴開始と同時に、コメントを取得して再生します。",
      },
    ],
  },
  {
    key: "sidebar",
    title: "サイドバーの設定",
    fields: [
      {
        id: "enable_auto_scroll",
        kind: "switch",
        configKey: "enable_auto_scroll",
        label: "自動スクロール",
        description: "コメントの自動スクロールを有効にします。",
      },
      {
        id: "comment_area_width_px",
        kind: "number",
        configKey: "comment_area_width_px",
        label: "サイドバーの幅（px）",
        description: "サイドバーの幅をピクセル単位で設定します。",
      },
      {
        id: "comment_area_background_color",
        kind: "color",
        configKey: "comment_area_background_color",
        label: "サイドバーの背景色",
        description: "サイドバーの背景色を設定します。",
      },
      {
        id: "comment_text_color",
        kind: "color",
        configKey: "comment_text_color",
        label: "コメントの色",
        description: "コメントのテキスト色を設定します。",
      },
      {
        id: "comment_area_font_size_px",
        kind: "number",
        configKey: "comment_area_font_size_px",
        label: "コメントのサイズ（px）",
        description: "コメントのサイズをピクセル単位で設定します。",
      },
      {
        id: "comment_area_opacity_percentage",
        kind: "slider",
        configKey: "comment_area_opacity_percentage",
        label: "コメントの透明度",
        description: "コメントの透明度を設定します。",
      },
      {
        id: "nicoarea_scale",
        kind: "slider",
        configKey: "nicoarea_scale",
        label: "コメントの拡大率",
        description: "コメントの拡大率を設定します。",
      },
      {
        id: "visible_comments",
        kind: "checkbox_group",
        configKey: "visible_comments",
        label: "表示するコメント",
        description: "表示するコメントを選択します。",
      },
    ],
  },
  {
    key: "comment",
    title: "コメントの設定",
    fields: [
      {
        id: "show_comments_in_list",
        kind: "checkbox",
        configKey: "show_comments_in_list",
        label: "コメントをリストで表示",
        description: "コメントをリスト形式で表示します。",
      },
      {
        id: "show_comments_in_niconico_style",
        kind: "checkbox",
        configKey: "show_comments_in_niconico_style",
        label: "ニコニコ風コメント表示",
        description: "ニコニコ動画風のコメント表示を有効にします。",
      },
      {
        id: "show_nicoru_count",
        kind: "checkbox",
        configKey: "show_nicoru_count",
        label: "ニコる数を表示",
        description: "コメントのニコる数（いいね）を表示します。",
      },
      {
        id: "channels_only",
        kind: "checkbox",
        configKey: "channels_only",
        label: "チャンネルのみ",
        description: "チャンネルのコメントのみを検索・表示します。",
      },
      {
        id: "comment_timing_offset",
        kind: "number",
        configKey: "comment_timing_offset",
        label: "コメント表示タイミングオフセット",
        description: "コメントの表示タイミングを調整します（ミリ秒単位）。",
      },
      {
        id: "comment_renderer_fps",
        kind: "slider",
        configKey: "comment_renderer_fps",
        label: "コメントレンダラーのFPS",
        description: "コメントレンダラーの最大描画フレームレートを設定します。",
      },
      {
        id: "enable_smooth_scrolling",
        kind: "checkbox",
        configKey: "enable_smooth_scrolling",
        label: "スムーズスクロール",
        description: "コメントリストのスクロールをスムーズにします。",
      },
      {
        id: "use_new_renderer",
        kind: "switch",
        configKey: "use_new_renderer",
        label: "新しいレンダラーを使用",
        description:
          "新しいレンダラーを使用してコメントを描画します。開発中の機能のため、不具合が発生する可能性があります。",
      },
    ],
  },
  {
    key: "addons",
    title: "アドオンの設定",
    fields: [
      {
        id: "enable_addon_smooth_player",
        kind: "switch",
        configKey: "enable_addon_smooth_player",
        label: "スムーズプレイヤーを有効にする",
        description: "プレイヤーのスムーズな再生を有効にします。",
      },
      {
        id: "enable_addon_disable_new_window",
        kind: "switch",
        configKey: "enable_addon_disable_new_window",
        label: "新しいウィンドウを無効にする",
        description: "新しいウィンドウでの表示を無効にします。",
      },
    ],
  },
  {
    key: "work",
    title: "作品ページ",
    fields: [
      {
        id: "enable_addon_add_button_to_play",
        kind: "switch",
        configKey: "enable_addon_add_button_to_play",
        label: "再生ボタンを追加",
        description: "再生ページにボタンを追加します。",
      },
      {
        id: "addon_option_play_in_same_tab",
        kind: "switch",
        configKey: "addon_option_play_in_same_tab",
        label: "同じタブで再生",
        description: "動画を同じタブで再生します。",
      },
    ],
  },
];
