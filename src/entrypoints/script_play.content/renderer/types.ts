import type { Threads } from "@/types/api";

export type RendererController = {
  setThreads(threads: Threads): Threads;
  dispose(): boolean;
};
