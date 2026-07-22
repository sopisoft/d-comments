import { useEffect, useRef, useSyncExternalStore } from 'react';
import { type ConfigKey, type ConfigValue, getDefaultValue } from '@/config/defaults';
import { getConfig, setConfig, watchConfig } from '@/config/storage';
import { logger } from '@/lib/logger';

export const useConfig = <TKey extends ConfigKey>(
  configKey: TKey
): Readonly<{
  currentValue: ConfigValue<TKey>;
  defaultValue: ConfigValue<TKey>;
  save: (next: ConfigValue<TKey>) => void;
  isPending: boolean;
}> => {
  const storeRef = useRef<{
    value: ConfigValue<TKey>;
    listeners: Set<() => void>;
  }>({ listeners: new Set(), value: getDefaultValue(configKey) });

  useEffect(() => {
    let active = true;
    const cleanup = watchConfig(configKey, (newValue) => {
      if (!active) return;
      storeRef.current.value = newValue;
      for (const listener of storeRef.current.listeners) listener();
    });

    getConfig(configKey)
      .then((value) => {
        if (!active) return;
        storeRef.current.value = value;
        for (const listener of storeRef.current.listeners) listener();
      })
      .catch(logger.error);

    return () => {
      active = false;
      cleanup?.();
    };
  }, [configKey]);

  const value = useSyncExternalStore(
    (onStoreChange) => {
      storeRef.current.listeners.add(onStoreChange);
      return () => storeRef.current.listeners.delete(onStoreChange);
    },
    () => storeRef.current.value,
    () => getDefaultValue(configKey)
  );

  const defaultValue = getDefaultValue(configKey);
  const save = (next: ConfigValue<TKey>) => setConfig(configKey, next);
  return { currentValue: value, defaultValue, save, isPending: false } as const;
};

export default useConfig;
