import { getConfig } from "@/config";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

/**
 * List of NvComments
 */
export function Scroll(comments: nv_comment[]) {
  const parentRef = useRef<HTMLUListElement>(null);

  const virtualizer = useVirtualizer({
    count: comments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
  });

  function loop() {}

  window.requestAnimationFrame(loop);

  return (
    <ul ref={parentRef}>
      {virtualizer.getVirtualItems().map((virtualItem) => (
        <li>{comments[virtualItem.index].body}</li>
      ))}
    </ul>
  );
}

export default Scroll;
