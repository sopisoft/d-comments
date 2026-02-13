import { MdDarkMode, MdLightMode, MdSettings } from 'react-icons/md';
import type { UiOptions, UiType } from './types';
import { defineConfigs } from './types';

export const defaultConfigs = defineConfigs({
  /**
   * テーマの設定
   */
  theme_color_mode: {
    ui_options: [
      { value: 'light', label: 'Light', icon: MdLightMode },
      { value: 'dark', label: 'Dark', icon: MdDarkMode },
      { value: 'auto', label: 'Auto', icon: MdSettings },
    ],
    ui_type: 'segmented_control',
    value: 'auto',
  },

  /**
   * 共通の設定
   */
  login: {
    ui_type: 'switch',
    value: false,
  },
  enable_auto_play: {
    ui_type: 'switch',
    value: true,
  },
  auto_search: {
    ui_type: 'switch',
    value: false,
  },
  enable_auto_scroll: {
    ui_type: 'switch',
    value: true,
  },

  /**
   * サイドバーの設定
   */

  show_comments_in_list: {
    ui_type: 'switch',
    value: true,
  },
  comment_area_width_px: {
    ui_options: { min: 100, max: 2000, step: 1 } satisfies UiOptions,
    ui_type: 'number',
    value: 600,
  },
  comment_area_font_size_px: {
    ui_options: { min: 2, max: 40 } satisfies UiOptions,
    ui_type: 'number',
    value: 16,
  },
  comment_area_opacity_percentage: {
    ui_options: {
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
    } satisfies UiOptions,
    ui_type: 'slider',
    value: 95,
  },

  nicoarea_scale: {
    ui_options: {
      min: 0,
      max: 100,
      step: 10,
      unit: '%',
    } satisfies UiOptions,
    ui_type: 'slider',
    value: 100,
  },

  show_nicoru_count: {
    ui_type: 'switch',
    value: true,
  },
  show_comments_in_niconico_style: {
    ui_type: 'switch',
    value: true,
  },
  visible_comments: {
    ui_type: 'checkbox_group',
    value: [
      { key: 'owner', value: '投稿者コメント', enabled: false },
      { key: 'main', value: '一般コメント', enabled: true },
      { key: 'easy', value: 'かんたんコメント', enabled: false },
    ],
  },
  channels_only: {
    ui_type: 'switch',
    value: true,
  },
  enable_smooth_scrolling: {
    ui_type: 'switch',
    value: false,
  },
  comment_timing_offset: {
    ui_options: {
      min: -100000,
      max: 100000,
      step: 10,
    } satisfies UiOptions,
    ui_type: 'number',
    value: 0,
  },
  comment_renderer_fps: {
    ui_options: {
      min: 15,
      max: 120,
      step: 5,
      unit: 'fps',
    } satisfies UiOptions,
    ui_type: 'slider',
    value: 60,
  },
  use_new_renderer: {
    ui_type: 'switch',
    value: false,
  },

  /**
   * アドオンの設定
   */
  enable_addon_disable_new_window: {
    ui_type: 'switch',
    value: false,
  },

  /**
   * Ci_pc 作品ページ
   */
  enable_addon_add_button_to_play: {
    ui_type: 'switch',
    value: true,
  },
  addon_option_play_in_same_tab: {
    ui_type: 'switch',
    value: true,
  },
  ng_user_ids: {
    ui_type: 'checkbox_group',
    value: [] as Array<{ value: string; enabled: boolean }>,
  },
  ng_words: {
    ui_type: 'checkbox_group',
    value: [] as Array<{ value: string; enabled: boolean; isRegex?: boolean }>,
  },
});

export type ConfigSchema = typeof defaultConfigs;
export type ConfigKey = keyof ConfigSchema;
export type ConfigValue<TKey extends ConfigKey> = ConfigSchema[TKey]['value'] extends boolean
  ? boolean
  : ConfigSchema[TKey]['value'];
export type ConfigKeysWithUIType<TUiType extends UiType> = {
  [Key in keyof ConfigSchema]: ConfigSchema[Key]['ui_type'] extends TUiType ? Key : never;
}[keyof ConfigSchema];

export const getRawDefaultConfig = <TKey extends ConfigKey>(key: TKey): ConfigSchema[TKey] => defaultConfigs[key];

export function getUiOptions<TKey extends ConfigKey>(key: TKey): unknown {
  return (defaultConfigs[key] as { ui_options?: unknown }).ui_options;
}

export function getUiType<TKey extends ConfigKey>(key: TKey): ConfigSchema[TKey]['ui_type'] {
  return defaultConfigs[key].ui_type;
}

export const getDefaultValue = <TKey extends ConfigKey>(key: TKey): ConfigValue<TKey> =>
  getRawDefaultConfig(key).value as ConfigValue<TKey>;
