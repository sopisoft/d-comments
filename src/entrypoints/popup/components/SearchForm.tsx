import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { getConfig } from "@/config";
import type { _sort, SnapShotQuery } from "@/entrypoints/background/search";
import { snapshotToMinimalVideoData } from "@/lib/utils";
import { sendMessage } from "@/messaging";
import type { CommentVideoData } from "@/types/videoComment";

const sort_options: Map<_sort, string> = new Map([
  ["viewCounter", "再生数"],
  ["lengthSeconds", "動画の尺"],
  ["commentCounter", "コメント数"],
]);
const sort_order = new Map([
  ["-", "降順（大 → 小）"],
  ["+", "昇順（小 → 大）"],
]);

interface SearchFormProps {
  addVideos: (videos: CommentVideoData[]) => Promise<void>;
}

export function SearchForm({ addVideos: addSearchResult }: SearchFormProps) {
  const form = useForm({
    initialValues: {
      word: "",
      sort_option: "commentCounter",
      sort_order: "-",
    },
  });

  const fields: SnapShotQuery["fields"] = [
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
  ];

  async function handleSearch(values: typeof form.values) {
    const { word, sort_option, sort_order } = values;
    const sort = `${sort_order}${sort_option}`;

    const query: SnapShotQuery = {
      q: word,
      fields: fields,
      _sort: sort as SnapShotQuery["_sort"],
      targets: ["title", "description", "tags"],
      _limit: 50,
    };

    const res = await sendMessage("search", query);
    if (res.meta.status !== 200) {
      console.error(res.meta.errorCode, res.meta.errorMessage);
      return;
    }

    const data = snapshotToMinimalVideoData(res);
    const videos: CommentVideoData[] = data.map((v) => {
      return {
        date: -1,
        videoData: v,
        threads: [],
      };
    });
    await addSearchResult(videos);
  }

  useEffect(() => {
    getConfig("auto_search").then(async (v) => {
      if (!v) return;

      const title = await browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
          return tabs[0].title;
        });
      if (!title) return;

      const query: SnapShotQuery = {
        q: title,
        fields: fields,
        _sort: "-commentCounter",
        targets: ["title", "description", "tags"],
        _limit: 50,
      };

      const res = await sendMessage("search", query);
      if (res.meta.status !== 200) {
        console.error(res.meta.errorCode, res.meta.errorMessage);
        return;
      }

      const data = snapshotToMinimalVideoData(res);
      const videos: CommentVideoData[] = data.map((v) => {
        return {
          date: -1,
          videoData: v,
          threads: [],
        };
      });
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
            data={Array.from(sort_options).map(([value, label]) => ({
              value,
              label,
            }))}
            key={form.key("sort_option")}
            {...form.getInputProps("sort_option")}
          />
          <Select
            label="並び順"
            data={Array.from(sort_order).map(([value, label]) => ({
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
