export {
  addPlayingVideo,
  clearPlayingVideos,
  createCommentManager,
  getComments,
  getPlaying,
  getThreads,
  removePlayingVideo,
} from "./manager";
export { flattenComments, sortComments } from "./selectors";
export type { CommentService } from "./service";
export { createCommentService } from "./service";
export type {
  CommentItemSnapshot,
  CommentManager,
  CommentManagerDependencies,
  CommentThreadSnapshot,
} from "./types";
