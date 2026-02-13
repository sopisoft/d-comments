import { getConfig } from '@/config/storage';
import { err, ok, type Result } from '@/lib/types';
import type { NvComment, Owner, ThreadKeyResponse, ThreadsDataResponse, VideoData } from '@/types/api';

async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<Result<T, Error>> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const message = `HTTP error: ${res.status}`;
    return err(new Error(message));
  }
  const data = (await res.json()) as T;
  return ok(data);
}

async function buildAuthRequestInit(r: RequestInit): Promise<RequestInit> {
  // Add cookie/credential headers when user is logged-in
  if (!(await getConfig('login'))) return r;
  const cookie = await browser.cookies.get({
    name: 'user_session',
    url: 'https://www.nicovideo.jp',
  });
  if (!cookie) return r;
  return {
    ...r,
    credentials: 'include',
    headers: {
      ...(r.headers as Record<string, string>),
      Cookie: `user_session=${cookie.value}`,
    },
  };
}

export async function videoData(videoId: string): Promise<Result<VideoData, Error>> {
  const url = `https://www.nicovideo.jp/watch/${videoId}?responseType=json`;
  const req: RequestInit = {
    cache: 'no-cache',
    credentials: 'omit',
    mode: 'cors',
  };
  return apiFetch<VideoData>(url, await buildAuthRequestInit(req));
}

export async function threadsData(nvComment: NvComment): Promise<Result<ThreadsDataResponse, Error>> {
  const { server, threadKey, params } = nvComment;
  const endpoint = `${server}/v1/threads`;
  const req: RequestInit = {
    body: JSON.stringify({
      threadKey: threadKey,
      params: params,
      additionals: {},
    }),
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'x-client-os-type': 'others',
      'x-frontend-id': '6',
      'x-frontend-version': '0',
    },
    method: 'POST',
  };
  return apiFetch<ThreadsDataResponse>(endpoint, req);
}

export async function threadKey(videoId: string): Promise<Result<ThreadKeyResponse, Error>> {
  const url = `https://nvapi.nicovideo.jp/v1/comment/keys/thread?videoId=${videoId}`;
  const req: RequestInit = {
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'x-client-os-type': 'others',
      'x-frontend-id': '6',
      'x-frontend-version': '0',
    },
    method: 'GET',
    mode: 'cors',
  };
  return apiFetch<ThreadKeyResponse>(url, await buildAuthRequestInit(req));
}

/**
 *
 * @param userId SnapShot API で取得したユーザーID
 */
export async function userData(userId: string): Promise<Result<Owner, Error>> {
  const url = `https://nvapi.nicovideo.jp/v1/users/${userId}`;
  type UserResponse = {
    data?: { user?: { nickname?: string; icons?: { small?: string } } };
  };
  const req: RequestInit = {
    headers: {
      'User-Agent': navigator.userAgent ?? '',
      'x-frontend-id': '6',
      'x-frontend-version': '0',
    },
  };
  const json = await apiFetch<UserResponse>(url, req);
  if (!json.ok) return err(json.error);
  const { nickname, icons } = json.value.data?.user ?? {};
  return ok({
    ownerIconUrl: icons?.small || '',
    ownerId: userId,
    ownerName: nickname || '',
  });
}

/**
 *
 * @param channelId SnapShot API で取得したチャンネルID
 */
export async function channelData(channelId: string): Promise<Result<Owner, Error>> {
  const url = `https://api.cas.nicovideo.jp/v2/tanzakus/channel/ch${channelId}`;
  type ChannelResponse = { data?: { name?: string; icon?: string } };
  const json = await apiFetch<ChannelResponse>(url);
  if (!json.ok) return err(json.error);
  const { name, icon } = json.value.data ?? {};
  return ok({
    ownerIconUrl: icon || '',
    ownerId: channelId,
    ownerName: name || '',
  });
}
