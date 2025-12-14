import { useCallback, useMemo } from "react";
import { type ConfigKey, type ConfigValue, getDefaultValue } from "../defaults";
import { setConfig } from "../storage";
import { useConfigValue as useConfigValueInternal } from "./useConfigs";

export type ConfigState<TKey extends ConfigKey> = Readonly<{
  value: ConfigValue<TKey> | null;
  defaultValue: ConfigValue<TKey>;
  currentValue: ConfigValue<TKey>;
  isPending: boolean;
  save: (next: ConfigValue<TKey>) => void;
}>;

export const useConfigValue = <TKey extends ConfigKey>(configKey: TKey): ConfigState<TKey> => {
  const currentValue = useConfigValueInternal(configKey);
  const defaultValue = useMemo(() => getDefaultValue(configKey), [configKey]);
  const save = useCallback((next: ConfigValue<TKey>) => void setConfig(configKey, next), [configKey]);

  return useMemo(
    () => ({
      value: currentValue,
      defaultValue,
      currentValue,
      isPending: false,
      save,
    }),
    [currentValue, defaultValue, save]
  );
};
