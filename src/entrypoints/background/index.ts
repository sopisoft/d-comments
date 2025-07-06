import { onMessage } from "@/messaging";
import {
  channelData,
  threadKey,
  threadsData,
  userData,
  videoData,
} from "./fetch";
import { search } from "./search";

let read = false;
async function openUsageIfNotRead() {
  if (read) return;
  read = true;
  const read_flag_key = "read_usage";
  const latest_doc_version = "1.0.0";
  const [k, v] = [read_flag_key, latest_doc_version];
  const usageRead: boolean = (await browser.storage.local.get(k))[k] === v;
  if (usageRead) return;

  await browser.tabs.create({
    url: browser.runtime.getURL("/usage.html"),
  });
  await browser.storage.local.set({
    [k]: v,
  });
}

export default defineBackground({
  type: "module",
  main() {
    browser.runtime.onInstalled.addListener(async (_details) => {
      await openUsageIfNotRead();
    });

    onMessage("search", async (payload) => await search(payload));
    onMessage("video_data", async (payload) => await videoData(payload));
    onMessage("threads_data", async (payload) => await threadsData(payload));
    onMessage("thread_key", async (payload) => await threadKey(payload));
    onMessage("user_data", async (payload) => await userData(payload));
    onMessage("channel_data", async (payload) => await channelData(payload));
  },
});
