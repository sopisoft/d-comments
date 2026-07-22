type Listener = (...args: unknown[]) => void;

const listeners = new Set<Listener>();
const values: Record<string, unknown> = {};
export type ActiveTab = { id: number; title: string; url: string };
export type ThemeMode = 'light' | 'dark' | 'auto';
let activeTab: ActiveTab = { id: 1, title: 'Storybook', url: 'about:blank' };

const onChanged = {
  addListener(listener: Listener) {
    listeners.add(listener);
  },
  removeListener(listener: Listener) {
    listeners.delete(listener);
  },
};

const local = {
  async get(keys?: string | string[] | Record<string, unknown> | null) {
    if (!keys) return { ...values };
    const requested = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys);
    return Object.fromEntries(requested.map((key) => [key, values[key]]));
  },
  async set(next: Record<string, unknown>) {
    const changes = Object.fromEntries(
      Object.entries(next).map(([key, value]) => {
        const change = { oldValue: values[key], newValue: value };
        values[key] = value;
        return [key, change];
      })
    );
    for (const listener of listeners) listener(changes, 'local');
  },
};

const browserMock = {
  runtime: {
    getManifest: () => ({ name: 'd-comments', version: 'storybook' }),
    getURL: (path: string) => `chrome-extension://storybook${path}`,
    sendMessage: async (message: { type?: string }) => {
      if (message.type === 'playing_video' || message.type === 'add_video' || message.type === 'remove_video') {
        return { ok: true, value: [] };
      }
      return { ok: false, error: new Error('Storybook mock') };
    },
    onMessage: { addListener() {}, removeListener() {} },
  },
  storage: { local, onChanged },
  tabs: {
    query: async () => [activeTab],
    get: async () => activeTab,
    sendMessage: async () => ({ ok: false, error: 'Storybook mock' }),
  },
};

Object.assign(globalThis, { browser: browserMock });

export const configureBrowserMock = (options: { activeTab?: ActiveTab; themeMode?: ThemeMode } = {}): void => {
  activeTab = options.activeTab ?? { id: 1, title: 'Storybook', url: 'about:blank' };
  const themeMode = options.themeMode ?? 'auto';
  const oldValue = values.theme_color_mode;
  values.theme_color_mode = themeMode;
  if (oldValue !== themeMode) {
    const change = { theme_color_mode: { oldValue, newValue: themeMode } };
    for (const listener of listeners) listener(change, 'local');
  }
};
