import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { MdCheck, MdClose, MdDelete, MdEdit } from "react-icons/md";
import { getConfig, setConfig, watchConfig } from "@/config";

type NgEntry = { value: string; enabled: boolean };

export function NgListPanel() {
  const [lists, setLists] = useState({
    user: [] as NgEntry[],
    word: [] as NgEntry[],
  });

  useEffect(() => {
    let unwatch1: (() => void) | null = null;
    let unwatch2: (() => void) | null = null;
    (async () => {
      const [u, w] = await Promise.all([
        getConfig("ng_user_ids") as Promise<NgEntry[] | undefined>,
        getConfig("ng_words") as Promise<NgEntry[] | undefined>,
      ]);
      setLists({ user: u ?? [], word: w ?? [] });
      unwatch1 = await watchConfig("ng_user_ids", (v) =>
        setLists((p) => ({ ...p, user: v as NgEntry[] }))
      );
      unwatch2 = await watchConfig("ng_words", (v) =>
        setLists((p) => ({ ...p, word: v as NgEntry[] }))
      );
    })();
    return () => {
      unwatch1?.();
      unwatch2?.();
    };
  }, []);

  const updateList = async (type: "user" | "word", list: NgEntry[]) => {
    await setConfig(type === "user" ? "ng_user_ids" : "ng_words", list);
  };

  return (
    <Stack gap="md">
      <Title order={3}>NG 管理</Title>
      <Section
        type="user"
        title="NG ユーザー"
        description="ユーザーのコメントを除外します"
        placeholder="ユーザーIDを入力"
        entries={lists.user}
        onUpdate={(list) => updateList("user", list)}
      />
      <Section
        type="word"
        title="NG ワード"
        description="コメント内に含まれるワードを除外します。正規表現も使用可能です。"
        placeholder="(ねた|ネタ)|(ばれ|バレ)"
        entries={lists.word}
        onUpdate={(list) => updateList("word", list)}
      />
    </Stack>
  );
}

function Section({
  type,
  title,
  description,
  placeholder,
  entries,
  onUpdate,
}: {
  type: "user" | "word";
  title: string;
  description: string;
  placeholder: string;
  entries: NgEntry[];
  onUpdate: (list: NgEntry[]) => Promise<void>;
}) {
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = input.trim();
    if (!trimmed || entries.some((e) => e.value === trimmed)) return;
    await onUpdate([...entries, { value: trimmed, enabled: true }]);
    setInput("");
  };

  const handleSave = async (editValue: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    await onUpdate(
      entries.map((e) => (e.value === editing ? { ...e, value: trimmed } : e))
    );
    setEditing(null);
  };

  const handleToggle = async (value: string) => {
    await onUpdate(
      entries.map((e) =>
        e.value === value ? { ...e, enabled: !e.enabled } : e
      )
    );
  };

  const handleDelete = async (value: string) => {
    await onUpdate(entries.filter((x) => x.value !== value));
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="md">
        <div>
          <Title order={5} mb="xs">
            {title}
          </Title>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </div>

        <Group align="flex-end" gap="sm">
          <TextInput
            label={type === "user" ? "ユーザーID" : "NG ワード"}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            flex={1}
            size="sm"
          />
          <Button onClick={handleAdd} size="sm">
            追加
          </Button>
        </Group>

        {entries.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            登録されていません
          </Text>
        ) : (
          <Stack gap="xs">
            {entries.map((entry) => (
              <EntryRow
                key={entry.value}
                entry={entry}
                isEditing={editing === entry.value}
                onEdit={() => setEditing(entry.value)}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
                onToggle={() => handleToggle(entry.value)}
                onDelete={() => handleDelete(entry.value)}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function EntryRow({
  entry,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onToggle,
  onDelete,
}: {
  entry: NgEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [value, setValue] = useState(entry.value);

  if (isEditing) {
    return (
      <Paper withBorder p="sm" radius="sm">
        <Group justify="space-between" align="center">
          <TextInput
            size="xs"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave(value)}
            placeholder="値を入力"
            autoFocus
            flex={1}
          />
          <Group gap={4}>
            <ActionIcon
              size="sm"
              color="green"
              onClick={() => onSave(value)}
              title="保存"
            >
              <MdCheck size={16} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              color="gray"
              onClick={onCancel}
              title="キャンセル"
            >
              <MdClose size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper withBorder p="sm" radius="sm">
      <Group justify="space-between" align="center">
        <Checkbox
          label={entry.value}
          checked={entry.enabled}
          onChange={onToggle}
          flex={1}
          size="sm"
          style={{ opacity: entry.enabled ? 1 : 0.6 }}
        />
        <Group gap={4}>
          <ActionIcon size="sm" onClick={onEdit} title="編集">
            <MdEdit size={16} />
          </ActionIcon>
          <ActionIcon size="sm" color="red" onClick={onDelete} title="削除">
            <MdDelete size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}
