import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { isValidVideoId } from "../utils";

interface IdFormProps {
  addPlaying: (id: string) => Promise<void>;
}

export function IdForm({ addPlaying }: IdFormProps) {
  const form = useForm({
    initialValues: {
      id: "",
    },
    validate: {
      id: (value) =>
        isValidVideoId(value) ? null : "動画IDの形式が正しくありません",
    },
  });

  async function handleId(values: typeof form.values) {
    const { id } = values;
    await addPlaying(id);
  }

  return (
    <form onSubmit={form.onSubmit((v) => handleId(v))}>
      <Stack>
        <TextInput
          label="ID"
          required
          placeholder="so35384944"
          key={form.key("id")}
          {...form.getInputProps("id")}
        />
        <Button type="submit" loading={form.submitting}>
          取得
        </Button>
      </Stack>
    </form>
  );
}
