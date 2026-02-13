import { err, ok, type Result, toError } from '@/lib/types';
import { requestMessageResult } from '@/messaging/runtime';
import type { NvComment, SuccessfulResponseData, ThreadsDataResponse, VideoData } from '@/types/api';

export type CommentService = {
  fetchVideoInfo(videoId: string): Promise<Result<SuccessfulResponseData<VideoData>, Error>>;
  fetchComments(nvComment: NvComment): Promise<Result<SuccessfulResponseData<ThreadsDataResponse>, Error>>;
};

type MessageEnvelope<T> = {
  meta?: { status?: number; errorMessage?: string };
  data?: T;
  error?: string;
};

const isEnvelope = <T>(value: unknown): value is MessageEnvelope<T> => typeof value === 'object' && value !== null;

const toResult = <T extends VideoData | ThreadsDataResponse>(
  value: unknown,
  fallback: string
): Result<SuccessfulResponseData<T>, Error> => {
  if (!isEnvelope<SuccessfulResponseData<T>>(value)) return err(new Error(fallback));
  const envelope = value as MessageEnvelope<SuccessfulResponseData<T>>;
  if (envelope.error) return err(new Error(String(envelope.error)));
  const status = envelope.meta?.status;
  if (status && status !== 200) return err(new Error(envelope.meta?.errorMessage ?? fallback));
  return envelope.data !== undefined ? ok(envelope.data) : err(new Error(fallback));
};

export const createCommentService = (): CommentService => {
  const fetchVideoInfo = async (videoId: string): Promise<Result<SuccessfulResponseData<VideoData>, Error>> => {
    const res = await requestMessageResult('video_data', videoId);
    return res.ok ? toResult<VideoData>(res.value, 'Failed to fetch video data') : err(toError(res.error));
  };

  const fetchComments = async (
    nvComment: NvComment
  ): Promise<Result<SuccessfulResponseData<ThreadsDataResponse>, Error>> => {
    const res = await requestMessageResult('threads_data', nvComment);
    return res.ok ? toResult<ThreadsDataResponse>(res.value, 'Failed to fetch comments data') : err(toError(res.error));
  };

  return { fetchComments, fetchVideoInfo };
};
