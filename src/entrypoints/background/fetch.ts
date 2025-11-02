import { getConfig } from "@/config/";
import { logger } from "@/lib/logger";
import type {
  NvComment,
  Owner,
  ThreadKeyResponse,
  ThreadsDataResponse,
  VideoData,
} from "@/types/api";

async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let message = `HTTP error: ${res.status}`;
    try {
      const data = await res.json();
      message = data?.meta?.errorMessage || data?.error || message;
    } catch {}
    throw new Error(message);
  }
  const data = await res.json();
  logger.debug("api fetched:", input);
  logger.debug("api response status:", res.status);
  return data as T;
}

export async function videoData(videoId: string): Promise<VideoData> {
  const url = `https://www.nicovideo.jp/watch/${videoId}?responseType=json`;
  const login = await getConfig("login");
  const req: RequestInit = {
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
  };
  if (login) {
    const cookie = await browser.cookies.get({
      url: "https://www.nicovideo.jp",
      name: "user_session",
    });
    if (cookie) {
      req.credentials = "include";
      req.headers = {
        ...(req.headers || {}),
        Cookie: `user_session=${cookie.value}`,
      };
    }
  }
  return apiFetch<VideoData>(url, req);
}

export async function threadsData(
  nvComment: NvComment
): Promise<ThreadsDataResponse> {
  const { server, threadKey, params } = nvComment;
  const endpoint = `${server}/v1/threads`;
  const req: RequestInit = {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "x-client-os-type": "others",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
    method: "POST",
    body: JSON.stringify({
      threadKey: threadKey,
      params: params,
      additionals: {},
    }),
  };
  return apiFetch<ThreadsDataResponse>(endpoint, req);
}

export async function threadKey(videoId: string): Promise<ThreadKeyResponse> {
  const url = `https://nvapi.nicovideo.jp/v1/comment/keys/thread?videoId=${videoId}`;
  const req: RequestInit = {
    mode: "cors",
    method: "GET",
    cache: "no-cache",
    credentials: "omit",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "x-client-os-type": "others",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
  };
  const login = await getConfig("login");
  if (login) {
    const cookie = await browser.cookies.get({
      url: "https://www.nicovideo.jp",
      name: "user_session",
    });
    if (cookie) {
      req.credentials = "include";
      req.headers = {
        Cookie: `user_session=${cookie.value}`,
        ...((req.headers as Record<string, string>) || {}),
      };
    }
  }
  return apiFetch<ThreadKeyResponse>(url, req);
}

/**
 *
 * @param userId SnapShot API で取得したユーザーID
 */
export async function userData(userId: string): Promise<Owner> {
  const url = `https://nvapi.nicovideo.jp/v1/users/${userId}`;
  const req: RequestInit = {
    headers: {
      "User-Agent": navigator.userAgent ?? "",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
  };
  const json = await apiFetch<unknown>(url, req);
  const parsed = json as {
    data?: { user?: { nickname?: string; icons?: { small?: string } } };
  };
  const { nickname, icons } =
    parsed.data?.user ??
    ({} as { nickname?: string; icons?: { small?: string } });
  const owner: Owner = {
    ownerId: userId,
    ownerName: nickname || "",
    ownerIconUrl: icons?.small || "",
  };
  return owner;
}

/**
 *
 * @param channelId SnapShot API で取得したチャンネルID
 */
export async function channelData(channelId: string): Promise<Owner> {
  const url = `https://api.cas.nicovideo.jp/v2/tanzakus/channel/ch${channelId}`;
  const json = await apiFetch<unknown>(url);
  const parsed = json as { data?: { name?: string; icon?: string } };
  const { name, icon } =
    parsed.data ?? ({} as { name?: string; icon?: string });
  const owner: Owner = {
    ownerId: channelId,
    ownerName: name || "",
    ownerIconUrl: icon || "",
  };
  return owner;
}
