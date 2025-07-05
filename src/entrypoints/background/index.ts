import { onMessage } from "@/messaging";
import {
  channelData,
  threadKey,
  threadsData,
  userData,
  videoData,
} from "./fetch";
import { search } from "./search";

export default defineBackground({
  type: "module",
  main() {
    const manifest = browser.runtime.getManifest();
    console.log(manifest.name, manifest.version);

    onMessage("search", async (payload) => await search(payload));
    onMessage("video_data", async (payload) => await videoData(payload));
    onMessage("threads_data", async (payload) => await threadsData(payload));
    onMessage("thread_key", async (payload) => await threadKey(payload));
    onMessage("user_data", async (payload) => await userData(payload));
    onMessage("channel_data", async (payload) => await channelData(payload));
  },
});
