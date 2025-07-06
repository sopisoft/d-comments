import { getConfig } from "@/config";
import type {
  NvComment,
  Owner,
  ThreadKeyResponse,
  ThreadsDataResponse,
  VideoData,
} from "@/types/nico_api_type";

export async function videoData(videoId: string): Promise<VideoData> {
  const url = `https://www.nicovideo.jp/watch/${videoId}?responseType=json`;
  const login = await getConfig("login");
  const headers: RequestInit = {
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
  };
  if (login) {
    const cookie = await browser.cookies.get({
      url: "https://www.nicovideo.jp",
      name: "user_session",
    });
    console.log(cookie);
    if (cookie) {
      headers.credentials = "include";
      headers.headers = {
        ...headers.headers,
        Cookie: `user_session=${cookie.value}`,
      };
    }
  }
  return await fetch(url, headers).then(async (res) => await res.json());
}

export async function threadsData(
  nvComment: NvComment
): Promise<ThreadsDataResponse> {
  const { server, threadKey, params } = nvComment;
  const endpoint = `${server}/v1/threads`;
  const headers: RequestInit = {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "x-client-os-type": "others",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    } as HeadersInit,
    method: "POST",
    body: JSON.stringify({
      threadKey: threadKey,
      params: params,
      additionals: {},
    }),
  };

  const url = new URL(endpoint);

  return await fetch(url, headers).then(async (res) => await res.json());
}

export async function threadKey(videoId: string): Promise<ThreadKeyResponse> {
  const url = `https://nvapi.nicovideo.jp/v1/comment/keys/thread?videoId=${videoId}`;
  const headers: RequestInit = {
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
      headers.credentials = "include";
      headers.headers = {
        Cookie: `user_session=${cookie.value}`,
        ...headers.headers,
      };
    }
  }
  return await fetch(url, headers).then(async (res) => await res.json());
}

/**
 *
 * @param userId SnapShot API で取得したユーザーID
 */
export async function userData(userId: string): Promise<Owner> {
  const url = `https://nvapi.nicovideo.jp/v1/users/${userId}`;
  const headers: RequestInit = {
    headers: {
      "User-Agent": navigator.userAgent ?? "",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
  };
  return await fetch(url, headers).then(async (res) => {
    const json = await res.json();
    const { nickname, icons } = json.data.user;
    const owner: Owner = {
      ownerId: userId,
      ownerName: nickname,
      ownerIconUrl: icons.small,
    };
    return owner;
  });
}

/**
 *
 * @param channelId SnapShot API で取得したチャンネルID
 */
export async function channelData(channelId: string): Promise<Owner> {
  const url = `https://api.cas.nicovideo.jp/v2/tanzakus/channel/ch${channelId}`;
  return await fetch(url).then(async (res) => {
    const json = await res.json();
    const { name, icon } = json.data;
    const owner: Owner = {
      ownerId: channelId,
      ownerName: name,
      ownerIconUrl: icon,
    };
    return owner;
  });
}
