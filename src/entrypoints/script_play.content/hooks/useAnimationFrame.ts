import { useCallback, useEffect, useRef } from 'react';

export function useAnimationFrame(callback: () => void, intervalMs = 0): { pause: () => void; start: () => void } {
  const saved = useRef(callback);
  const rafRef = useRef<number | null>(null);
  const running = useRef(false);
  const nextTick = useRef(0);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  const loop = useCallback(
    (time: number) => {
      if (!running.current) return;
      if (!intervalMs || time >= nextTick.current) {
        nextTick.current = intervalMs ? time + intervalMs : time;
        saved.current();
      }
      rafRef.current = requestAnimationFrame(loop);
    },
    [intervalMs]
  );

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    nextTick.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const pause = useCallback(() => {
    running.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => pause, [pause]);
  return { pause, start };
}
