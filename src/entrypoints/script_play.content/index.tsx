import "@mantine/core/styles.css";
import { createRoot, type Root } from "react-dom/client";
import { getConfig, ThemedMantineProvider, watchConfig } from "@/config/";
import type { SnapShotResponse } from "@/entrypoints/background/search";
import { err, ok, type Result, unwrap } from "@/lib/types";
import { toVideoData } from "@/lib/utils";
import { onMessage, requestMessageResult } from "@/messaging/";
import { createCommentManager, getComments } from "@/modules/comments";
import { buildSearchQuery } from "@/modules/search";
import type { Threads } from "@/types/api";
import type { CommentVideoData } from "@/types/comments";
import { type RendererMode, renderer } from "./renderer";
import { CommentSidebar } from "./sidebar";
import { updateWorkInfo } from "./workInfo";
import { videoWrapper } from "./wrapper";

const VIDEO_PAGE_PATTERN = "/animestore/sc_d_pc?partId=";

const isVideoPage = (href: string): boolean => href.includes(VIDEO_PAGE_PATTERN);

export default defineContentScript({
  matches: ["*://animestore.docomo.ne.jp/animestore/*"],
  runAt: "document_start",
  cssInjectionMode: "ui",
  async main(ctx) {
    const href = window.location.href;
    if (!isVideoPage(href)) return;
    await videoWrapper();

    const commentManager = createCommentManager();

    const sideMenu = document.getElementById("d-comments-side");
    if (!sideMenu) return;

    let sidebarHost = sideMenu.querySelector("d-comments-sidebar");
    if (!sidebarHost) {
      const ui = await createShadowRootUi(ctx, {
        name: "d-comments-sidebar",
        position: "inline",
        anchor: "#d-comments-side",
        isolateEvents: false,
        onMount(container) {
          sidebarHost = container;
          const styleEl = document.createElement("style");
          styleEl.textContent = "html, body { height: 100%; }";
          container.appendChild(styleEl);
        },
      });
      ui.mount();
      sidebarHost = sidebarHost ?? sideMenu.querySelector("d-comments-sidebar");
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

    let rendererController: {
      dispose: () => void;
      setThreads: (threads: Threads) => void;
    } | null = null;
    let rendererMode: RendererMode | null = null;

    let currentThreads: Threads = [];

    const setThreads = (next: Threads) => {
      currentThreads = structuredClone(next);
      renderSidebar(currentThreads);
      rendererController?.setThreads(currentThreads);
    };

    const ensureRendererMode = async (
      nextMode: RendererMode,
      threads: Threads
    ): Promise<Result<RendererMode, Error>> => {
      if (rendererController && rendererMode === nextMode) {
        rendererController.setThreads(threads);
        return ok(nextMode);
      }

      rendererController?.dispose();
      const init = await renderer.init(nextMode);
      if (!init.ok) {
        rendererController = null;
        rendererMode = null;
        return err(new Error(init.error));
      }
      rendererController = init.value;
      rendererMode = nextMode;
      rendererController.setThreads(threads);
      return ok(nextMode);
    };

    const applyRendererMode = async (mode: RendererMode) => {
      const result = await ensureRendererMode(mode, currentThreads);
      if (!result.ok) return await ensureRendererMode("niconi", currentThreads);
      return result;
    };
    const initialMode = (await getConfig("use_new_renderer")) ? "pixi" : "niconi";
    await applyRendererMode(initialMode);
    await watchConfig("use_new_renderer", (enabled) => {
      void applyRendererMode(enabled ? "pixi" : "niconi");
    });

    onMessage("comment_state_update", (payload) => {
      setThreads(payload.threads);
    });

    const handlePartChange = async () => {
      const clearRes = await requestMessageResult("clear_videos");
      unwrap(clearRes, "clear_videos failed");

      const workInfoResult = await updateWorkInfo();
      if (!workInfoResult.ok) return err(workInfoResult.error);
      const title = workInfoResult.value.data.title;

      const enableAutoPlay = await getConfig("enable_auto_play");
      if (!enableAutoPlay) return ok([]);
      let videos: CommentVideoData["videoData"][] = [];
      const searchRes = await requestMessageResult("search", buildSearchQuery(title));
      const snapshot = unwrap<SnapShotResponse>(searchRes, "Search failed");
      if (!snapshot) return err(new Error("Search failed"));
      videos = toVideoData(snapshot);
      if (videos.length === 0) return ok([]);
      const videoDataResult = await getComments(commentManager, videos[0].contentId);
      if (!videoDataResult.ok) return err(videoDataResult.error);

      const addedRes = await requestMessageResult("add_video", {
        video: videoDataResult.value,
      });
      if (addedRes.ok) return ok(addedRes.value as CommentVideoData[]);
      return err(addedRes.error);
    };

    const params = new URLSearchParams(window.location.search);
    let lastPartId = params.get("partId");
    if (lastPartId) await handlePartChange();

    window.setInterval(() => {
      const currentPartId = new URLSearchParams(window.location.search).get("partId");
      if (!currentPartId || currentPartId === lastPartId) {
        return;
      }
      lastPartId = currentPartId;
      void handlePartChange();
    }, 500);
  },
});
