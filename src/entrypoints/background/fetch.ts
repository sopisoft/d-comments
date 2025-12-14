import { getConfig } from "@/config/storage";
import { err, ok, type Result, toError } from "@/lib/types";
import type { NvComment, Owner, ThreadKeyResponse, ThreadsDataResponse, VideoData } from "@/types/api";

async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<Result<T, Error>> {
  try {
    const res = await fetch(input, init);
    if (!res.ok) {
      const message = `HTTP error: ${res.status}`;
      return err(new Error(message));
    }
    const data = (await res.json()) as T;
    return ok(data);
  } catch (error) {
    return err(toError(error));
  }
}

async function buildAuthRequestInit(r: RequestInit): Promise<RequestInit> {
  // add cookie/credential headers when user is logged-in
  if (!(await getConfig("login"))) return r;
  const cookie = await browser.cookies.get({
    url: "https://www.nicovideo.jp",
    name: "user_session",
  });
  if (!cookie) return r;
  return {
    ...r,
    credentials: "include",
    headers: {
      ...(r.headers as Record<string, string>),
      Cookie: `user_session=${cookie.value}`,
    },
  };
}

export async function videoData(videoId: string): Promise<VideoData> {
  const url = `https://www.nicovideo.jp/watch/${videoId}?responseType=json`;
  const req: RequestInit = {
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
  };
  const json = await apiFetch<VideoData>(url, await buildAuthRequestInit(req));
  if (!json.ok) throw json.error;
  return json.value;
}

export async function threadsData(nvComment: NvComment): Promise<ThreadsDataResponse> {
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
  const json = await apiFetch<ThreadsDataResponse>(endpoint, req);
  if (!json.ok) throw json.error;
  return json.value;
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
  const json = await apiFetch<ThreadKeyResponse>(url, await buildAuthRequestInit(req));
  if (!json.ok) throw json.error;
  return json.value;
}

/**
 *
 * @param userId SnapShot API で取得したユーザーID
 */
export async function userData(userId: string): Promise<Owner> {
  const url = `https://nvapi.nicovideo.jp/v1/users/${userId}`;
  type UserResponse = {
    data?: { user?: { nickname?: string; icons?: { small?: string } } };
  };
  const req: RequestInit = {
    headers: {
      "User-Agent": navigator.userAgent ?? "",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
  };
  const json = await apiFetch<UserResponse>(url, req);
  if (!json.ok) throw json.error;
  const { nickname, icons } = json.value.data?.user ?? {};
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
  type ChannelResponse = { data?: { name?: string; icon?: string } };
  const json = await apiFetch<ChannelResponse>(url);
  if (!json.ok) throw json.error;
  const { name, icon } = json.value.data ?? {};
  const owner: Owner = {
    ownerId: channelId,
    ownerName: name || "",
    ownerIconUrl: icon || "",
  };
  return owner;
}
