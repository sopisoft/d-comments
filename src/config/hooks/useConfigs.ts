import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { type ConfigKey, type ConfigValue, getDefaultValue } from '@/config/defaults';
import { getConfig, setConfig, watchConfig } from '@/config/storage';

type ConfigSelection<TKeys extends readonly ConfigKey[]> = {
  [K in TKeys[number]]: ConfigValue<K>;
};

const createDefaults = <TKeys extends readonly ConfigKey[]>(keys: TKeys): ConfigSelection<TKeys> =>
  Object.fromEntries(keys.map((key) => [key, getDefaultValue(key)])) as ConfigSelection<TKeys>;

export const useConfigs = <const TKeys extends readonly ConfigKey[]>(
  keys: TKeys
): Readonly<{ values: ConfigSelection<TKeys> }> => {
  const keysRef = useRef(keys);
  const [values, setValues] = useState<ConfigSelection<TKeys>>(() => createDefaults(keys));

  useEffect(() => {
    let active = true;
    const cleanups: (() => void)[] = [];

    const load = async () => {
      const initial = createDefaults(keysRef.current) as ConfigSelection<TKeys>;
      for (const key of keysRef.current)
        (initial as Record<ConfigKey, ConfigValue<ConfigKey>>)[key] = await getConfig(key);
      return initial;
    };
    load().then((initial) => {
      if (!active) return;
      setValues(initial);
    });

    for (const key of keysRef.current) {
      watchConfig(key, (newValue) => {
        if (!active) return;
        setValues((prev) => ({ ...prev, [key]: newValue }));
      }).then((cleanup) => {
        if (active) cleanups.push(cleanup);
        else cleanup();
      });
    }

    return () => {
      active = false;
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return { values } as const;
};

export const useConfigValue = <TKey extends ConfigKey>(
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
    let cleanup: (() => void) | undefined;

    getConfig(configKey).then((value) => {
      if (!active) return;
      storeRef.current.value = value;
      for (const listener of storeRef.current.listeners) listener();
    });

    watchConfig(configKey, (newValue) => {
      if (!active) return;
      storeRef.current.value = newValue;
      for (const listener of storeRef.current.listeners) listener();
    }).then((c) => {
      if (active) cleanup = c;
      else c();
    });

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

export default useConfigs;
