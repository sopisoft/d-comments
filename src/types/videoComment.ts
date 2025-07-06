import type { MinimalVideoData } from "../entrypoints/popup/types/fetch";
import type { Threads } from "./nico_api_type";

export type CommentVideoData = {
  date: number;
  videoData: MinimalVideoData;
  threads: Threads;
};
