import { Grid, ScrollArea, Stack, Tabs, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { CommentHandler } from "@/entrypoints/script_play.content/commentHandler";
import { isError } from "@/lib/utils";
import { sendMessage } from "@/messaging";
import type { CommentVideoData } from "@/types/videoComment";
import { IdForm } from "./IdForm";
import { SearchForm } from "./SearchForm";
import { VideoCard } from "./VideoCard";

function FetchPanel() {
  const [videos, setVideos] = useState<CommentVideoData[]>([]);
  const [initialized, setInitialized] = useState(false);
  const comments = useMemo(() => new CommentHandler(), []);

  async function isPlaying(id: string): Promise<boolean> {
    const playings = await sendMessage("playing_video", undefined, true);
    return playings.find((v) => v.videoData.contentId === id) !== undefined;
  }

  async function togglePlaying(videoId: string) {
    if (await isPlaying(videoId)) {
      await sendMessage("remove_video", videoId, true);
    } else {
      await addPlaying(videoId);
    }
  }

  async function addPlaying(videoId: string) {
    const video = await comments.get(videoId);
    if (!isError(video)) {
      await sendMessage("add_video", video, true);
      if (videos.find((v) => v.videoData.contentId === videoId) === undefined) {
        setVideos((videos) => [video, ...videos]);
      }
    }
  }

  async function addSearchResult(arg_videos: CommentVideoData[]) {
    const flags = await Promise.all(
      videos.map((v) => isPlaying(v.videoData.contentId))
    );
    const filtered_videos = videos.filter((_, i) => !flags[i]);
    setVideos([...filtered_videos, ...arg_videos]);
  }

  useEffect(() => {
    if (initialized) return;
    sendMessage("playing_video", undefined, true).then((v) => {
      const olds = videos;
      const news = v.filter((v) => {
        return !olds.some(
          (old) => old.videoData.contentId === v.videoData.contentId
        );
      });
      setVideos([...news, ...olds]);
    });
    setInitialized(true);
  }, [videos, initialized]);

  return (
    <Grid>
      <Grid.Col span={7}>
        <ScrollArea h="calc(100vh - 120px)">
          {videos.length === 0 ? (
            <Text c="dimmed" ta="center" mt="xl">
              検索してください
            </Text>
          ) : (
            <Stack>
              {videos
                .map((v) => v.videoData)
                .map((item) => (
                  <VideoCard
                    key={item.contentId}
                    item={item}
                    isPlaying={isPlaying}
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
            <SearchForm addVideos={(videos) => addSearchResult(videos)} />
          </Tabs.Panel>

          <Tabs.Panel value="id" pt="md">
            <IdForm addPlaying={(videoId) => addPlaying(videoId)} />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}

export default FetchPanel;
