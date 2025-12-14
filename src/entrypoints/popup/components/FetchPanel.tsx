import { Grid, ScrollArea, Stack, Tabs, Text } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdSearch, MdTag } from "react-icons/md";
import { useTheme } from "@/config/hooks/useTheme";
import { ui } from "@/config/theme";
import { unwrap } from "@/lib/types";
import { getActiveTabId, onMessage, requestMessageResult } from "@/messaging/runtime";
import { createCommentManager, getComments } from "@/modules/comments/manager";
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
  const { styles: ps } = useTheme();
  const manager = useMemo(() => createCommentManager(), []);
  const cardStyle = {
    background: ps.bg.elevated,
    border: ps.panel.border,
    borderRadius: ui.radius.md,
    padding: ui.space.md,
  };
  const emptyStyle = {
    ...cardStyle,
    background: ps.bg.surface,
    border: `1px dashed ${ps.border.subtle}`,
    textAlign: "center",
    padding: ui.space.xl,
  } as const;
  const [tabId, setTabId] = useState<number | null>(null);
  const [playingVideos, setPlayingVideos] = useState<CommentVideoData[]>([]);
  const [videoEntries, setVideoEntries] = useState<VideoDictionary>({});
  const [videoOrder, setVideoOrder] = useState<string[]>([]);

  const resolveTabId = useCallback(async () => {
    if (tabId !== null) return tabId;
    const id = await getActiveTabId();
    if (id !== null) setTabId(id);
    return id;
  }, [tabId]);

  const mergeVideos = useCallback((incoming: CommentVideoData[], order: MergeOrder = "append") => {
    if (incoming.length === 0) return;
    setVideoEntries((prev) => mergeVideoEntries(prev, incoming));
    setVideoOrder((prev) =>
      mergeVideoOrder(
        prev,
        incoming.map((v) => v.videoData.contentId),
        order
      )
    );
  }, []);

  const applyPlayingResponse = useCallback(
    (response: CommentVideoData[]) => {
      mergeVideos(response);
      setPlayingVideos(response);
    },
    [mergeVideos]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = await resolveTabId();
      if (cancelled || id === null) return;
      const res = await requestMessageResult("playing_video", { tabId: id });
      const value = unwrap<CommentVideoData[]>(res, "Initial playing_video failed");
      if (value) applyPlayingResponse(value);
    })();
    return () => {
      cancelled = true;
    };
  }, [resolveTabId, applyPlayingResponse]);

  useEffect(
    () =>
      onMessage("comment_state_update", (payload) => {
        if (tabId !== null && payload.tabId !== tabId) return;
        if (tabId === null) setTabId(payload.tabId);
        mergeVideos(payload.videos);
        setPlayingVideos(payload.videos);
      }),
    [tabId, mergeVideos]
  );

  const addPlaying = useCallback(
    async (videoId: string, existingTabId?: number) => {
      const id = existingTabId ?? (await resolveTabId());
      if (id === null) return;
      const video = unwrap(await getComments(manager, videoId), "Failed to fetch comments");
      if (!video) return;
      const res = await requestMessageResult("add_video", {
        tabId: id,
        video: video,
      });
      const added = unwrap<CommentVideoData[]>(res, "Adding video failed");
      if (added) applyPlayingResponse(added);
      mergeVideos([video]);
    },
    [resolveTabId, manager, applyPlayingResponse, mergeVideos]
  );

  const togglePlaying = useCallback(
    async (videoId: string) => {
      const id = await resolveTabId();
      if (id === null) return;
      if (playingVideos.some((v) => v.videoData.contentId === videoId)) {
        const res = await requestMessageResult("remove_video", {
          tabId: id,
          videoId,
        });
        const removed = unwrap<CommentVideoData[]>(res, "Removing video failed");
        if (removed) applyPlayingResponse(removed);
      } else {
        await addPlaying(videoId, id);
      }
    },
    [resolveTabId, playingVideos, applyPlayingResponse, addPlaying]
  );

  const addSearchResult = useCallback(
    async (incoming: CommentVideoData[]) => {
      setVideoEntries((prev) => mergeVideoEntries(prev, incoming));
      setVideoOrder(() => {
        const playingIds = playingVideos.map((v) => v.videoData.contentId);
        const seen = new Set<string>(playingIds);
        return [...playingIds, ...incoming.map((v) => v.videoData.contentId).filter((id) => !seen.has(id))];
      });
    },
    [playingVideos]
  );

  const playingIdSet = useMemo(() => new Set(playingVideos.map((v) => v.videoData.contentId)), [playingVideos]);
  const displayVideos = useMemo(
    () => buildDisplayVideos(playingVideos, videoEntries, videoOrder),
    [playingVideos, videoEntries, videoOrder]
  );

  return (
    <Grid gutter="md">
      <Grid.Col span={7}>
        <ScrollArea h="calc(100vh - 140px)" scrollbarSize={6}>
          {displayVideos.length === 0 ? (
            <div style={emptyStyle}>
              <Text c={ps.text.muted} size="sm">
                動画を検索してください
              </Text>
            </div>
          ) : (
            <Stack gap="sm">
              {displayVideos.map(({ videoData: item }) => (
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
        <div style={cardStyle}>
          <Tabs defaultValue="search" variant="pills">
            <Tabs.List grow mb="md">
              <Tabs.Tab value="search" leftSection={<MdSearch size={16} />}>
                検索
              </Tabs.Tab>
              <Tabs.Tab value="id" leftSection={<MdTag size={16} />}>
                動画ID
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="search">
              <SearchForm addVideos={addSearchResult} initialWord={title} />
            </Tabs.Panel>
            <Tabs.Panel value="id">
              <IdForm addPlaying={addPlaying} />
            </Tabs.Panel>
          </Tabs>
        </div>
      </Grid.Col>
    </Grid>
  );
}
