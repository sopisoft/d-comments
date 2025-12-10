import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { type ConfigKey, type ConfigValue, getDefaultValue } from "@/config/defaults";
import { getConfigs as fetchConfigs, watchConfig } from "@/config/storage";

type ConfigSelection<TKeys extends readonly ConfigKey[]> = {
  [K in TKeys[number]]: ConfigValue<K>;
};

const createDefaults = <TKeys extends readonly ConfigKey[]>(keys: TKeys): ConfigSelection<TKeys> =>
  Object.fromEntries(keys.map((key) => [key, getDefaultValue(key)])) as ConfigSelection<TKeys>;

export const useConfigs = <const TKeys extends readonly ConfigKey[]>(keys: TKeys) => {
  const keysRef = useRef(keys);
  const [values, setValues] = useState<ConfigSelection<TKeys>>(() => createDefaults(keys));
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    let active = true;
    const cleanups: (() => void)[] = [];

    fetchConfigs(keysRef.current).then((initial) => {
      if (!active) return;
      setValues(initial);
      setPending(false);
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

  return { values, isPending } as const;
};

export const useConfigValue = <TKey extends ConfigKey>(configKey: TKey) => {
  const storeRef = useRef<{
    value: ConfigValue<TKey>;
    listeners: Set<() => void>;
  }>({ value: getDefaultValue(configKey), listeners: new Set() });

  useEffect(() => {
    let active = true;
    let cleanup: (() => void) | undefined;

    fetchConfigs([configKey]).then((result) => {
      if (!active) return;
      storeRef.current.value = result[configKey];
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

  return value;
};

export default useConfigs;
