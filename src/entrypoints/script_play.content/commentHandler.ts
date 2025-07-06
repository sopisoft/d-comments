import { isError, videoDataToMinimalVideoData } from "@/lib/utils";
import { sendMessage } from "@/messaging";
import type {
  NvComment,
  NvCommentItem,
  SuccessfulResponseData,
  Threads,
  ThreadsDataResponse,
  VideoData,
} from "@/types/nico_api_type";
import type { CommentVideoData } from "@/types/videoComment";

export class CommentHandler {
  playing: CommentVideoData[] = [];
  private threadListeners: ((threads: Threads) => void)[] = [];

  private async fetch_video_info(
    videoId: string
  ): Promise<SuccessfulResponseData<VideoData> | Error> {
    const res = await sendMessage("video_data", videoId);
    if (res.meta.status === 200) {
      return res.data as SuccessfulResponseData<VideoData>;
    }
    return new Error(res.meta.errorMessage || "Failed to fetch video data.");
  }
  private async fetch_comments(
    NvComment: NvComment
  ): Promise<SuccessfulResponseData<ThreadsDataResponse> | Error> {
    const res = await sendMessage("threads_data", NvComment);
    if (res.meta.status === 200) {
      return res.data as SuccessfulResponseData<ThreadsDataResponse>;
    }
    return new Error(res.meta.errorMessage || "Failed to fetch comments data.");
  }

  // private async refresh_comments(video: video): Promise<video | Error> {
  //   const new_thread_key = await sendMessage(
  //     "thread_key",
  //     video.videoData.contentId
  //   );
  //   if (isError(new_thread_key)) {
  //     return new_thread_key;
  //   }
  //   return video;
  // }

  async get(videoId: string): Promise<CommentVideoData | Error> {
    // const video = this.playing.find((v) => v.videoData.contentId === videoId);
    // if (video) {
    //   return await this.refresh_comments(video);
    // }

    const video_info = await this.fetch_video_info(videoId);
    if (isError(video_info)) return video_info;

    const threads = await this.fetch_comments(
      video_info.response.comment.nvComment
    );
    if (isError(threads)) return threads;

    const item: CommentVideoData = {
      date: Date.now(),
      videoData: videoDataToMinimalVideoData(video_info),
      threads: threads.threads,
    };

    return item;
  }

  getPlaying(): CommentVideoData[] {
    return this.playing;
  }

  get_threads(): Threads {
    return this.playing.flatMap((v) => v.threads);
  }

  async add_playing_video(video: CommentVideoData) {
    if (!this.playing.find((v) => v.videoData === video.videoData)) {
      const videoInfo = await this.fetch_video_info(video.videoData.contentId);
      if (isError(videoInfo)) return;
      const t = await this.fetch_comments(videoInfo.response.comment.nvComment);
      if (isError(t)) return;

      video.date = Date.now();
      video.threads = t.threads;
      this.playing.push(video);
    }
  }

  async remove_playing_video(videoId: string) {
    this.playing = this.playing.filter(
      (v) => v.videoData.contentId !== videoId
    );
  }

  async merge_threads(threads_list: Threads[]): Promise<Threads | Error> {
    const merged: Threads = [];
    for (const threads of threads_list) {
      for (const thread of threads) {
        const item = merged.find((t) => t.fork === thread.fork);
        if (item) {
          item.commentCount += thread.commentCount;
          thread.comments.map((v) => item.comments.push(v));
        } else {
          merged.push({
            id: -1,
            fork: thread.fork,
            comments: thread.comments,
            commentCount: thread.commentCount,
          });
        }
      }
    }
    return merged;
  }

  async sort_nv_comment(list: NvCommentItem[]): Promise<NvCommentItem[]> {
    const { length } = list;
    let gap = Math.floor(length / 2);
    while (gap > 0) {
      for (let i = gap; i < length; i++) {
        const temp = list[i];
        let j = i;
        while (j >= gap && list[j - gap].vposMs > temp.vposMs) {
          list[j] = list[j - gap];
          j -= gap;
        }
        list[j] = temp;
      }
      gap = Math.floor(gap / 2);
    }

    return list;
  }

  async flatten_comments(
    threads: Threads,
    forks: string[]
  ): Promise<NvCommentItem[]> {
    return threads
      .filter((thread) => forks.includes(thread.fork))
      .flatMap((thread) => thread.comments);
  }

  onPlayingVideosChange(callback: (threads: Threads) => void): () => void {
    this.threadListeners.push(callback);
    const unsubscribe = () => {
      this.threadListeners = this.threadListeners.filter(
        (cb) => cb !== callback
      );
    };
    return unsubscribe;
  }
}
