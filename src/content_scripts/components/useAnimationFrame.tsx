/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useEffect, useRef } from "react";

function useAnimationFrame(
  fn: <T extends unknown[]>(...args: T) => void,
  interval_ms: number
): {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
} {
  const animationFrameRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const previousTimeRef = useRef<number>();
  const intervalRef = useRef<number>(interval_ms);
  const fnRef = useRef<typeof fn>();
  fnRef.current = fn;

  function step(timestamp: number) {
    if (previousTimeRef.current === undefined)
      previousTimeRef.current = timestamp;

    const elapsed = timestamp - previousTimeRef.current;
    if (elapsed > intervalRef.current) {
      previousTimeRef.current = timestamp;
      if (fnRef.current) fnRef.current();
    }
    animationFrameRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  function start() {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(step);
    }
  }

  function pause() {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }

  function resume() {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(step);
    }
  }

  function stop() {
    pause();
    previousTimeRef.current = undefined;
  }

  return { start, pause, resume, stop };
}

export default useAnimationFrame;
