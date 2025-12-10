import type { ConfigKey, ConfigSchema, ConfigValue } from "./defaults";
import { getDefaultValue, getRawDefaultConfig } from "./defaults";
import type { ConfigItem, ConfigValueShape, UiType } from "./types";

type BrowserStorageArea = Pick<Browser.storage.StorageArea, "get" | "set">;
type BrowserStorageEvent = typeof browser.storage.onChanged;

type StorageLike = {
  area: BrowserStorageArea;
  onChanged: BrowserStorageEvent;
};

type ConfigSelection<TKeys extends readonly ConfigKey[]> = {
  [K in TKeys[number]]: ConfigValue<K>;
};

type StoredValues = Partial<Record<ConfigKey, ConfigValue<ConfigKey>>>;
type StorageChanges = Partial<Record<ConfigKey, Browser.storage.StorageChange>>;
type ConfigChange<TKeys extends readonly ConfigKey[]> = Readonly<{
  current: ConfigSelection<TKeys>;
  changed: Partial<ConfigSelection<TKeys>>;
  previous: Partial<ConfigSelection<TKeys>>;
}>;

const defaultStorage: StorageLike = {
  area: browser.storage.local,
  onChanged: browser.storage.onChanged,
};

const clampNumberValue = <TKey extends ConfigKey>(key: TKey, value: number) => {
  const { ui_options: options } = getRawDefaultConfig(key) as ConfigItem<ConfigValueShape, UiType>;
  if (!options) return value;

  const { min, max } = options;
  if (min === undefined && max === undefined) return value;

  const clampedLower = min !== undefined ? Math.max(min, value) : value;
  return max !== undefined ? Math.min(max, clampedLower) : clampedLower;
};

const resolveStorage = (storage?: Partial<StorageLike>): StorageLike => ({
  area: storage?.area ?? defaultStorage.area,
  onChanged: storage?.onChanged ?? defaultStorage.onChanged,
});

const resolveValue = <TKey extends ConfigKey>(
  key: TKey,
  storedValue: ConfigValue<TKey> | undefined
): ConfigValue<TKey> => storedValue ?? getDefaultValue(key);

const pickStoredValues = <const TKeys extends readonly ConfigKey[]>(
  keys: TKeys,
  stored: StoredValues
): ConfigSelection<TKeys> =>
  Object.fromEntries(keys.map((key) => [key, resolveValue(key, stored[key])])) as ConfigSelection<TKeys>;

const pickChangedValues = <const TKeys extends readonly ConfigKey[]>(
  keys: TKeys,
  changes: StorageChanges,
  kind: "newValue" | "oldValue"
): Partial<ConfigSelection<TKeys>> =>
  keys.reduce(
    (acc, key) => {
      const value = changes[key]?.[kind] as ConfigValue<typeof key> | undefined;
      if (value !== undefined) (acc as Record<ConfigKey, ConfigValue<ConfigKey>>)[key] = resolveValue(key, value);
      return acc;
    },
    {} as Partial<ConfigSelection<TKeys>>
  );

export const getConfig = async <TKey extends ConfigKey>(
  key: TKey,
  storageOverride?: Partial<StorageLike>
): Promise<ConfigValue<TKey>> => {
  const storage = resolveStorage(storageOverride);
  const stored = await storage.area.get(key);
  const storedValue = stored[key as keyof ConfigSchema];
  return resolveValue(key, storedValue);
};

export const getConfigs = async <const TKeys extends readonly ConfigKey[]>(
  keys: TKeys,
  storageOverride?: Partial<StorageLike>
): Promise<ConfigSelection<TKeys>> => {
  const storage = resolveStorage(storageOverride);
  const requestedKeys = [...keys];
  const stored = await storage.area.get(requestedKeys);
  return pickStoredValues(requestedKeys, stored as StoredValues);
};

export const setConfig = async <TKey extends ConfigKey>(
  key: TKey,
  value: ConfigValue<TKey>,
  storageOverride?: Partial<StorageLike>
): Promise<void> => {
  const storage = resolveStorage(storageOverride);
  const nextValue = typeof value === "number" ? clampNumberValue(key, value) : value;
  await storage.area.set({ [key]: nextValue });
};

export const watchConfig = async <TKey extends ConfigKey>(
  key: TKey,
  callback: (newValue: ConfigValue<TKey>, oldValue: ConfigValue<TKey>) => void,
  storageOverride?: Partial<StorageLike>
): Promise<() => void> => {
  const storage = resolveStorage(storageOverride);
  const listener: Parameters<BrowserStorageEvent["addListener"]>[0] = (changes, areaName) => {
    if (areaName !== "local" || !(key in changes)) return;
    const change = changes[key];
    callback(resolveValue(key, change.newValue), resolveValue(key, change.oldValue));
  };

  storage.onChanged.addListener(listener);

  return () => storage.onChanged.removeListener(listener);
};

export const watchConfigs = async <TKeys extends readonly ConfigKey[]>(
  keys: TKeys,
  callback: (change: ConfigChange<TKeys>) => void,
  storageOverride?: Partial<StorageLike>
): Promise<() => void> => {
  const storage = resolveStorage(storageOverride);
  let current: ConfigSelection<TKeys> | null = null;
  const listener: Parameters<BrowserStorageEvent["addListener"]>[0] = (changes, areaName) => {
    if (areaName !== "local") return;
    const matchedKeys = keys.filter((k) => k in changes) as TKeys[number][];
    if (matchedKeys.length === 0 || !current) return;
    const changeRecord = changes as StorageChanges;
    const changed = pickChangedValues(matchedKeys, changeRecord, "newValue");
    if (Object.keys(changed).length === 0) return;
    const previous = pickChangedValues(matchedKeys, changeRecord, "oldValue");
    current = { ...current, ...changed } as ConfigSelection<TKeys>;
    callback({ current, changed, previous });
  };
  storage.onChanged.addListener(listener);

  const requestedKeys = [...keys];
  const stored = await storage.area.get(requestedKeys as string[]);
  const initial = pickStoredValues(requestedKeys, stored as StoredValues);
  current = initial;
  callback({ current: initial, changed: initial, previous: {} });

  return () => storage.onChanged.removeListener(listener);
};

export type NgListKey = "ng_user_ids" | "ng_words";
export type NgEntry = {
  value: string;
  enabled: boolean;
  isRegex?: boolean;
};

export const addNgEntry = async (key: NgListKey, rawValue: string) => {
  const value = rawValue.trim();
  if (!value) return;
  const list = ((await getConfig(key)) as NgEntry[] | undefined) ?? [];
  if (list.some((entry) => entry.value === value)) return;
  await setConfig(key, [...list, { value, enabled: true }]);
};
