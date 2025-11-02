import type { ConfigKey, ConfigSchema, ConfigValue } from "./defaults";
import { getDefaultValue, getRawDefaultConfig } from "./defaults";
import type { ConfigItem, UiType } from "./types";

type BrowserStorageArea = Pick<Browser.storage.StorageArea, "get" | "set">;

type BrowserStorageEvent = typeof browser.storage.onChanged;

type StorageLike = {
  area: BrowserStorageArea;
  onChanged: BrowserStorageEvent;
};

const defaultStorage: StorageLike = {
  area: browser.storage.local,
  onChanged: browser.storage.onChanged,
};

const clampNumberValue = <TKey extends ConfigKey>(key: TKey, value: number) => {
  const rawConfig = getRawDefaultConfig(key) as ConfigItem<number, UiType>;
  const options = rawConfig.ui_options as ConfigItem<
    number,
    UiType
  >["ui_options"];
  if (!options) return value;

  const { min, max } = options as { min?: number; max?: number };
  if (min === undefined && max === undefined) return value;

  const clampedLower = min !== undefined ? Math.max(min, value) : value;
  return max !== undefined ? Math.min(max, clampedLower) : clampedLower;
};

const resolveStorage = (storage?: Partial<StorageLike>): StorageLike => ({
  area: storage?.area ?? defaultStorage.area,
  onChanged: storage?.onChanged ?? defaultStorage.onChanged,
});

export const getConfig = async <TKey extends ConfigKey>(
  key: TKey,
  callback?: (value: ConfigValue<TKey>) => void,
  storageOverride?: Partial<StorageLike>
): Promise<ConfigValue<TKey>> => {
  const storage = resolveStorage(storageOverride);
  const stored = await storage.area.get(key);
  const storedValue = stored[key as keyof ConfigSchema];
  const defaultValue = getDefaultValue(key);
  const value = (storedValue ?? defaultValue) as ConfigValue<TKey>;
  if (callback) callback(value);
  return value;
};

export const setConfig = async <TKey extends ConfigKey>(
  key: TKey,
  value: ConfigValue<TKey>,
  storageOverride?: Partial<StorageLike>
): Promise<void> => {
  const storage = resolveStorage(storageOverride);
  const nextValue =
    typeof value === "number" ? clampNumberValue(key, value) : value;
  await storage.area.set({ [key]: nextValue });
};

export const watchConfig = async <TKey extends ConfigKey>(
  key: TKey,
  callback: (newValue: ConfigValue<TKey>, oldValue: ConfigValue<TKey>) => void,
  storageOverride?: Partial<StorageLike>
): Promise<() => void> => {
  const storage = resolveStorage(storageOverride);
  const listener: Parameters<BrowserStorageEvent["addListener"]>[0] = (
    changes,
    areaName
  ) => {
    if (areaName !== "local" || !(key in changes)) {
      return;
    }
    const change = changes[key];
    callback(
      change.newValue as ConfigValue<TKey>,
      change.oldValue as ConfigValue<TKey>
    );
  };

  storage.onChanged.addListener(listener);

  return () => storage.onChanged.removeListener(listener);
};
