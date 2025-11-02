import { useCallback, useEffect, useRef } from "react";

export function useAnimationFrame(
  callback: () => unknown | Promise<unknown>,
  intervalMs = 0
) {
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const callbackRef = useRef(callback);
  const intervalRef = useRef(intervalMs);

  useEffect(() => {
    callbackRef.current = callback;
    intervalRef.current = intervalMs;
  }, [callback, intervalMs]);

  const tick = useCallback((time: number) => {
    if (!runningRef.current) return;

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
    } else if (
      intervalRef.current === 0 ||
      time - lastTimeRef.current >= intervalRef.current
    ) {
      lastTimeRef.current = time;
      callbackRef.current();
    }

    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTimeRef.current = null;
    frameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    runningRef.current = false;
    if (frameRef.current !== undefined) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  useEffect(
    () => () => {
      runningRef.current = false;
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  return { start, pause };
}
