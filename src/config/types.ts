import type { IconType } from "react-icons";

export type UiType = "switch" | "number" | "slider" | "checkbox" | "checkbox_group" | "segmented_control";

export type UiOptions<TUiType extends UiType> = TUiType extends "slider"
  ? { min: number; max: number; step: number; unit?: string }
  : TUiType extends "number"
    ? { min: number; max: number; step?: number; unit?: string }
    : TUiType extends "segmented_control"
      ? { value: string; label: string; icon?: IconType }[]
      : undefined;

type ConfigScalar = string | number | boolean | null;
export type ConfigValueShape =
  | ConfigScalar
  | ReadonlyArray<ConfigValueShape>
  | { readonly [key: string]: ConfigValueShape };

export type ConfigItem<TValue, TUiType extends UiType> = {
  value: TValue extends boolean ? boolean : TValue;
  ui_type: TUiType;
  ui_options?: UiOptions<TUiType>;
};

export type ConfigDictionary = Record<string, ConfigItem<ConfigValueShape, UiType>>;

export const defineConfigs = <TConfig extends ConfigDictionary>(configs: TConfig): TConfig => configs;
