import { createContext } from "react";

export type Context = {
  mode: "list" | "nico";
  setMode: (mode: Context["mode"]) => void;
  videoId: VideoId | undefined;
  setVideoId: (videoId: VideoId) => void;
  workId: string | undefined;
  setWorkId: (workId: string) => void;
  threads: Threads | undefined;
  setThreads: (threads: Threads) => void;
  nvComment: nv_comment | undefined;
  setNvComment: (nvComment: nv_comment) => void;
};

export const ctx = createContext<Context>({} as Context);
