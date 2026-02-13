import '@mantine/core/styles.css';
import { createRoot, type Root } from 'react-dom/client';
import { getConfig, watchConfig } from '@/config/storage';
import { ThemedMantineProvider } from '@/config/theme';
import { andThenAsync, err, ok, unwrap } from '@/lib/types';
import { toVideoData } from '@/lib/utils';
import { onMessage, requestMessageResult } from '@/messaging/runtime';
import { createCommentManager, getComments } from '@/modules/comments/manager';
import { buildSearchQuery } from '@/modules/search';
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
        isolateEvents: false,
        onMount(container) {
          sidebarHost = container;
          const styleEl = document.createElement('style');
          styleEl.textContent = 'html, body { height: 100%; }';
          container.appendChild(styleEl);
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
          <CommentSidebar threads={threads} />
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
    await watchConfig('use_new_renderer', (enabled) => {
      applyRendererMode(enabled ? 'pixi' : 'niconi').catch(() => {
        applyRendererMode('niconi').catch(() => {});
      });
    });

    onMessage('comment_state_update', (payload) => setThreads(payload.threads));

    const handlePartChange = async () => {
      unwrap(await requestMessageResult('clear_videos'), 'clear_videos failed');

      const workInfoResult = await updateWorkInfo();
      if (!workInfoResult.ok) return err(workInfoResult.error);
      if (!(await getConfig('enable_auto_play'))) return ok([]);
      const searchRes = await requestMessageResult('search', buildSearchQuery(workInfoResult.value.data.title));
      return andThenAsync(searchRes, async (snapshot) => {
        const videos = toVideoData(snapshot);
        if (videos.length === 0) return ok([]);
        const videoDataResult = await getComments(commentManager, videos[0].contentId);
        if (!videoDataResult.ok) return err(videoDataResult.error);
        const addedRes = await requestMessageResult('add_video', {
          video: videoDataResult.value,
        });
        return addedRes.ok ? ok(addedRes.value as CommentVideoData[]) : err(addedRes.error);
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
      handlePartChange().catch(() => {});
    }, 500);
  },
  matches: ['*://animestore.docomo.ne.jp/animestore/*'],
  runAt: 'document_start',
});
