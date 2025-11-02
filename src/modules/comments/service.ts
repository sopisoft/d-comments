import { err, ok, type Result } from "@/lib/types";
import { sendMessage } from "@/messaging/";
import type {
  NvComment,
  SuccessfulResponseData,
  ThreadsDataResponse,
  VideoData,
} from "@/types/api";

export type CommentService = {
  fetchVideoInfo(
    videoId: string
  ): Promise<Result<SuccessfulResponseData<VideoData>, Error>>;
  fetchComments(
    nvComment: NvComment
  ): Promise<Result<SuccessfulResponseData<ThreadsDataResponse>, Error>>;
};

const toError = (input: unknown, message: string) => {
  if (!input) return new Error(message);
  if (typeof input === "object" && input !== null) {
    return new Error(JSON.stringify(input));
  }
  return new Error(String(input));
};

const wrap = async <T>(
  promise: Promise<unknown>,
  message: string
): Promise<Result<T, Error>> => {
  try {
    const res = await promise;
    if (!res || typeof res !== "object") return err(toError(res, message));
    const record = res as {
      error?: unknown;
      meta?: { status?: number; errorMessage?: string };
      data?: unknown;
    };
    if (record.error !== undefined) return err(toError(record.error, message));
    if (record.meta?.status === 200 && record.data !== undefined) {
      return ok(record.data as T);
    }
    return err(new Error(record.meta?.errorMessage ?? message));
  } catch (error: unknown) {
    return err(
      new Error(
        `${message}: ${error instanceof Error ? error.message : String(error)}`
      )
    );
  }
};

const buildCommentService = (): CommentService => {
  const fetchVideoInfo = async (
    videoId: string
  ): Promise<Result<SuccessfulResponseData<VideoData>, Error>> =>
    wrap<SuccessfulResponseData<VideoData>>(
      sendMessage("video_data", videoId),
      "Failed to fetch video data"
    );

  const fetchComments = async (
    nvComment: NvComment
  ): Promise<Result<SuccessfulResponseData<ThreadsDataResponse>, Error>> =>
    wrap<SuccessfulResponseData<ThreadsDataResponse>>(
      sendMessage("threads_data", nvComment),
      "Failed to fetch comments data"
    );

  return { fetchVideoInfo, fetchComments };
};

export const createCommentService = buildCommentService;
