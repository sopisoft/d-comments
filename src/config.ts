type UITypes =
  | "switch"
  | "number"
  | "slider"
  | "color"
  | "checkbox"
  | "checkbox_group";

type UIOptions<T = UITypes> = T extends "slider"
  ? { min: number; max: number; step: number; unit?: string }
  : T extends "number"
    ? { min: number; max: number; step?: number; unit?: string }
    : undefined;

type ConfigItem<TValue, UITypes> = {
  value: TValue extends boolean ? boolean : TValue; // number と boolean を区別する
  ui_type: UITypes;
  ui_options?: UIOptions<UITypes>;
};

function defineConfigs<T extends Record<string, ConfigItem<unknown, UITypes>>>(
  configs: T
): T {
  return configs;
}

const defaultConfigs = defineConfigs({
  /**
   * 共通の設定
   */
  login: {
    value: false,
    ui_type: "switch",
  },
  enable_auto_play: {
    value: false,
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

  comment_area_width_px: {
    value: 600,
    ui_type: "number",
    ui_options: <UIOptions<"number">>{ min: 100, max: 2000, step: 10 },
  },
  comment_area_font_size_px: {
    value: 16,
    ui_type: "number",
    ui_options: <UIOptions<"number">>{ min: 2, max: 40 },
  },
  comment_area_background_color: {
    value: "#FFFFFF",
    ui_type: "color",
  },
  comment_area_opacity_percentage: {
    value: 95,
    ui_type: "slider",
    ui_options: <UIOptions<"slider">>{ min: 0, max: 100, step: 5, unit: "%" },
  },
  comment_text_color: {
    value: "#000000",
    ui_type: "color",
  },

  nicoarea_scale: {
    value: 100,
    ui_type: "slider",
    ui_options: <UIOptions<"slider">>{ min: 0, max: 100, step: 10, unit: "%" },
  },

  show_comments_in_list: {
    value: true,
    ui_type: "checkbox",
  },
  show_nicoru_count: {
    value: true,
    ui_type: "checkbox",
  },
  show_comments_in_niconico_style: {
    value: true,
    ui_type: "checkbox",
  },
  visible_comments: {
    value: [
      {
        key: "owner",
        value: "投稿者コメント",
        enabled: false,
      },
      {
        key: "main",
        value: "一般コメント",
        enabled: true,
      },
      {
        key: "easy",
        value: "かんたんコメント",
        enabled: false,
      },
    ],
    ui_type: "checkbox_group",
  },
  channels_only: {
    value: true,
    ui_type: "checkbox",
  },
  comment_timing_offset: {
    value: 0,
    ui_type: "number",
    ui_options: <UIOptions<"number">>{ min: -100000, max: 100000, step: 100 },
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
});

export type Config = typeof defaultConfigs;
export type ConfigKey = keyof Config;
export type ConfigKeysWithUIType<T extends UITypes> = {
  [K in keyof Config]: Config[K]["ui_type"] extends T ? K : never;
}[keyof Config];
export type ConfigValue<T extends ConfigKey> = Config[T]["value"];

export function getRawDefaultConfig<T extends ConfigKey>(key: T): Config[T] {
  return defaultConfigs[key];
}
export function getDefaultValue<T extends ConfigKey>(key: T): ConfigValue<T> {
  return getRawDefaultConfig(key).value;
}
export function getUIType<T extends ConfigKey>(key: T): Config[T]["ui_type"] {
  return getRawDefaultConfig(key).ui_type;
}

/**
 * 設定を取得し、Callback を呼ぶ
 * @param key 設定キー
 * @param callback 設定値を取得した後に呼ばれる関数
 * @returns 設定値
 * @example
 * getConfig("YOUR_CONFIG_KEY", (value) => {
 *   console.log(`YOUR_CONFIG_VALUE is ${value}`);
 * });
 */
export async function getConfig<T extends ConfigKey>(
  key: T,
  callback?: (value: ConfigValue<T>) => void
): Promise<ConfigValue<T>> {
  const storedValue = (await browser.storage.local.get([key]))[key];
  const defaultValue = getDefaultValue(key);
  const value = (storedValue ?? defaultValue) as ConfigValue<T>;
  if (callback !== undefined) callback(value);
  return value;
}

/**
 * 設定を保存する
 * @param key 設定キー
 * @param value 設定値
 * @example
 * setConfig("YOUR_CONFIG_KEY", "YOUR_CONFIG_VALUE");
 */
export async function setConfig<T extends ConfigKey>(
  key: T,
  value: ConfigValue<T>
) {
  if (typeof value === "number") {
    const rawConfig = getRawDefaultConfig(key);
    const { min, max } =
      "ui_options" in rawConfig
        ? rawConfig.ui_options
        : { min: undefined, max: undefined };
    const v = Math.max(
      min ?? Number.NEGATIVE_INFINITY,
      Math.min(max ?? Number.POSITIVE_INFINITY, value)
    );
    browser.storage.local.set({ [key]: v });
  } else {
    browser.storage.local.set({ [key]: value });
  }
}

/**
 * 設定の変更を監視する
 * @param key 設定キー
 * @param callback 設定値が変更された時に呼ばれる関数
 * @example
 * watchConfig("YOUR_CONFIG_KEY", (newValue, oldValue) => {
 *  console.log(`YOUR_CONFIG_VALUE has changed from ${oldValue} to ${newValue}`);
 * });
 */
export async function watchConfig<T extends ConfigKey>(
  key: T,
  callback: (newValue: ConfigValue<T>, oldValue: ConfigValue<T>) => void
) {
  browser.storage.onChanged.addListener((changes, _areaName) => {
    if (key in changes) {
      const { newValue, oldValue } = changes[key];
      callback(newValue as ConfigValue<T>, oldValue as ConfigValue<T>);
    }
  });
}
