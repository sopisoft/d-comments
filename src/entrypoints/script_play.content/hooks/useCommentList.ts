import { useEffect, useState } from 'react';
import { getConfig } from '@/config/storage';
import { flattenComments, sortComments } from '@/modules/comments/manager';
import type { NvCommentItem, Threads } from '@/types/api';

export function useCommentList(threads: Threads): NvCommentItem[] {
  const [comments, setComments] = useState<NvCommentItem[]>([]);

  useEffect(() => {
    let active = true;
    getConfig('visible_comments').then((config) => {
      if (!active) return;
      const visibleForks = config.filter((f) => f.enabled).map((f) => f.key);
      setComments(sortComments(flattenComments(threads, visibleForks)));
    });
    return () => {
      active = false;
    };
  }, [threads]);

  return comments;
}
