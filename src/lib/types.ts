export type Branded<T, B> = T & { readonly _brand: B };

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T, E = never>(value: T): Result<T, E> => ({
  ok: true,
  value,
});
export const err = <T = never, E = Error>(error: E): Result<T, E> => ({
  ok: false,
  error,
});
