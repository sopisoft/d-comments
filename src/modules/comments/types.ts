import type { NvCommentItem, Threads } from '@/types/api';
import type { CommentVideoData } from '@/types/comments';
import type { CommentService } from './service';

export type CommentManagerDependencies = {
  service?: CommentService;
  now?: () => number;
};

export type CommentManager = {
  service: CommentService;
  now: () => number;
  playing: readonly CommentVideoData[];
};

export type CommentThreadSnapshot = Threads[number];

export type CommentItemSnapshot = NvCommentItem;
