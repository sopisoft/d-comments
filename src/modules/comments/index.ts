export {
  addPlayingVideo,
  clearPlayingVideos,
  createCommentManager,
  flattenComments,
  getComments,
  getPlaying,
  getThreads,
  removePlayingVideo,
  sortComments,
} from "./manager";
export type { CommentService } from "./service";
export { createCommentService } from "./service";
export type {
  CommentItemSnapshot,
  CommentManager,
  CommentManagerDependencies,
  CommentThreadSnapshot,
} from "./types";
