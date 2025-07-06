import type {
  SnapShotQuery,
  SnapShotResponse,
} from "./entrypoints/background/search";
import type {
  NvComment,
  Owner,
  ThreadKeyResponse,
  ThreadsDataResponse,
  VideoData,
} from "./types/nico_api_type";
import type { CommentVideoData } from "./types/videoComment";

interface ProtocolMap {
  // Background <-> Content Script
  search(query: SnapShotQuery): Promise<SnapShotResponse>;
  video_data(videoId: string): Promise<VideoData>;
  threads_data(NvComment: NvComment): Promise<ThreadsDataResponse>;
  thread_key(videoId: string): Promise<ThreadKeyResponse>;
  user_data(userId: string): Promise<Owner>;
  channel_data(channelId: string): Promise<Owner>;

  // Popup <-> Content Script
  add_video(video: CommentVideoData): void;
  remove_video(videoId: string): void;
  playing_video(): CommentVideoData[];
}

type MessageType = keyof ProtocolMap;

type MessagePayload<T extends MessageType> = Parameters<ProtocolMap[T]>[0];

type MessageResponse<T extends MessageType> = ReturnType<ProtocolMap[T]>;

type Message<T extends MessageType> = {
  type: T;
  payload: MessagePayload<T>;
};

export const sendMessage = async <T extends MessageType>(
  type: T,
  payload: MessagePayload<T>,
  tab?: boolean
): Promise<MessageResponse<T>> => {
  if (tab) {
    const id = await browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then((v) => v[0].id);
    if (id === undefined) {
      throw new Error("Failed to get tabId");
    }
    return browser.tabs
      .sendMessage(id, { type, payload })
      .catch((e) => console.error(e)) as Promise<MessageResponse<T>>;
  }
  return browser.runtime.sendMessage({ type, payload }) as Promise<
    MessageResponse<T>
  >;
};

export const onMessage = <T extends MessageType>(
  type: T,
  handler: (
    payload: MessagePayload<T>,
    sender: Browser.runtime.MessageSender
  ) => MessageResponse<T> | Promise<MessageResponse<T>>
) => {
  const listener = (
    message: Message<T>,
    sender: Browser.runtime.MessageSender,
    sendResponse: (
      response: MessageResponse<T> | Promise<MessageResponse<T>>
    ) => void
  ) => {
    if (message.type === type) {
      const result = handler(message.payload, sender);
      if (result instanceof Promise) {
        result.then((res) => sendResponse(res as MessageResponse<T>));
        return true;
      }
      sendResponse(result as MessageResponse<T>);
    }
  };
  browser.runtime.onMessage.addListener(listener);
};
