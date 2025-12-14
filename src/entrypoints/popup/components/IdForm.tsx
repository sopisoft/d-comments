import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdDownload } from "react-icons/md";
import { useTheme } from "@/config/hooks/useTheme";

const VIDEO_ID_REGEX = /^(sm|nm|so|ca|ax|yo|nl|ig|na|cw|z[a-e]|om|sk|yk)\d{1,14}$/;

export function IdForm({ addPlaying }: { addPlaying: (id: string) => Promise<void> }) {
  const { styles: ps } = useTheme();
  const form = useForm({
    initialValues: { id: "" },
    validate: {
      id: (v) => (VIDEO_ID_REGEX.test(v) ? null : "動画IDの形式が正しくありません"),
    },
  });

  return (
    <form onSubmit={form.onSubmit((v) => addPlaying(v.id))}>
      <Stack gap="md">
        <Text size="xs" c={ps.text.muted}>
          ニコニコ動画の動画IDを直接入力してコメントを取得します
        </Text>
        <TextInput
          label="動画ID"
          required
          placeholder="so35384944"
          key={form.key("id")}
          {...form.getInputProps("id")}
          styles={{ ...ps.inputStyles, label: { color: ps.text.primary } }}
        />
        <Button
          type="submit"
          loading={form.submitting}
          leftSection={<MdDownload size={16} />}
          variant="filled"
          color="accent"
        >
          取得
        </Button>
      </Stack>
    </form>
  );
}
