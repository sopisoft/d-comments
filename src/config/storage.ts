import { type ConfigKey, type ConfigSchema, type ConfigValue, getDefaultValue, getUiOptions } from './defaults';

type StorageLike = {
  area: Pick<Browser.storage.StorageArea, 'get' | 'set'>;
  onChanged: typeof browser.storage.onChanged;
};

const defaultStorage: StorageLike = {
  area: browser.storage.local,
  onChanged: browser.storage.onChanged,
};

const clampNumberValue = <TKey extends ConfigKey>(key: TKey, value: number) => {
  const options = getUiOptions(key) as { min?: number | null; max?: number | null } | undefined;
  const min = options?.min;
  const max = options?.max;
  if ((min === null || min === undefined) && (max === null || max === undefined)) return value;
  const clampedLower = min === null || min === undefined ? value : Math.max(min, value);
  return max === null || max === undefined ? clampedLower : Math.min(max, clampedLower);
};

const resolveStorage = (storage?: Partial<StorageLike>): StorageLike => ({
  area: storage?.area ?? defaultStorage.area,
  onChanged: storage?.onChanged ?? defaultStorage.onChanged,
});

const resolveValue = <TKey extends ConfigKey>(
  key: TKey,
  storedValue: ConfigValue<TKey> | undefined
): ConfigValue<TKey> => storedValue ?? getDefaultValue(key);

export const getConfig = async <TKey extends ConfigKey>(
  key: TKey,
  storageOverride?: Partial<StorageLike>
): Promise<ConfigValue<TKey>> => {
  const storage = resolveStorage(storageOverride);
  const stored = await storage.area.get(key);
  const storedValue = stored[key as keyof ConfigSchema] as ConfigValue<TKey> | undefined;
  return resolveValue(key, storedValue);
};

export const setConfig = async <TKey extends ConfigKey>(
  key: TKey,
  value: ConfigValue<TKey>,
  storageOverride?: Partial<StorageLike>
): Promise<void> => {
  const storage = resolveStorage(storageOverride);
  const nextValue = typeof value === 'number' ? clampNumberValue(key, value) : value;
  await storage.area.set({ [key]: nextValue });
};

export const watchConfig = async <TKey extends ConfigKey>(
  key: TKey,
  callback: (newValue: ConfigValue<TKey>, oldValue: ConfigValue<TKey>) => void,
  storageOverride?: Partial<StorageLike>
): Promise<() => void> => {
  const storage = resolveStorage(storageOverride);
  const listener = (changes: Record<string, Browser.storage.StorageChange>, areaName: string) => {
    if (areaName !== 'local' || !(key in changes)) return;
    const change = changes[key];
    const newVal = change.newValue as ConfigValue<TKey> | undefined;
    const oldVal = change.oldValue as ConfigValue<TKey> | undefined;
    callback(resolveValue(key, newVal), resolveValue(key, oldVal));
  };

  storage.onChanged.addListener(listener);

  return () => storage.onChanged.removeListener(listener);
};

export type NgListKey = 'ng_user_ids' | 'ng_words';
export type NgEntry = {
  value: string;
  enabled: boolean;
  isRegex?: boolean;
};

export const addNgEntry = async (key: NgListKey, rawValue: string): Promise<void> => {
  const value = rawValue.trim();
  if (!value) return;
  const list = ((await getConfig(key)) as NgEntry[] | undefined) ?? [];
  if (list.some((entry) => entry.value === value)) return;
  await setConfig(key, [...list, { enabled: true, value }]);
};
