import { useCallback, useMemo, useRef, useState } from "react";
import { defaultConfigs } from "@/config/defaults";
import type { Threads } from "@/types/api";
import { SidebarComments } from "./components/SidebarComments";
import {
  createSidebarStyles,
  type SidebarConfig,
  SidebarProvider,
  useSidebar,
  useVideoElement,
} from "./context/SidebarContext";

function ResizeHandle({ config }: { config: SidebarConfig }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const { ui_options } = defaultConfigs.comment_area_width_px;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startX.current = e.clientX;
      startWidth.current = config.width;
      const onMove = (ev: MouseEvent) => config.setWidth(startWidth.current + startX.current - ev.clientX);
      const onUp = () => {
        setIsDragging(false);
        config.saveWidth();
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [config]
  );

  return (
    <div
      role="slider"
      aria-orientation="horizontal"
      aria-label="サイドバー幅の調整"
      aria-valuemin={ui_options.min}
      aria-valuemax={ui_options.max}
      aria-valuenow={config.width}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        cursor: "ew-resize",
        backgroundColor: isDragging || isHover ? config.alpha(0.15) : "transparent",
        zIndex: 10,
        transition: "background-color 150ms",
      }}
    />
  );
}

function SidebarContent({ threads }: { threads: Threads }) {
  const { video } = useVideoElement();
  const config = useSidebar();
  const styles = useMemo(() => createSidebarStyles(config), [config]);

  return (
    <div style={styles.root}>
      <ResizeHandle config={config} />
      <SidebarComments threads={threads} config={config} video={video} styles={styles} />
    </div>
  );
}

export function CommentSidebar({ threads }: { threads: Threads }) {
  return (
    <SidebarProvider>
      <SidebarContent threads={threads} />
    </SidebarProvider>
  );
}
