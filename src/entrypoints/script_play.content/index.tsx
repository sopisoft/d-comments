import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { createRoot, type Root } from "react-dom/client";
import { getConfig, watchConfig } from "@/config/";
import { err, ok, type Result } from "@/lib/types";
import { toVideoData } from "@/lib/utils";
import { onMessage, sendMessage } from "@/messaging/";
import { createCommentManager, getComments } from "@/modules/comments";
import { buildSearchQuery } from "@/modules/search";
import { theme } from "@/theme";
import type { Threads } from "@/types/api";
import type { CommentVideoData } from "@/types/comments";
import { type RendererMode, renderer } from "./renderer";
import { CommentSidebar } from "./sidebar";
import { updateWorkInfo } from "./workInfo";
import { videoWrapper } from "./wrapper";

const VIDEO_PAGE_PATTERN = "/animestore/sc_d_pc?partId=";

const isVideoPage = (href: string): boolean =>
  href.includes(VIDEO_PAGE_PATTERN);

const cloneThreads = (threads: Threads): Threads =>
  threads.map((thread) => ({
    ...thread,
    comments: thread.comments.map((comment) => ({
      ...comment,
      commands: [...comment.commands],
    })),
  }));

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
        <MantineProvider theme={theme}>
          <CommentSidebar threads={threads} />
        </MantineProvider>
      );
    };

    let rendererController: {
      dispose: () => void;
      setThreads: (threads: Threads) => void;
    } | null = null;
    let rendererMode: RendererMode | null = null;

    let currentThreads: Threads = [];

    const setThreads = (next: Threads) => {
      currentThreads = cloneThreads(next);
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
    const initialMode = (await getConfig("use_new_renderer"))
      ? "pixi"
      : "niconi";
    await applyRendererMode(initialMode);
    await watchConfig("use_new_renderer", (enabled) => {
      void applyRendererMode(enabled ? "pixi" : "niconi");
    });

    onMessage("comment_state_update", (payload) => {
      setThreads(payload.threads);
    });

    const requestAddVideo = async (
      video: CommentVideoData
    ): Promise<Result<CommentVideoData[], Error>> => {
      const response = await sendMessage("add_video", { video });
      if (!response || "error" in response) {
        const message = response?.error ?? "add_video failed";
        return err(new Error(message));
      }
      return ok(response ?? []);
    };

    const handlePartChange = async () => {
      await sendMessage("clear_videos");

      const workInfoResult = await updateWorkInfo();
      if (!workInfoResult.ok) return err(workInfoResult.error);
      const title = workInfoResult.value.data.title;

      const enableAutoPlay = await getConfig("enable_auto_play");
      if (!enableAutoPlay) return ok([]);
      const searchResult = await sendMessage("search", buildSearchQuery(title));
      if ("error" in searchResult) return err(new Error(searchResult.error));
      const videos = searchResult ? toVideoData(searchResult) : [];
      if (videos.length === 0) return ok([]);
      const videoDataResult = await getComments(
        commentManager,
        videos[0].contentId
      );
      if (!videoDataResult.ok) return err(videoDataResult.error);

      return requestAddVideo(videoDataResult.value);
    };

    const params = new URLSearchParams(window.location.search);
    let lastPartId = params.get("partId");
    if (lastPartId) await handlePartChange();

    window.setInterval(() => {
      const currentPartId = new URLSearchParams(window.location.search).get(
        "partId"
      );
      if (!currentPartId || currentPartId === lastPartId) {
        return;
      }
      lastPartId = currentPartId;
      void handlePartChange();
    }, 500);
  },
});
