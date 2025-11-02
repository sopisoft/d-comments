import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { getConfig } from "@/config/";
import type { _sort, SnapShotQuery } from "@/entrypoints/background/search";
import { logger } from "@/lib/logger";
import { toVideoData } from "@/lib/utils";
import { sendMessage } from "@/messaging/";
import { buildSearchQuery } from "@/modules/search";
import type { CommentVideoData } from "@/types/comments";

const sortOptions: Map<_sort, string> = new Map([
  ["viewCounter", "再生数"],
  ["lengthSeconds", "動画の尺"],
  ["commentCounter", "コメント数"],
]);
const sortOrder = new Map([
  ["-", "降順（大 → 小）"],
  ["+", "昇順（小 → 大）"],
]);

interface SearchFormProps {
  initialWord?: string;
  addVideos: (videos: CommentVideoData[]) => Promise<void>;
}

export function SearchForm({
  initialWord,
  addVideos: addSearchResult,
}: SearchFormProps) {
  const form = useForm({
    initialValues: {
      word: initialWord ?? "",
      sort_option: "commentCounter",
      sort_order: "-",
    },
  });

  async function handleSearch(values: typeof form.values) {
    const { word, sort_option, sort_order } = values;
    const sort = `${sort_order}${sort_option}` as SnapShotQuery["_sort"];
    const query = buildSearchQuery(word, sort);

    const res = await sendMessage("search", query);
    if (!res || "error" in res) {
      logger.error("search error", res);
      return;
    }

    if (res.meta.status !== 200) {
      logger.error(res.meta.errorCode, res.meta.errorMessage);
      return;
    }

    const data = toVideoData(res);
    const videos: CommentVideoData[] = data.map((v) => ({
      date: -1,
      videoData: v,
      threads: [],
    }));
    await addSearchResult(videos);
  }

  useEffect(() => {
    getConfig("auto_search").then(async (v) => {
      if (!v) return;

      const query = buildSearchQuery(form.getValues().word, "-commentCounter");
      const res = await sendMessage("search", query);
      if (!res || "error" in res) {
        logger.error("search error", res);
        return;
      }

      if (res.meta.status !== 200) {
        logger.error(res.meta.errorCode, res.meta.errorMessage);
        return;
      }

      const data = toVideoData(res);
      const videos: CommentVideoData[] = data.map((v) => ({
        date: -1,
        videoData: v,
        threads: [],
      }));
      await addSearchResult(videos);
    });
  }, []);

  return (
    <form onSubmit={form.onSubmit((v) => handleSearch(v))}>
      <Stack>
        <TextInput
          label="検索ワード"
          required
          placeholder="まちカドまぞく"
          key={form.key("word")}
          {...form.getInputProps("word")}
        />
        <Group grow>
          <Select
            label="並び替え"
            data={Array.from(sortOptions).map(([value, label]) => ({
              value,
              label,
            }))}
            key={form.key("sort_option")}
            {...form.getInputProps("sort_option")}
          />
          <Select
            label="並び順"
            data={Array.from(sortOrder).map(([value, label]) => ({
              value,
              label,
            }))}
            key={form.key("sort_order")}
            {...form.getInputProps("sort_order")}
          />
        </Group>
        <Button type="submit" loading={form.submitting}>
          検索
        </Button>
      </Stack>
    </form>
  );
}
