type LoggerLike = {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

const defaultConsoleLogger: LoggerLike = {
  debug: (...args: unknown[]) => console.debug("[d-comments]", ...args),
  info: (...args: unknown[]) => console.info("[d-comments]", ...args),
  warn: (...args: unknown[]) => console.warn("[d-comments]", ...args),
  error: (...args: unknown[]) => console.error("[d-comments]", ...args),
};

const activeLogger: LoggerLike = defaultConsoleLogger;

export const logger = {
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") activeLogger.debug(...args);
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") activeLogger.info(...args);
  },
  warn: (...args: unknown[]) => {
    activeLogger.warn(...args);
  },
  error: (...args: unknown[]) => {
    activeLogger.error(...args);
  },
};
