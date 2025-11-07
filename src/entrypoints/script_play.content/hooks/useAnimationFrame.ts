import { useCallback, useEffect, useRef } from "react";

export function useAnimationFrame(callback: () => void, intervalMs = 0) {
  const saved = useRef(callback);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const nextTickRef = useRef(0);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  const loop = useCallback(
    (time: number) => {
      if (!runningRef.current) return;

      if (!intervalMs || time >= nextTickRef.current) {
        nextTickRef.current = intervalMs ? time + intervalMs : time;
        saved.current();
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [intervalMs]
  );

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    nextTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const pause = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => pause, [pause]);

  return { start, pause };
}
