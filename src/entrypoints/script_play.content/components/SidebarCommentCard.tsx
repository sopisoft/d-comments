import { Badge, Card, Grid, Stack, Text } from "@mantine/core";
import type { MouseEvent, PointerEvent } from "react";
import { Activity, useState } from "react";
import type { NvCommentItem } from "@/types/api";
import { useSidebarConfig } from "../hooks/useSidebarConfig";
import nicoruImage from "../nicoru.png";
import { nicoruColor, vposToTime } from "../utils/formatting";

type SidebarCommentCardProps = {
  comment: NvCommentItem;
  showNicoru: boolean;
  isActive?: boolean;
  onHover?(): void;
  onLeave?(): void;
  onOpen?(): void;
  onContext?(event: MouseEvent<HTMLDivElement>): void;
  onRightDown?(event: PointerEvent<HTMLDivElement>): void;
};

export function SidebarCommentCard({
  comment,
  showNicoru,
  isActive = false,
  onHover,
  onLeave,
  onOpen,
  onContext,
  onRightDown,
}: SidebarCommentCardProps) {
  const config = useSidebarConfig();
  const [isHovered, setIsHovered] = useState(false);

  const nicorubg = showNicoru ? nicoruColor(comment.nicoruCount) : undefined;
  let bg = nicorubg;
  if (isActive) {
    bg =
      "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.08) 100%)";
  } else if (isHovered) {
    bg =
      nicorubg && nicorubg !== "rgba(255, 216, 66, 0)"
        ? `linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.18) 100%), ${nicorubg}`
        : "linear-gradient(135deg, rgba(148,163,184,0.16) 0%, rgba(148,163,184,0.06) 100%)";
  }

  return (
    <Card
      component="div"
      padding="xs"
      radius="sm"
      withBorder
      onClick={onOpen}
      onContextMenu={(e) => {
        e.preventDefault();
        onContext?.(e);
      }}
      onPointerDown={(e) => e.button === 2 && onRightDown?.(e)}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onLeave?.();
      }}
      style={{
        background: bg,
        borderColor: isActive
          ? "var(--mantine-color-blue-5)"
          : isHovered
            ? "var(--mantine-color-blue-2)"
            : undefined,
        marginBottom: "0.5rem",
        transform: isActive ? "translateX(4px)" : "translateX(0)",
        transition: "all 160ms ease",
        cursor: "pointer",
      }}
    >
      <Grid columns={10}>
        <Grid.Col span={showNicoru ? 9 : 10}>
          <Stack gap="xs">
            <Text c={config.textColor} lineClamp={4}>
              {comment.body}
            </Text>
            <Badge c={config.textColor} variant="light">
              {vposToTime(comment.vposMs)}
            </Badge>
          </Stack>
        </Grid.Col>
        <Activity mode={showNicoru ? "visible" : "hidden"}>
          <Grid.Col span="content">
            <Stack gap="xs" align="center" justify="center">
              <img style={{ width: "1.5rem" }} src={nicoruImage} alt="ニコる" />
              <Text c={config.textColor} size="xs">
                {comment.nicoruCount}
              </Text>
            </Stack>
          </Grid.Col>
        </Activity>
      </Grid>
    </Card>
  );
}
