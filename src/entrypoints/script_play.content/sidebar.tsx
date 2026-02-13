import { useMemo } from 'react';
import type { Threads } from '@/types/api';
import { SidebarComments } from './components/SidebarComments';
import { ResizeHandle } from './components/SidebarResizeHandle';
import { createSidebarStyles, SidebarProvider, useSidebar, useVideoElement } from './context/SidebarContext';
import { useCommentList } from './hooks/useCommentList';

export function CommentSidebar({ threads }: { threads: Threads }): React.ReactElement {
  const { video } = useVideoElement();
  const config = useSidebar();
  const styles = useMemo(() => createSidebarStyles(config), [config]);
  const comments = useCommentList(threads);
  const root: React.CSSProperties = { ...styles.root };
  if (comments.length === 0) root.width = 0;
  return (
    <SidebarProvider>
      <div style={root}>
        <ResizeHandle config={config} />
        <SidebarComments threads={threads} config={config} video={video} styles={styles} />
      </div>
    </SidebarProvider>
  );
}
