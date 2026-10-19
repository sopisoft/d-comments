import '@mantine/core/styles.css';
import { createRoot, type Root } from 'react-dom/client';
import { getConfig, watchConfig } from '@/config/storage';
import { ThemedMantineProvider } from '@/config/theme';
import { logger } from '@/lib/logger';
import { andThenAsync, err, ok, unwrap } from '@/lib/types';
import { onMessage, requestMessageResult } from '@/messaging/runtime';
import { createCommentManager, getComments } from '@/modules/comments/manager';
import { selectCommentSources } from '@/modules/commentSource';
import { searchEpisodeCandidates } from '@/modules/episodeSearch';
import { getWorkChannel, resolveWorkChannel, saveWorkChannel } from '@/modules/workChannels';
import type { Threads } from '@/types/api';
import type { CommentVideoData } from '@/types/comments';
import { renderer, type RendererMode } from './renderer';
import type { RendererController } from './renderer/types';
import { CommentSidebar } from './sidebar';
import { updateWorkInfo } from './workInfo';
import { videoWrapper } from './wrapper';

const VIDEO_PAGE_PATTERN = '/animestore/sc_d_pc?partId=';

const isVideoPage = (href: string): boolean => href.includes(VIDEO_PAGE_PATTERN);

export default defineContentScript({
  cssInjectionMode: 'ui',
  async main(ctx) {
    const href = window.location.href;
    if (!isVideoPage(href)) return;
    await videoWrapper();

    const commentManager = createCommentManager();

    const sideMenu = document.getElementById('d-comments-side');
    if (!sideMenu) return;

    let sidebarHost = sideMenu.querySelector('d-comments-sidebar');
    if (!sidebarHost) {
      const ui = await createShadowRootUi(ctx, {
        name: 'd-comments-sidebar',
        position: 'inline',
        anchor: '#d-comments-side',
        inheritStyles: true,
        css: ':host { display: block; height: 100%; }',
        isolateEvents: false,
        onMount(container) {
          sidebarHost = container;
          container.style.display = 'block';
          container.style.height = '100%';
          container.style.width = '100%';
        },
      });
      ui.mount();
      sidebarHost = sidebarHost ?? sideMenu.querySelector('d-comments-sidebar');
      if (!sidebarHost) return;
    }

    let sidebarRoot: Root | null = null;
    const renderSidebar = (threads: Threads) => {
      if (!sidebarRoot) {
        sidebarRoot = createRoot(sidebarHost as Element);
      }
      sidebarRoot.render(
        <ThemedMantineProvider>
          <CommentSidebar threads={threads} onRefresh={refreshComments} />
        </ThemedMantineProvider>
      );
    };

    let rendererController: RendererController | null = null;
    let rendererMode: RendererMode | null = null;

    let currentThreads: Threads = [];

    const setThreads = (next: Threads) => {
      currentThreads = structuredClone(next);
      renderSidebar(currentThreads);
      rendererController?.setThreads(currentThreads);
    };

    async function refreshComments() {
      const playing = await requestMessageResult('playing_video');
      if (!playing.ok) return logger.error(playing.error);
      const currentVideo = playing.value[0];
      if (!currentVideo) return;
      const refreshed = await getComments(commentManager, currentVideo.videoData.contentId);
      if (!refreshed.ok) return logger.error(refreshed.error);
      const added = await requestMessageResult('add_video', { video: refreshed.value });
      if (!added.ok) logger.error(added.error);
    }

    const resetRenderer = () => {
      rendererController?.dispose?.();
      rendererController = null;
      rendererMode = null;
    };

    const ensureRendererMode = async (nextMode: RendererMode, threads: Threads) => {
      if (rendererController && rendererMode === nextMode) {
        rendererController.setThreads(threads);
        return ok(nextMode);
      }
      resetRenderer();
      const init = await renderer.init(nextMode);
      if (!init.ok) return err(new Error(init.error));
      rendererController = init.value;
      rendererMode = nextMode;
      rendererController.setThreads(threads);
      return ok(nextMode);
    };

    const applyRendererMode = async (mode: RendererMode) => {
      const res = await ensureRendererMode(mode, currentThreads);
      if (!res.ok) return ensureRendererMode('niconi', currentThreads);
      return res;
    };
    const initialMode = (await getConfig('use_new_renderer')) ? 'pixi' : 'niconi';
    await applyRendererMode(initialMode);
    watchConfig('use_new_renderer', (enabled) => {
      applyRendererMode(enabled ? 'pixi' : 'niconi').catch(() => {
        applyRendererMode('niconi').catch(logger.error);
      });
    });

    onMessage('comment_state_update', (payload) => setThreads(payload.threads));

    const handlePartChange = async () => {
      unwrap(await requestMessageResult('clear_videos'), 'clear_videos failed');

      const workInfoResult = await updateWorkInfo();
      if (!workInfoResult.ok) return err(workInfoResult.error);
      if (!(await getConfig('enable_auto_play'))) return ok([]);
      const episode = workInfoResult.value.data;
      const knownChannel = await getWorkChannel(episode.workTitle);
      const policy = await getConfig('comment_source_policy');
      const searchRes = await searchEpisodeCandidates(
        episode,
        (query) => requestMessageResult('search', query),
        knownChannel?.channelId,
        policy
      );
      return andThenAsync(searchRes, async (videos) => {
        const mapping = resolveWorkChannel(episode, videos, knownChannel);
        if (mapping && mapping !== knownChannel) await saveWorkChannel(episode.workTitle, mapping);
        let playing: CommentVideoData[] = [];
        let lastError: Error | undefined;
        for (const video of selectCommentSources(videos, policy)) {
          const result = await getComments(commentManager, video.contentId);
          if (!result.ok) {
            lastError = result.error;
            continue;
          }
          const added = await requestMessageResult('add_video', { video: result.value });
          if (!added.ok) {
            lastError = added.error;
            continue;
          }
          playing = added.value;
        }
        return playing.length || !lastError ? ok(playing) : err(lastError);
      });
    };

    const params = new URLSearchParams(window.location.search);
    let lastPartId = params.get('partId');
    if (lastPartId) await handlePartChange();

    window.setInterval(() => {
      const currentPartId = new URLSearchParams(window.location.search).get('partId');
      if (!currentPartId || currentPartId === lastPartId) {
        return;
      }
      lastPartId = currentPartId;
      handlePartChange().catch(logger.error);
    }, 500);
  },
  matches: ['*://animestore.docomo.ne.jp/animestore/*'],
  runAt: 'document_start',
});
