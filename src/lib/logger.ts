const PREFIX = '[d-comments]';
const isDev = process.env.NODE_ENV !== 'production';
const log =
  (fn: (...a: unknown[]) => void, devOnly: boolean) =>
  (...args: unknown[]) => {
    if (!devOnly || isDev) fn(PREFIX, ...args);
  };

// oxlint-disable no-console
export const logger = {
  debug: log(console.debug, true),
  error: log(console.error, false),
  info: log(console.info, true),
  warn: log(console.warn, false),
};
