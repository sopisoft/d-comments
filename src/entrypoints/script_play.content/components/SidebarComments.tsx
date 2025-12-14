import { Group, Popover, Text } from "@mantine/core";
import type { CSSProperties } from "react";
import { memo, useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import type { NvCommentItem, Threads } from "@/types/api";
import type { SidebarConfig } from "../context/SidebarContext";
import { useCommentList } from "../hooks/useCommentList";
import { useSidebarAutoScroll } from "../hooks/useSidebarAutoScroll";
import { CommentCardView } from "./CommentCardView";
import { CommentDetailView } from "./CommentDetailView";
import type { ThemeProps } from "./types";

let activeId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  for (const l of listeners) l();
};
const activeCommentStore = {
  getSnapshot: () => activeId,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  toggle: (id: string) => {
    activeId = activeId === id ? null : id;
    notify();
  },
  clear: () => {
    if (activeId !== null) {
      activeId = null;
      notify();
    }
  },
};

const useIsActive = (id: string) =>
  useSyncExternalStore(
    activeCommentStore.subscribe,
    () => activeCommentStore.getSnapshot() === id,
    () => false
  );

const useHasActiveComment = () =>
  useSyncExternalStore(
    activeCommentStore.subscribe,
    () => activeCommentStore.getSnapshot() !== null,
    () => false
  );

const CommentCard = memo<{ comment: NvCommentItem; theme: ThemeProps }>(
  ({ comment, theme }) => {
    const [hovered, setHovered] = useState(false);
    const isActive = useIsActive(comment.id);
    const handleClick = useCallback(() => activeCommentStore.toggle(comment.id), [comment.id]);
    return (
      <CommentCardView
        comment={comment}
        theme={theme}
        isActive={isActive}
        hovered={hovered}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      />
    );
  },
  (prev, next) => prev.comment.id === next.comment.id && prev.theme === next.theme
);

const CommentRow = memo<{
  comment: NvCommentItem;
  theme: ThemeProps;
  popoverWidth: number;
  onSeek: () => void;
}>(
  ({ comment, theme, popoverWidth, onSeek }) => {
    const isActive = useIsActive(comment.id);
    const handleToggle = useCallback(() => activeCommentStore.toggle(comment.id), [comment.id]);
    return (
      <Popover
        opened={isActive}
        onChange={(o) => !o && handleToggle()}
        position="bottom"
        shadow="md"
        withArrow
        withinPortal={false}
        offset={4}
        width={popoverWidth}
      >
        <Popover.Target>
          <div>
            <CommentCard comment={comment} theme={theme} />
          </div>
        </Popover.Target>
        <Popover.Dropdown
          style={{
            backgroundColor: theme.palette.bg.base,
            borderColor: theme.alpha(0.2),
            padding: 12,
          }}
        >
          <CommentDetailView comment={comment} theme={theme} onSeek={onSeek} onClose={handleToggle} />
        </Popover.Dropdown>
      </Popover>
    );
  },
  (prev, next) =>
    prev.comment.id === next.comment.id && prev.theme === next.theme && prev.popoverWidth === next.popoverWidth
);

export type SidebarCommentsProps = {
  threads: Threads;
  config: SidebarConfig;
  video: HTMLVideoElement | null;
  styles: Record<string, CSSProperties>;
};

export const SidebarComments = memo<SidebarCommentsProps>(({ threads, config, video, styles }) => {
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const comments = useCommentList(threads);
  const hasActive = useHasActiveComment();
  const theme = useMemo<ThemeProps>(
    () => ({
      palette: config.palette,
      showNicoru: config.showNicoru,
      alpha: config.alpha,
      fontSizePx: config.fontSize,
    }),
    [config.palette, config.showNicoru, config.alpha, config.fontSize]
  );
  const popoverWidth = config.width * 0.8;
  const { notifyHover } = useSidebarAutoScroll({
    video,
    config,
    comments,
    virtuosoRef,
    isPopoverOpen: hasActive,
  });
  const seek = useCallback(
    (vposMs: number) => {
      if (video) video.currentTime = vposMs / 1000;
    },
    [video]
  );

  const itemContent = useCallback(
    (_: number, item: NvCommentItem) => (
      <CommentRow
        key={item.id}
        comment={item}
        theme={theme}
        popoverWidth={popoverWidth}
        onSeek={() => seek(item.vposMs)}
      />
    ),
    [theme, popoverWidth, seek]
  );

  return (
    <>
      <header style={styles.header}>
        <Group justify="space-between" align="center">
          <Text size="sm" fw={600}>
            コメント: {comments.length}
          </Text>
        </Group>
      </header>
      <div style={styles.main}>
        <section
          aria-label="コメントリスト"
          style={styles.list}
          onMouseEnter={() => notifyHover(true)}
          onMouseLeave={() => notifyHover(false)}
        >
          <Virtuoso
            ref={virtuosoRef}
            data={comments}
            itemContent={itemContent}
            style={{ height: "100%" }}
            increaseViewportBy={{ top: 100, bottom: 100 }}
          />
        </section>
      </div>
    </>
  );
});
