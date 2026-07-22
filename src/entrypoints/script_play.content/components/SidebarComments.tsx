import { Group, Popover, Text } from '@mantine/core';
import { type CSSProperties, memo } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { ui } from '@/config/theme';
import type { NvCommentItem, Threads } from '@/types/api';
import type { SidebarConfig } from '../context/SidebarContext';
import { useCommentList } from '../hooks/useCommentList';
import { useSidebarAutoScroll } from '../hooks/useSidebarAutoScroll';
import { CommentCardView } from './CommentCardView';
import { CommentDetailView } from './CommentDetailView';
import type { ThemeProps } from './types';

let activeId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  for (const l of listeners) l();
};
const activeCommentStore = {
  clear: () => {
    if (activeId !== null) {
      activeId = null;
      notify();
    }
  },
  getSnapshot: () => activeId,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  toggle: (id: string) => {
    activeId = activeId === id ? null : id;
    notify();
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

const CommentRow = memo(
  ({
    comment,
    theme,
    onSeek,
    showDivider,
    popoverWidth,
  }: {
    comment: NvCommentItem;
    theme: ThemeProps;
    onSeek: () => void;
    showDivider: boolean;
    popoverWidth: number;
  }): React.ReactElement => {
    const [hovered, setHovered] = useState(false);
    const isActive = useIsActive(comment.id);
    const handleToggle = useCallback(() => activeCommentStore.toggle(comment.id), [comment.id]);
    return (
      <Popover
        opened={isActive}
        onChange={(o) => !o && handleToggle()}
        position="bottom"
        shadow="md"
        withArrow
        withRoles={false}
        offset={4}
        middlewares={{ flip: true, shift: { padding: 0 } }}
        preventPositionChangeWhenVisible={false}
        transitionProps={{ duration: 0 }}
        withinPortal={false}
        floatingStrategy="fixed"
        width={popoverWidth}
      >
        <Popover.Target>
          <div style={{ width: '100%' }}>
            <CommentCardView
              comment={comment}
              theme={theme}
              isActive={isActive}
              hovered={hovered}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={handleToggle}
              showDivider={showDivider}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown
          role="dialog"
          aria-label="コメント詳細"
          style={{
            backgroundColor: theme.palette.bg.base,
            border: `1px solid ${theme.alpha(0.4)}`,
            boxShadow: `0 8px 20px ${theme.alpha(0.24)}`,
            padding: ui.space.sm,
          }}
        >
          <CommentDetailView comment={comment} theme={theme} onSeek={onSeek} onClose={handleToggle} />
        </Popover.Dropdown>
      </Popover>
    );
  }
);

export type SidebarCommentsProps = {
  threads: Threads;
  config: SidebarConfig;
  video: HTMLVideoElement | null;
  styles: Record<string, CSSProperties>;
};

export const SidebarComments = ({ threads, config, video, styles }: SidebarCommentsProps): React.ReactElement => {
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const comments = useCommentList(threads);
  const hasActive = useHasActiveComment();
  const theme = useMemo<ThemeProps>(
    () => ({
      alpha: config.alpha,
      fontSizePx: config.fontSize,
      palette: config.palette,
      showNicoru: config.showNicoru,
    }),
    [config.palette, config.showNicoru, config.alpha, config.fontSize]
  );
  const { notifyHover } = useSidebarAutoScroll({ comments, config, isPopoverOpen: hasActive, video, virtuosoRef });
  const sectionRef = useRef<HTMLElement | null>(null);
  const prevHoverRef = useRef(false);
  useEffect(() => {
    prevHoverRef.current = false;
    const checkHover = () => {
      const el = sectionRef.current;
      if (!el) return;
      const hovered = el.matches(':hover');
      if (hovered !== prevHoverRef.current) {
        prevHoverRef.current = hovered;
        notifyHover(hovered);
      }
    };

    const id = setInterval(checkHover, 150);
    checkHover();
    return () => clearInterval(id);
  }, [notifyHover]);
  const seek = useCallback(
    (vposMs: number) => {
      if (video) video.currentTime = vposMs / 1000;
    },
    [video]
  );

  const itemContent = useCallback(
    (index: number, item: NvCommentItem) => (
      <CommentRow
        comment={item}
        theme={theme}
        onSeek={() => seek(item.vposMs)}
        showDivider={index < comments.length - 1}
        popoverWidth={Math.max(config.width - ui.space.lg * 2, 160)}
      />
    ),
    [theme, seek, comments.length, config.width]
  );

  return (
    <>
      <header style={styles.header}>
        <Group justify="space-between" align="center">
          <Text size="sm" fw={ui.font.weight.semibold}>
            コメント: {comments.length}
          </Text>
        </Group>
      </header>
      <div style={styles.main}>
        <section ref={sectionRef} style={styles.list}>
          <Virtuoso
            ref={virtuosoRef}
            data={comments}
            itemContent={itemContent}
            style={{ height: '100%' }}
            increaseViewportBy={{ bottom: 100, top: 100 }}
          />
        </section>
      </div>
    </>
  );
};
