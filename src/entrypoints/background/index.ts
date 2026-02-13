import { logger } from '@/lib/logger';
import { err, ok, type Result } from '@/lib/types';
import { onMessage } from '@/messaging/runtime';
import { addVideoToStore, clearStore, getStoreSnapshot, removeVideoFromStore } from './commentStore';
import { channelData, threadKey, threadsData, userData, videoData } from './fetch';
import { search } from './search';

let usageRead = false;
async function openUsageIfNotRead() {
  if (usageRead) return;
  usageRead = true;
  const [k, v] = ['read_usage', '1.0.0'];
  const items = await browser.storage.local.get(k);
  if (items[k] === v) return;
  await browser.tabs.create({ url: browser.runtime.getURL('/usage.html') });
  await browser.storage.local.set({ [k]: v });
}

export default defineBackground({
  async main() {
    browser.runtime.onInstalled.addListener(async (_details) => {
      await openUsageIfNotRead();
    });

    onMessage('search', (payload) => search(payload));
    onMessage('video_data', (payload) => videoData(payload));
    onMessage('threads_data', (payload) => threadsData(payload));
    onMessage('thread_key', (payload) => threadKey(payload));
    onMessage('user_data', (payload) => userData(payload));
    onMessage('channel_data', (payload) => channelData(payload));
    onMessage('add_video', async (payload, sender) =>
      withPayloadTab(payload, sender, 'Missing add_video payload', async (tabId, p) =>
        commit(tabId, await addVideoToStore(tabId, p.video))
      )
    );
    onMessage('remove_video', async (payload, sender) =>
      withPayloadTab(payload, sender, 'Missing remove_video payload', (tabId, p) =>
        commit(tabId, removeVideoFromStore(tabId, p.videoId))
      )
    );
    onMessage('clear_videos', async (payload, sender) =>
      withTab(payload, sender, (tabId) => commit(tabId, clearStore(tabId)))
    );
    onMessage('playing_video', async (payload, sender) =>
      withTab(payload, sender, (tabId) => ok(getStoreSnapshot(tabId).videos))
    );
  },
  type: 'module',
});

const resolveTabId = (explicitTabId: number | undefined, sender: Browser.runtime.MessageSender) => {
  const tabId = explicitTabId ?? sender.tab?.id;
  return tabId === null || tabId === undefined ? err(new Error('Unable to resolve tabId for message')) : ok(tabId);
};

const withTab = async <T>(
  payload: { tabId?: number } | undefined,
  sender: Browser.runtime.MessageSender,
  fn: (tabId: number) => Promise<Result<T, Error>> | Result<T, Error>
): Promise<Result<T, Error>> => {
  const tabIdRes = resolveTabId(payload?.tabId, sender);
  return tabIdRes.ok ? await fn(tabIdRes.value) : err(tabIdRes.error);
};

const withPayloadTab = async <T extends { tabId?: number }, R>(
  payload: T | undefined,
  sender: Browser.runtime.MessageSender,
  message: string,
  fn: (tabId: number, payload: T) => Promise<Result<R, Error>> | Result<R, Error>
): Promise<Result<R, Error>> =>
  payload ? await withTab(payload, sender, (tabId) => fn(tabId, payload)) : err(new Error(message));

const commit = async (tabId: number, state: ReturnType<typeof getStoreSnapshot>) => {
  await broadcastState(tabId, state);
  return ok(state.videos);
};

const broadcastState = async (tabId: number, state: ReturnType<typeof getStoreSnapshot>) => {
  await browser.tabs
    .sendMessage(tabId, {
      payload: {
        tabId,
        videos: state.videos,
        threads: state.threads,
      },
      type: 'comment_state_update',
    })
    .then(
      () => {},
      (error) => logger.debug('Failed to broadcast comment state', { error, tabId })
    );
};
