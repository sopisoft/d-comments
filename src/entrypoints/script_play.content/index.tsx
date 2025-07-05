import initCommentRenderer, { type CommentRenderer } from "./commentRenderer";
import { videoWrapper } from "./playerWrapper";
import { updateWorkInfo } from "./workInfo";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import type { Root } from "react-dom/client";
import { getConfig } from "@/config";
import type { SnapShotQuery } from "@/entrypoints/background/search";
import { isError, snapshotToMinimalVideoData } from "@/lib/utils";
import { onMessage, sendMessage } from "@/messaging";
import { theme } from "@/theme";
import type { Threads } from "@/types/nico_api_type";
import { CommentHandler } from "./commentHandler";
import { CommentSidebar } from "./commentSidebar";

export default defineContentScript({
  matches: ["*://animestore.docomo.ne.jp/animestore/*"],
  runAt: "document_start",
  async main() {
    const href = window.location.href;
    if (href.includes("/animestore/sc_d_pc?partId=")) {
      console.log("Play page");
      const sideRoot = await videoWrapper();

      const comments = new CommentHandler();
      let threads: Threads = [];

      const renderer = await initCommentRenderer();
      const workinfo = await updateWorkInfo();

      if (!sideRoot) return;

      if (document.title === "動画再生") {
        console.error("failed to set work info");
        return;
      }

      if (isError(renderer) || isError(workinfo)) return;

      function buildQuery(word: string): SnapShotQuery {
        return {
          q: word,
          fields: [
            "contentId",
            "title",
            "description",
            "tags",
            "genre",
            "categoryTags",
            "commentCounter",
            "viewCounter",
            "startTime",
            "lengthSeconds",
            "channelId",
            "userId",
            "thumbnailUrl",
          ],
          _sort: "-viewCounter",
          targets: ["title", "description"],
          _limit: 50,
        };
      }

      if (await getConfig("enable_auto_play")) {
        const searchResult = await sendMessage(
          "search",
          buildQuery(workinfo.data.title)
        );
        const videos = snapshotToMinimalVideoData(searchResult);
        if (videos.length === 0) return;
        const videoId = videos[0].contentId;

        comments.get(videoId).then(async (v) => {
          if (!isError(v)) {
            if (await getConfig("load_comments_on_next_video")) {
              threads = v.threads;
              comments.add_playing_video(v);
            }

            renderer.setThreads(threads);
            sideRoot.render(
              <MantineProvider theme={theme}>
                <CommentSidebar threads={threads} />
              </MantineProvider>
            );

            comments.onPlayingVideosChange((v) => {
              threads = v;
              reRender(renderer, sideRoot);
            });
          }
        });
      }

      function reRender(renderer: CommentRenderer, sideRoot: Root) {
        renderer.setThreads(threads);
        sideRoot.render(
          <MantineProvider theme={theme}>
            <CommentSidebar threads={threads} />
          </MantineProvider>
        );
      }

      onMessage("playing_video", async () => {
        return comments.getPlaying();
      });
      onMessage("add_video", async (payload) => {
        const video = payload;
        await comments.add_playing_video(video);
        threads = comments.get_threads();
        reRender(renderer, sideRoot);
      });
      onMessage("remove_video", async (payload) => {
        const videoId = payload;
        await comments.remove_playing_video(videoId);
        threads = comments.get_threads();
        reRender(renderer, sideRoot);
      });

      let partId: string | undefined;
      requestAnimationFrame(async function loop() {
        const id = new URLSearchParams(location.search).get("partId");
        if (id && id !== partId) {
          partId = id;
          const workInfo = await updateWorkInfo();
          if (isError(workInfo)) return;
          if (partId === undefined) return;

          if (await getConfig("load_comments_on_next_video")) {
            const searchResult = await sendMessage(
              "search",
              buildQuery(workInfo.data.title)
            );
            const videos = snapshotToMinimalVideoData(searchResult);
            if (videos.length === 0) return;
            const videoId = videos[0].contentId;

            comments.get(videoId).then(async (v) => {
              if (!isError(v)) {
                threads = v.threads;
                reRender(renderer, sideRoot);
              }
            });
          }
          console.log("partId", partId);
        }
        requestAnimationFrame(loop);
      });
    }
  },
});
