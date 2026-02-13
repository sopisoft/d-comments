import type { IconType } from 'react-icons';

export type UiType = 'switch' | 'number' | 'slider' | 'checkbox_group' | 'segmented_control';
export type UiOptions =
  | { min: number; max: number; step: number; unit?: string }
  | { min: number; max: number; step?: number; unit?: string }
  | { value: string; label: string; icon?: IconType }[]
  | undefined;

type ConfigScalar = string | number | boolean | null;
export type ConfigValueShape =
  | ConfigScalar
  | ReadonlyArray<ConfigValueShape>
  | { readonly [key: string]: ConfigValueShape };

export type ConfigItem = { ui_type: UiType; value: ConfigValueShape; ui_options?: UiOptions };

export type ConfigDictionary = Record<string, ConfigItem>;

export const defineConfigs = <TConfig extends ConfigDictionary>(configs: TConfig): TConfig => configs;
