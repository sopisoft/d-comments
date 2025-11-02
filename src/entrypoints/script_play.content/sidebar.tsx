import { Badge, Box, Button, Card, Grid, Stack, Text } from "@mantine/core";
import { Activity, useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { getConfig, watchConfig } from "@/config/";
import type { NvCommentItem, Threads } from "@/types/api";
import { useAnimationFrame } from "./hooks/useAnimationFrame";
import { useCommentList } from "./hooks/useCommentList";
import { useSidebarConfig, useVideoElement } from "./hooks/useSidebarConfig";
import nicoru from "./nicoru.png";
import { nicoruColor, toJPDateFormat, vposToTime } from "./utils/formatting";

type CommentCardProps = {
  comment: NvCommentItem;
  showNicoru: boolean;
  textColor?: string;
  expanded: boolean;
  onHover(commentId: string): void;
  onLeave(commentId: string): void;
  onToggle(commentId: string): void;
  onSeek(comment: NvCommentItem): void;
};

const CommentCard = ({
  comment,
  showNicoru,
  textColor,
  expanded,
  onHover,
  onLeave,
  onToggle,
  onSeek,
}: CommentCardProps) => (
  <Card
    padding="xs"
    bg={showNicoru ? nicoruColor(comment.nicoruCount) : "transparent"}
    role="button"
    radius="none"
    aria-pressed={expanded}
    aria-expanded={expanded}
    onMouseEnter={() => {
      onHover(comment.id);
    }}
    onMouseLeave={() => {
      onLeave(comment.id);
    }}
    onFocus={() => {
      onHover(comment.id);
    }}
    onBlur={() => {
      onLeave(comment.id);
    }}
    onClick={(event) => {
      event.preventDefault();
      onToggle(comment.id);
    }}
    style={{
      cursor: "pointer",
      outline: expanded ? `3px solid ${textColor}` : undefined,
      outlineOffset: expanded ? 2 : undefined,
      overflow: "visible",
    }}
  >
    <Grid columns={10} align="stretch">
      <Grid.Col span={showNicoru ? 9 : 10}>
        <Stack>
          <Text c={textColor} lineClamp={expanded ? undefined : 4}>
            {comment.body}
          </Text>
          <Badge c={textColor} variant="light">
            {vposToTime(comment.vposMs)}
          </Badge>
        </Stack>
      </Grid.Col>
      <Activity mode={showNicoru ? "visible" : "hidden"}>
        <Grid.Col span="content">
          <Stack gap="xs" align="center" justify="center">
            <img style={{ width: "1.5rem" }} src={nicoru} aria-label="ニコる" />
            <Text c={textColor} size="xs">
              {comment.nicoruCount}
            </Text>
          </Stack>
        </Grid.Col>
      </Activity>
    </Grid>
    {expanded ? (
      <Card.Section mt="sm" p="sm">
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            書き込み日時：
            {toJPDateFormat(new Date(comment.postedAt))}
          </Text>
          <Button
            size="xs"
            variant="default"
            c={textColor}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSeek(comment);
            }}
          >
            再生時間 ( {vposToTime(comment.vposMs)} ) へ移動
          </Button>
        </Stack>
      </Card.Section>
    ) : null}
  </Card>
);

export function CommentSidebar({ threads }: { threads: Threads }) {
  const virtuoso = useRef<VirtuosoHandle>(null);
  const isAutoScrollEnabled = useRef(true);

  const { video } = useVideoElement();
  const config = useSidebarConfig();
  const commentsList = useCommentList(threads);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);

  const scroll = () => {
    if (!isAutoScrollEnabled.current || !!lockedId || !video || video.paused)
      return;
    const index = commentsList.findIndex(
      (comment) =>
        comment.vposMs > video.currentTime * 1000 + (config.timingOffset ?? 0)
    );
    virtuoso.current?.scrollToIndex({
      index: index >= 0 ? index : 0,
      align: "end",
      behavior: config.scrollSmoothly ? "smooth" : "auto",
    });
  };

  const { start, pause } = useAnimationFrame(scroll, config.fps);

  useEffect(() => {
    if (!video) return;
    const onPlay = () => {
      start();
    };
    const onPause = () => {
      pause();
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    if (!video.paused) start();

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [video, start, pause]);

  useEffect(() => {
    getConfig("enable_auto_scroll")
      .then((v) => {
        isAutoScrollEnabled.current = v;
      })
      .then(() => {
        watchConfig("enable_auto_scroll", (value) => {
          isAutoScrollEnabled.current = value;
        });
      });
  }, []);

  const handleHover = (commentId: string) => {
    if (!lockedId) setHoveredId(commentId);
    isAutoScrollEnabled.current = false;
  };

  const handleLeave = (commentId: string) => {
    if (lockedId) return;
    setHoveredId((current) => (current === commentId ? null : current));
    isAutoScrollEnabled.current = true;
  };

  const handleToggle = (commentId: string) => {
    setLockedId((current) => (current === commentId ? null : commentId));
    setHoveredId((current) => (current === commentId ? null : current));
  };

  const handleSeek = (comment: NvCommentItem) => {
    if (video) video.currentTime = comment.vposMs / 1000;
  };

  return (
    <div
      style={{
        display: config.visibility ? "block" : "none",
        backgroundColor: config.bgColor,
        color: config.textColor,
        opacity: (config.opacity ?? 100) / 100,
        minWidth: `${config.width ?? 0}px`,
        width: `${config.width ?? 0}px`,
        height: "100%",
        fontSize: `${config.fontSize ?? 0}px`,
      }}
    >
      <Box
        onMouseEnter={() => {
          isAutoScrollEnabled.current = false;
        }}
        onFocus={() => {
          isAutoScrollEnabled.current = false;
        }}
        onMouseLeave={() => {
          isAutoScrollEnabled.current = true;
        }}
        onBlur={() => {
          isAutoScrollEnabled.current = true;
        }}
        w="100%"
        h="100%"
        pos="relative"
      >
        <Activity mode={commentsList.length > 0 ? "visible" : "hidden"}>
          <Text p="sm" ta="center" style={{ borderBottom: "1px solid" }}>
            コメント数: {commentsList.length}
          </Text>
        </Activity>
        <Virtuoso
          ref={virtuoso}
          data={commentsList}
          components={{
            Header: undefined,
            Footer: undefined,
          }}
          itemContent={(_index: number, comment: NvCommentItem) => {
            const expanded =
              lockedId === comment.id ||
              (!lockedId && hoveredId === comment.id);
            return (
              <CommentCard
                comment={comment}
                showNicoru={config.showNicoru ?? false}
                textColor={config.textColor}
                expanded={expanded}
                onHover={handleHover}
                onLeave={handleLeave}
                onToggle={handleToggle}
                onSeek={handleSeek}
              />
            );
          }}
        />
      </Box>
    </div>
  );
}
