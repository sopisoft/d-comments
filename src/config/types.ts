export type UiType =
  | "switch"
  | "number"
  | "slider"
  | "color"
  | "checkbox"
  | "checkbox_group";

export type UiOptions<TUiType extends UiType> = TUiType extends "slider"
  ? { min: number; max: number; step: number; unit?: string }
  : TUiType extends "number"
    ? { min: number; max: number; step?: number; unit?: string }
    : undefined;

export type ConfigItem<TValue, TUiType extends UiType> = {
  value: TValue extends boolean ? boolean : TValue;
  ui_type: TUiType;
  ui_options?: UiOptions<TUiType>;
};

export type ConfigDictionary = Record<string, ConfigItem<unknown, UiType>>;

export const defineConfigs = <TConfig extends ConfigDictionary>(
  configs: TConfig
): TConfig => configs;
