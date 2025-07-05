import { useCallback, useEffect, useRef } from "react";

export default function useAnimationFrame(
  cb: (timestamp: number) => void,
  fps: number
) {
  const frame = useRef(0);
  const last = useRef(0);
  const init = useRef(0);

  const animate = useCallback(
    (now: number) => {
      if (!init.current) {
        init.current = now;
      }
      const delta = now - last.current;
      if (delta < 1000 / fps) {
        frame.current = requestAnimationFrame(animate);
        return;
      }
      last.current = now;
      cb(now);
      frame.current = requestAnimationFrame(animate);
    },
    [cb, fps]
  );

  const start = useCallback(() => {
    frame.current = requestAnimationFrame(animate);
  }, [animate]);

  const pause = useCallback(() => {
    cancelAnimationFrame(frame.current);
  }, []);

  useEffect(() => {
    start();
    return () => pause();
  }, [start, pause]);

  return { start, pause };
}
