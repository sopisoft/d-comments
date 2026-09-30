import { useMemo } from 'react';
import type { Threads } from '@/types/api';
import { SidebarComments } from './components/SidebarComments';
import { ResizeHandle } from './components/SidebarResizeHandle';
import { createSidebarStyles, SidebarProvider, useSidebar, useVideoElement } from './context/SidebarContext';
import { useCommentList } from './hooks/useCommentList';

export function CommentSidebar({
  threads,
  onRefresh,
}: {
  threads: Threads;
  onRefresh: () => void;
}): React.ReactElement {
  return (
    <SidebarProvider>
      <SidebarContent threads={threads} onRefresh={onRefresh} />
    </SidebarProvider>
  );
}

function SidebarContent({
  threads,
  onRefresh,
}: {
  threads: Threads;
  onRefresh: () => void;
}): React.ReactElement {
  const { video } = useVideoElement();
  const config = useSidebar();
  const styles = useMemo(() => createSidebarStyles(config), [config]);
  const comments = useCommentList(threads);
  const root: React.CSSProperties = { ...styles.root };
  if (comments.length === 0) root.width = 0;
  return (
    <div style={root}>
      <ResizeHandle config={config} />
      <SidebarComments threads={threads} config={config} video={video} styles={styles} onRefresh={onRefresh} />
    </div>
  );
}
