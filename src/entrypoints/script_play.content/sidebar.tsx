import { ActionIcon, Divider, Paper, Text } from "@mantine/core";
import { useCallback, useRef } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import type { NvCommentItem, Threads } from "@/types/api";
import { SidebarCommentCard } from "./components/SidebarCommentCard";
import { SidebarPopoverDropdown } from "./components/SidebarPopoverDropdown";
import { PopoverProvider, usePopover } from "./context/PopoverContext";
import { useCommentList } from "./hooks/useCommentList";
import { useSidebarAutoScroll } from "./hooks/useSidebarAutoScroll";
import { useSidebarConfig, useVideoElement } from "./hooks/useSidebarConfig";

function SidebarContent({ threads }: { threads: Threads }) {
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const { video } = useVideoElement();
  const config = useSidebarConfig();
  const comments = useCommentList(threads);

  const autoScroll = useSidebarAutoScroll({
    video,
    config,
    comments,
    virtuosoRef,
  });

  const { notifyHover, openPopover: hookOpenPopover } = autoScroll;
  const { comment, setComment, close } = usePopover();

  const openPopover = useCallback(
    (item: NvCommentItem, selection?: "user" | "word") => {
      hookOpenPopover(item, selection);
      setComment(item);
    },
    [hookOpenPopover, setComment]
  );

  const renderCommentItem = useCallback(
    (_: number, item: NvCommentItem) => (
      <SidebarCommentCard
        comment={item}
        showNicoru={config.showNicoru ?? false}
        isActive={comment?.id === item.id}
        onContext={() => openPopover(item, "user")}
        onOpen={() => openPopover(item)}
        onRightDown={() => openPopover(item, "user")}
      />
    ),
    [comment?.id, config.showNicoru, openPopover]
  );

  const handleSeek = useCallback(
    (item: NvCommentItem) => {
      if (video) video.currentTime = item.vposMs / 1000;
    },
    [video]
  );

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: config.visibility ? "flex" : "none",
        flexDirection: "column",
        backgroundColor: config.bgColor,
        color: config.textColor,
        opacity: (config.opacity ?? 100) / 100,
        width: `${config.width ?? 0}px`,
        fontSize: `${config.fontSize ?? 0}px`,
      }}
    >
      <div
        style={{
          padding: "12px",
          borderBottom: `1px solid ${config.textColor}20`,
          flexShrink: 0,
        }}
      >
        <Text size="sm" fw={600} ta="center">
          コメント数: {comments.length}
        </Text>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <section
          aria-label="コメントリスト"
          onMouseEnter={() => notifyHover(true)}
          onMouseLeave={() => notifyHover(false)}
          style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
          }}
        >
          <Virtuoso
            ref={virtuosoRef}
            data={comments}
            itemContent={renderCommentItem}
            style={{ height: "100%" }}
            increaseViewportBy={{ top: 100, bottom: 100 }}
          />
        </section>

        {comment ? (
          <Divider
            my={0}
            style={{
              borderColor: `${config.textColor}40`,
              flexShrink: 0,
            }}
          />
        ) : null}

        {comment ? (
          <Paper
            p="md"
            style={{
              flex: 0.6,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: `${config.bgColor}40`,
              borderTop: `2px solid ${config.textColor}40`,
              flexShrink: 0,
            }}
            withBorder={false}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "8px",
              }}
            >
              <Text size="md" fw={700}>
                詳細
              </Text>
              <ActionIcon
                onClick={close}
                bg={config.bgColor}
                c={config.textColor}
                style={{
                  border: `1px solid ${config.textColor}`,
                  flexShrink: 0,
                }}
                size="sm"
                aria-label="詳細パネルを閉じる"
              >
                ×
              </ActionIcon>
            </div>
            <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              <SidebarPopoverDropdown
                comment={comment}
                onSeek={() => handleSeek(comment)}
              />
            </div>
          </Paper>
        ) : null}
      </div>
    </div>
  );
}

export function CommentSidebar({ threads }: { threads: Threads }) {
  return (
    <PopoverProvider>
      <SidebarContent threads={threads} />
    </PopoverProvider>
  );
}
