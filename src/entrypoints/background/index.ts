import { logger } from "@/lib/logger";
import { onMessage } from "@/messaging/runtime";
import { addVideoToStore, clearStore, getStoreSnapshot, removeVideoFromStore } from "./commentStore";
import { channelData, threadKey, threadsData, userData, videoData } from "./fetch";
import { search } from "./search";

let read = false;
async function openUsageIfNotRead() {
  if (read) return;
  read = true;
  const [k, v] = ["read_usage", "1.0.0"];
  const items = await browser.storage.local.get(k);
  if (items[k] === v) return;
  await browser.tabs.create({ url: browser.runtime.getURL("/usage.html") });
  await browser.storage.local.set({ [k]: v });
}

export default defineBackground({
  type: "module",
  async main() {
    browser.runtime.onInstalled.addListener(async (_details) => {
      await openUsageIfNotRead();
    });

    onMessage("search", async (payload) => await search(payload));
    onMessage("video_data", async (payload) => await videoData(payload));
    onMessage("threads_data", async (payload) => await threadsData(payload));
    onMessage("thread_key", async (payload) => await threadKey(payload));
    onMessage("user_data", async (payload) => await userData(payload));
    onMessage("channel_data", async (payload) => await channelData(payload));
    onMessage("add_video", async (payload, sender) => {
      if (!payload) {
        throw new Error("Missing add_video payload");
      }
      const tabId = resolveTabId(payload.tabId, sender);
      const state = await addVideoToStore(tabId, payload.video);
      await broadcastState(tabId, state);
      return state.videos;
    });
    onMessage("remove_video", async (payload, sender) => {
      if (!payload) {
        throw new Error("Missing remove_video payload");
      }
      const tabId = resolveTabId(payload.tabId, sender);
      const state = removeVideoFromStore(tabId, payload.videoId);
      await broadcastState(tabId, state);
      return state.videos;
    });
    onMessage("clear_videos", async (payload, sender) => {
      const tabId = resolveTabId(payload?.tabId, sender);
      const state = clearStore(tabId);
      await broadcastState(tabId, state);
      return state.videos;
    });
    onMessage("playing_video", async (payload, sender) => {
      const tabId = resolveTabId(payload?.tabId, sender);
      const state = getStoreSnapshot(tabId);
      return state.videos;
    });
  },
});

const resolveTabId = (explicitTabId: number | undefined, sender: Browser.runtime.MessageSender): number => {
  if (typeof explicitTabId === "number") {
    return explicitTabId;
  }
  const senderTabId = sender.tab?.id;
  if (typeof senderTabId === "number") {
    return senderTabId;
  }
  throw new Error("Unable to resolve tabId for message");
};

const broadcastState = async (tabId: number, state: ReturnType<typeof getStoreSnapshot>) => {
  try {
    await browser.tabs.sendMessage(tabId, {
      type: "comment_state_update",
      payload: {
        tabId,
        videos: state.videos,
        threads: state.threads,
      },
    });
  } catch (error) {
    logger.debug("Failed to broadcast comment state", { tabId, error });
  }
};
