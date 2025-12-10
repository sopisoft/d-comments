import { err, ok, type Result, toError } from "@/lib/types";
import { requestMessageResult } from "@/messaging/";
import type { NvComment, SuccessfulResponseData, ThreadsDataResponse, VideoData } from "@/types/api";

export type CommentService = {
  fetchVideoInfo(videoId: string): Promise<Result<SuccessfulResponseData<VideoData>, Error>>;
  fetchComments(nvComment: NvComment): Promise<Result<SuccessfulResponseData<ThreadsDataResponse>, Error>>;
};

type MessageEnvelope<T> = {
  meta?: { status?: number; errorMessage?: string };
  data?: T;
  error?: string;
};

const hasStatus = <T>(value: unknown): value is MessageEnvelope<T> => typeof value === "object" && value !== null;

const toResult = <T extends VideoData | ThreadsDataResponse>(
  value: unknown,
  fallback: string
): Result<SuccessfulResponseData<T>, Error> => {
  if (!hasStatus<SuccessfulResponseData<T>>(value)) return err(new Error(fallback));

  if (typeof value === "object" && "error" in value && value.error) return err(new Error(String(value.error)));

  const envelope = value as MessageEnvelope<SuccessfulResponseData<T>>;
  if (envelope.meta?.status === 200 && envelope.data !== undefined) return ok(envelope.data);
  if (envelope.meta?.errorMessage) return err(new Error(envelope.meta.errorMessage));
  if (envelope.data !== undefined) return ok(envelope.data);
  return err(new Error(fallback));
};

export const createCommentService = (): CommentService => {
  const fetchVideoInfo = async (videoId: string): Promise<Result<SuccessfulResponseData<VideoData>, Error>> => {
    const res = await requestMessageResult("video_data", videoId);
    return res.ok ? toResult<VideoData>(res.value, "Failed to fetch video data") : err(toError(res.error));
  };

  const fetchComments = async (
    nvComment: NvComment
  ): Promise<Result<SuccessfulResponseData<ThreadsDataResponse>, Error>> => {
    const res = await requestMessageResult("threads_data", nvComment);
    return res.ok ? toResult<ThreadsDataResponse>(res.value, "Failed to fetch comments data") : err(toError(res.error));
  };

  return { fetchVideoInfo, fetchComments };
};
