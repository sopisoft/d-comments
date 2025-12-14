import { MdDarkMode, MdLightMode, MdSettings } from "react-icons/md";
import type { ConfigItem, UiOptions, UiType } from "./types";
import { defineConfigs } from "./types";

type ConfigValueConstraint<TValue> = TValue extends boolean ? boolean : TValue;

type ConfigWithUiType<TValue, TUiType extends UiType> = ConfigItem<ConfigValueConstraint<TValue>, TUiType>;

export const defaultConfigs = defineConfigs({
  /**
   * テーマの設定
   */
  theme_color_mode: {
    value: "auto",
    ui_type: "segmented_control",
    ui_options: [
      { value: "light", label: "Light", icon: MdLightMode },
      { value: "dark", label: "Dark", icon: MdDarkMode },
      { value: "auto", label: "Auto", icon: MdSettings },
    ],
  },

  /**
   * 共通の設定
   */
  login: {
    value: false,
    ui_type: "switch",
  },
  enable_auto_play: {
    value: true,
    ui_type: "switch",
  },
  auto_search: {
    value: false,
    ui_type: "switch",
  },
  enable_auto_scroll: {
    value: true,
    ui_type: "switch",
  },

  /**
   * サイドバーの設定
   */

  show_comments_in_list: {
    value: true,
    ui_type: "switch",
  },
  comment_area_width_px: {
    value: 600,
    ui_type: "number",
    ui_options: { min: 100, max: 2000, step: 1 } satisfies UiOptions<"number">,
  },
  comment_area_font_size_px: {
    value: 16,
    ui_type: "number",
    ui_options: { min: 2, max: 40 } satisfies UiOptions<"number">,
  },
  comment_area_opacity_percentage: {
    value: 95,
    ui_type: "slider",
    ui_options: {
      min: 0,
      max: 100,
      step: 5,
      unit: "%",
    } satisfies UiOptions<"slider">,
  },

  nicoarea_scale: {
    value: 100,
    ui_type: "slider",
    ui_options: {
      min: 0,
      max: 100,
      step: 10,
      unit: "%",
    } satisfies UiOptions<"slider">,
  },

  show_nicoru_count: {
    value: true,
    ui_type: "switch",
  },
  show_comments_in_niconico_style: {
    value: true,
    ui_type: "switch",
  },
  visible_comments: {
    value: [
      { key: "owner", value: "投稿者コメント", enabled: false },
      { key: "main", value: "一般コメント", enabled: true },
      { key: "easy", value: "かんたんコメント", enabled: false },
    ],
    ui_type: "checkbox_group",
  } satisfies ConfigWithUiType<Array<{ key: string; value: string; enabled: boolean }>, "checkbox_group">,
  channels_only: {
    value: true,
    ui_type: "switch",
  },
  enable_smooth_scrolling: {
    value: false,
    ui_type: "switch",
  },
  comment_timing_offset: {
    value: 0,
    ui_type: "number",
    ui_options: {
      min: -100000,
      max: 100000,
      step: 10,
    } satisfies UiOptions<"number">,
  },
  comment_renderer_fps: {
    value: 60,
    ui_type: "slider",
    ui_options: {
      min: 15,
      max: 120,
      step: 5,
      unit: "fps",
    } satisfies UiOptions<"slider">,
  },
  use_new_renderer: {
    value: false,
    ui_type: "switch",
  },

  /**
   * アドオンの設定
   */
  enable_addon_smooth_player: {
    value: true,
    ui_type: "switch",
  },
  enable_addon_disable_new_window: {
    value: false,
    ui_type: "switch",
  },

  /**
   * ci_pc 作品ページ
   */
  enable_addon_add_button_to_play: {
    value: true,
    ui_type: "switch",
  },
  addon_option_play_in_same_tab: {
    value: true,
    ui_type: "switch",
  },
  ng_user_ids: {
    value: [] as Array<{ value: string; enabled: boolean }>,
    ui_type: "checkbox_group",
  },
  ng_words: {
    value: [] as Array<{ value: string; enabled: boolean; isRegex?: boolean }>,
    ui_type: "checkbox_group",
  },
});

export type ConfigSchema = typeof defaultConfigs;
export type ConfigKey = keyof ConfigSchema;
export type ConfigValue<TKey extends ConfigKey> = ConfigSchema[TKey]["value"] extends boolean
  ? boolean
  : ConfigSchema[TKey]["value"];
export type ConfigKeysWithUIType<TUiType extends UiType> = {
  [Key in keyof ConfigSchema]: ConfigSchema[Key]["ui_type"] extends TUiType ? Key : never;
}[keyof ConfigSchema];

export const getRawDefaultConfig = <TKey extends ConfigKey>(key: TKey) => defaultConfigs[key];

export function getUiOptions<TKey extends ConfigKey>(key: TKey): UiOptions<UiType> | undefined {
  return (
    defaultConfigs[key] as unknown as {
      ui_options?: UiOptions<UiType>;
    }
  ).ui_options;
}

export function getUiType<TKey extends ConfigKey>(key: TKey): UiType {
  return (defaultConfigs[key] as unknown as { ui_type: ConfigSchema[TKey]["ui_type"] }).ui_type;
}

export const getDefaultValue = <TKey extends ConfigKey>(key: TKey) =>
  getRawDefaultConfig(key).value as ConfigValue<TKey>;
