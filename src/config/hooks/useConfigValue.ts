import { useEffect, useState } from "react";
import {
  type ConfigKey,
  type ConfigValue,
  getConfig,
  getDefaultValue,
  setConfig,
} from "@/config/";

export type ConfigState<TKey extends ConfigKey> = {
  value: ConfigValue<TKey> | null;
  defaultValue: ConfigValue<TKey>;
  isPending: boolean;
  save: (next: ConfigValue<TKey>) => void;
};

export const useConfigValue = <TKey extends ConfigKey>(
  configKey: TKey
): ConfigState<TKey> => {
  const [value, setValue] = useState<ConfigValue<TKey> | null>(null);

  useEffect(() => {
    getConfig(configKey, setValue);
  }, [configKey]);

  const defaultValue = getDefaultValue(configKey);

  const save = (next: ConfigValue<TKey>) => {
    void setConfig(configKey, next);
    setValue(next);
  };

  return {
    value,
    defaultValue,
    isPending: value === null,
    save,
  };
};
