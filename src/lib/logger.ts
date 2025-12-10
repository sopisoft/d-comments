const PREFIX = "[d-comments]";
const isDev = process.env.NODE_ENV !== "production";
const log =
  (fn: (...a: unknown[]) => void, devOnly: boolean) =>
  (...args: unknown[]) => {
    if (!devOnly || isDev) fn(PREFIX, ...args);
  };

export const logger = {
  debug: log(console.debug, true),
  info: log(console.info, true),
  warn: log(console.warn, false),
  error: log(console.error, false),
};
