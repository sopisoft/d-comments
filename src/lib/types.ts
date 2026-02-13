import { logger } from './logger';

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T, E = never>(value: T): Result<T, E> => ({
  ok: true,
  value,
});

export const err = <T = never, E = Error>(error: E): Result<T, E> => ({
  error,
  ok: false,
});

export const andThenAsync = async <T, U, E>(
  res: Result<T, E>,
  fn: (value: T) => Promise<Result<U, E>>
): Promise<Result<U, E>> => (res.ok ? fn(res.value) : res);

export const toError = (reason: unknown): Error =>
  reason instanceof Error ? reason : new Error(String(reason ?? 'Unknown'));

export const unwrap = <T>(res: Result<T, Error>, contextMsg?: string): T | undefined => {
  if (res.ok) return res.value;
  logger.error(contextMsg ?? 'Operation failed', res.error.message);
  return undefined;
};
