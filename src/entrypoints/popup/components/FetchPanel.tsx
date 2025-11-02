import { Grid, ScrollArea, Stack, Tabs, Text } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { logger } from "@/lib/logger";
import { onMessage, sendMessage } from "@/messaging/";
import { createCommentManager, getComments } from "@/modules/comments";
import type { CommentVideoData } from "@/types/comments";
import {
  buildDisplayVideos,
  type MergeOrder,
  mergeVideoEntries,
  mergeVideoOrder,
  type VideoDictionary,
} from "../utils/videoList";
import { IdForm } from "./IdForm";
import { SearchForm } from "./SearchForm";
import { VideoCard } from "./VideoCard";

export function FetchPanel({ title }: { title: string }) {
  const manager = useMemo(() => createCommentManager(), []);
  const [tabId, setTabId] = useState<number | null>(null);
  const [playingVideos, setPlayingVideos] = useState<CommentVideoData[]>([]);
  const [videoEntries, setVideoEntries] = useState<VideoDictionary>({});
  const [videoOrder, setVideoOrder] = useState<string[]>([]);

  const resolveTabId = useCallback(async (): Promise<number | null> => {
    if (tabId !== null) return tabId;
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const id = tabs[0]?.id ?? null;
    if (id !== null) setTabId(id);
    return id;
  }, [tabId]);

  const mergeVideos = useCallback(
    (incoming: CommentVideoData[], order: MergeOrder = "append") => {
      if (incoming.length === 0) return;

      setVideoEntries((prev) => mergeVideoEntries(prev, incoming));

      setVideoOrder((prev) =>
        mergeVideoOrder(
          prev,
          incoming.map((video) => video.videoData.contentId),
          order
        )
      );
    },
    []
  );

  const applyPlayingResponse = useCallback(
    (
      response: CommentVideoData[] | { error: string } | undefined,
      source: string
    ) => {
      if (!response) return;
      if ("error" in response) {
        logger.error(`${source} failed:`, response.error);
        return;
      }
      mergeVideos(response);
      setPlayingVideos(response);
    },
    [mergeVideos]
  );

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const id = await resolveTabId();
      if (cancelled || id === null) return;
      const response = await sendMessage("playing_video", { tabId: id });
      applyPlayingResponse(response, "Initial playing_video");
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [resolveTabId, applyPlayingResponse]);

  useEffect(() => {
    const unsubscribe = onMessage("comment_state_update", (payload) => {
      if (tabId !== null && payload.tabId !== tabId) {
        return;
      }
      if (tabId === null) {
        setTabId(payload.tabId);
      }
      mergeVideos(payload.videos);
      setPlayingVideos(payload.videos);
    });

    return () => {
      unsubscribe();
    };
  }, [tabId, mergeVideos]);

  const addPlaying = useCallback(
    async (videoId: string, existingTabId?: number) => {
      const id = existingTabId ?? (await resolveTabId());
      if (id === null) return;
      const video = await getComments(manager, videoId);
      if (!video.ok) {
        logger.error("Failed to fetch comments:", video.error);
        return;
      }
      const videoData = video.value;

      const response = await sendMessage("add_video", {
        tabId: id,
        video: videoData,
      });
      applyPlayingResponse(response, "Adding video");
      mergeVideos([videoData]);
    },
    [resolveTabId, manager, applyPlayingResponse, mergeVideos]
  );

  const togglePlaying = useCallback(
    async (videoId: string) => {
      const id = await resolveTabId();
      if (id === null) return;

      const currentlyPlaying = playingVideos.some(
        (video) => video.videoData.contentId === videoId
      );

      if (currentlyPlaying) {
        const response = await sendMessage("remove_video", {
          tabId: id,
          videoId,
        });
        applyPlayingResponse(response, "Removing video");
        return;
      }

      await addPlaying(videoId, id);
    },
    [resolveTabId, playingVideos, applyPlayingResponse, addPlaying]
  );

  const addSearchResult = useCallback(
    async (incoming: CommentVideoData[]) => {
      setVideoEntries((prev) => mergeVideoEntries(prev, incoming));
      setVideoOrder(() => {
        const playingIds = playingVideos.map((v) => v.videoData.contentId);
        const incomingIds = incoming.map((v) => v.videoData.contentId);
        const seen = new Set<string>(playingIds);
        const freshIncoming = incomingIds.filter((id) => !seen.has(id));
        return [...playingIds, ...freshIncoming];
      });
    },
    [playingVideos]
  );

  const playingIdSet = useMemo(
    () => new Set(playingVideos.map((video) => video.videoData.contentId)),
    [playingVideos]
  );

  const displayVideos = useMemo(
    () => buildDisplayVideos(playingVideos, videoEntries, videoOrder),
    [playingVideos, videoEntries, videoOrder]
  );

  return (
    <Grid>
      <Grid.Col span={7}>
        <ScrollArea h="calc(100vh - 120px)">
          {displayVideos.length === 0 ? (
            <Text c="dimmed" ta="center" mt="xl">
              検索してください
            </Text>
          ) : (
            <Stack>
              {displayVideos
                .map((video) => video.videoData)
                .map((item) => (
                  <VideoCard
                    key={item.contentId}
                    item={item}
                    playing={playingIdSet.has(item.contentId)}
                    togglePlaying={togglePlaying}
                  />
                ))}
            </Stack>
          )}
        </ScrollArea>
      </Grid.Col>
      <Grid.Col span={5}>
        <Tabs defaultValue="search" variant="outline">
          <Tabs.List grow>
            <Tabs.Tab value="search">検索</Tabs.Tab>
            <Tabs.Tab value="id">動画ID</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="search" pt="md">
            <SearchForm addVideos={addSearchResult} initialWord={title} />
          </Tabs.Panel>

          <Tabs.Panel value="id" pt="md">
            <IdForm addPlaying={addPlaying} />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
