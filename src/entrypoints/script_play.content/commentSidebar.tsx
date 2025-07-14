import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Grid,
  Popover,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import style from "@mantine/core/styles.css?raw";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { getConfig, watchConfig } from "@/config";
import { find_element } from "@/lib/dom";
import type { NvCommentItem, Threads } from "@/types/nico_api_type";
import { CommentHandler } from "./commentHandler";
import nicoru from "./nicoru.png";
import useAnimationFrame from "./useAnimationFrame";

function toJPDateFormat(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function getFontSize(): number {
  return Number(getComputedStyle(document.documentElement).fontSize);
}

export function CommentSidebar({ threads }: { threads: Threads }) {
  const loop = useAnimationFrame(scroll, 120);

  const videoEl = useRef<HTMLVideoElement | null>(null);
  const parent = useRef<HTMLDivElement | null>(null);
  const isParentHovered = useRef(false);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const isAutoScrollEnabled = useRef(true);

  const [visibility, setVisibility] = useState(false);
  const [show_nicoru, setShowNicoru] = useState(false);
  const [width, setWidth] = useState<number>();
  const [fontSize, setFontSize] = useState<number>();
  const [bgColor, setBgColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();
  const [opacity, setOpacity] = useState<number>();
  const [comments_list, setCommentsList] = useState<NvCommentItem[]>([]);
  const [timing_offset, setTimingOffset] = useState<number>(0);

  const [isInitialized, setIsInitialized] = useState(false);

  async function scroll() {
    if (!isAutoScrollEnabled.current || isParentHovered.current) return;
    if (videoEl.current && !videoEl.current.paused) {
      const currentTimeMs = videoEl.current.currentTime * 1000;
      if (virtuoso.current) {
        virtuoso.current.scrollToIndex({
          index: comments_list.findIndex(
            (c) => c.vposMs > currentTimeMs + timing_offset
          ),
          align: "end",
        });
      }
    }
  }

  useEffect(() => {
    const comments = new CommentHandler();
    getConfig("visible_comments")
      .then((v) => v.filter((v) => v.enabled).map((v) => v.key))
      .then(async (forks) => {
        const c = await comments
          .flatten_comments(threads, forks)
          .then((l) => comments.sort_nv_comment(l));
        setCommentsList(c);
      });
  }, [threads]);

  useEffect(() => {
    parent.current?.addEventListener("mouseenter", () => {
      isAutoScrollEnabled.current = false;
    });
    parent.current?.addEventListener("mouseleave", () => {
      isAutoScrollEnabled.current = true;
    });
    isParentHovered.current = parent.current?.matches(":hover") ?? false;

    async function set_comments() {}

    watchConfig("visible_comments", async () => await set_comments());
    watchConfig("comment_area_width_px", (v) => setWidth(v));
    watchConfig("comment_area_font_size_px", (v) => setFontSize(v));
    watchConfig("comment_area_background_color", (v) => setBgColor(v));
    watchConfig("comment_text_color", (v) => setTextColor(v));
    watchConfig("comment_area_opacity_percentage", (v) => setOpacity(v));
    watchConfig("enable_auto_scroll", (v) => {
      isAutoScrollEnabled.current = v;
    });
    watchConfig("show_comments_in_list", (v) => setVisibility(v));
    watchConfig("show_nicoru_count", (v) => setShowNicoru(v));
    watchConfig("comment_timing_offset", (v) => setTimingOffset(v));
  }, []);

  useEffect(() => {
    if (isInitialized) return;
    (async () => {
      setWidth(await getConfig("comment_area_width_px"));
      setFontSize(await getConfig("comment_area_font_size_px"));
      setBgColor(await getConfig("comment_area_background_color"));
      setTextColor(await getConfig("comment_text_color"));
      setOpacity(await getConfig("comment_area_opacity_percentage"));
      isAutoScrollEnabled.current = await getConfig("enable_auto_scroll");
      setVisibility(await getConfig("show_comments_in_list"));
      setShowNicoru(await getConfig("show_nicoru_count"));
      setTimingOffset(await getConfig("comment_timing_offset"));

      videoEl.current = await find_element<HTMLVideoElement>("video");
      videoEl.current?.addEventListener("play", loop.start);
      videoEl.current?.addEventListener("pause", loop.pause);
      if (!videoEl.current?.paused) loop.start();
    })().then(() => setIsInitialized(true));
  }, [isInitialized, loop]);

  function vpos_to_time(vpos: number) {
    const minutes = Math.floor(vpos / 60000);
    const seconds = Math.floor((vpos % 60000) / 1000);
    const min_str = String(minutes).padStart(2, "0");
    const sec_str = String(seconds).padStart(2, "0");
    return `${min_str}:${sec_str}`;
  }

  function nicoru_color(nicoru: number) {
    const nicoruLv0 = "rgba(255, 216, 66, 0)";
    const nicoruLv1 = "rgba(252, 216, 66, 0.102)";
    const nicoruLv2 = "rgba(252, 216, 66, 0.2)";
    const nicoruLv3 = "rgba(252, 216, 66, 0.4)";
    const nicoruLv4 = "rgba(252, 216, 66, 0.6)";
    if (nicoru === 0) return nicoruLv0;
    if (nicoru < 6) return nicoruLv1;
    if (nicoru < 11) return nicoruLv2;
    if (nicoru < 21) return nicoruLv3;
    return nicoruLv4;
  }

  const CommentCard = ({ comment }: { comment: NvCommentItem }) => (
    <Popover position="left">
      <Popover.Target>
        <Card
          padding="xs"
          bg={show_nicoru ? nicoru_color(comment.nicoruCount) : "transparent"}
        >
          <Grid columns={10}>
            <Grid.Col span={show_nicoru ? 9 : 10}>
              <Stack>
                <Text c={textColor} lineClamp={4}>
                  {comment.body}
                </Text>
                <Badge c={textColor} variant="light">
                  {vpos_to_time(comment.vposMs)}
                </Badge>
              </Stack>
            </Grid.Col>
            {show_nicoru && (
              <Grid.Col span="content">
                <Stack gap="xs" align="center" justify="center">
                  <img
                    style={{
                      width: "1.5rem",
                    }}
                    src={nicoru}
                    aria-label="ニコる"
                  />
                  <Text c={textColor} size="xs">
                    {comment.nicoruCount}
                  </Text>
                </Stack>
              </Grid.Col>
            )}
          </Grid>
        </Card>
      </Popover.Target>
      <Popover.Dropdown bg="transparent" bd="none">
        <Card w={width} withBorder shadow="md" radius="md" bg={bgColor}>
          <ScrollArea h={getFontSize() * 6} mb="lg">
            <Text c={textColor}>{comment.body}</Text>
          </ScrollArea>

          <Card.Section p="md">
            <Text mb="sm">
              書き込み日時：{toJPDateFormat(new Date(comment.postedAt))}
            </Text>
            <Button
              variant="default"
              onClick={() => {
                if (videoEl.current) {
                  videoEl.current.currentTime = comment.vposMs / 1000;
                }
              }}
            >
              <Text c={textColor}>
                再生時間 ( {vpos_to_time(comment.vposMs)} ) へ移動
              </Text>
            </Button>
          </Card.Section>
        </Card>
      </Popover.Dropdown>
    </Popover>
  );

  return (
    <div
      style={{
        display: visibility ? "block" : "none",
        backgroundColor: bgColor,
        color: textColor,
        opacity: (opacity ?? 100) / 100,
        minWidth: `${width}px`,
        width: `${width}px`,
        height: "100%",
        fontSize: `${fontSize}px`,
      }}
    >
      <style>{style}</style>
      <Box ref={parent} w="100%" h="100%">
        <Virtuoso
          ref={virtuoso}
          data={comments_list}
          components={{
            Header: () =>
              comments_list.length === 0 ? (
                <Center p="md">
                  <Alert title="コメントなし" color="blue" bg="white">
                    <Text c="black">
                      表示できるコメントがありません。
                      まずは拡張機能のアイコンをクリックしてコメントを取得してください。
                    </Text>
                  </Alert>
                </Center>
              ) : null,
            Footer: () =>
              comments_list.length > 0 ? (
                <Center p="md">
                  <Text size="sm" c={textColor}>
                    最後のコメントです
                  </Text>
                </Center>
              ) : null,
          }}
          itemContent={(_index: number, comment: NvCommentItem) => (
            <CommentCard comment={comment} />
          )}
        />
      </Box>
    </div>
  );
}
