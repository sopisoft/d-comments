import { useEffect, useState } from "react";
import { getConfig } from "@/config/";
import { flattenComments, sortComments } from "@/modules/comments";
import type { NvCommentItem, Threads } from "@/types/api";

export function useCommentList(threads: Threads) {
  const [commentsList, setCommentsList] = useState<NvCommentItem[]>([]);

  useEffect(() => {
    let active = true;
    getConfig("visible_comments").then((config) => {
      if (!active) return;
      const visibleForks = config
        .filter((fork) => fork.enabled)
        .map((fork) => fork.key);
      const flattened = flattenComments(threads, visibleForks);
      const sorted = sortComments(flattened);
      setCommentsList(sorted);
    });

    return () => {
      active = false;
    };
  }, [threads]);

  return commentsList;
}
