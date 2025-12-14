import { Badge, Button, Divider, Group, Paper, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { MdBlock, MdPersonOff } from "react-icons/md";
import { useConfigs } from "@/config/hooks/useConfigs";
import { useTheme } from "../hooks/useTheme";
import { type NgEntry, setConfig } from "../storage";
import { NgEntryRow } from "./NgEntryRow";

type PS = ReturnType<typeof useTheme>["styles"];

const useNgLists = () => {
  const { values } = useConfigs(["ng_user_ids", "ng_words"] as const);
  return {
    userEntries: (values.ng_user_ids ?? []) as NgEntry[],
    wordEntries: (values.ng_words ?? []) as NgEntry[],
    updateUser: useCallback((next: NgEntry[]) => setConfig("ng_user_ids", next), []),
    updateWord: useCallback((next: NgEntry[]) => setConfig("ng_words", next), []),
  } as const;
};

export function NgListPanel() {
  const { styles: ps } = useTheme();
  const { userEntries, wordEntries, updateUser, updateWord } = useNgLists();
  return (
    <Stack gap="lg">
      <Group gap="sm" align="center">
        <MdBlock size={24} style={{ color: ps.accent }} />
        <Title order={3} fw={600} c={ps.text.primary}>
          NG 管理
        </Title>
      </Group>
      <Divider color={ps.border.subtle} />
      <Section
        type="user"
        title="NG ユーザー"
        description="指定したユーザーIDのコメントを非表示にします"
        placeholder="ユーザーIDを入力"
        entries={userEntries}
        onUpdate={updateUser}
        icon={<MdPersonOff size={18} />}
        ps={ps}
      />
      <Divider color={ps.border.subtle} />
      <Section
        type="word"
        title="NG ワード"
        description="コメント内に含まれるワードを除外します。正規表現も使用可能です。"
        placeholder="(ねた|ネタ)|(ばれ|バレ)"
        entries={wordEntries}
        onUpdate={updateWord}
        icon={<MdBlock size={18} />}
        ps={ps}
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
  icon,
  ps,
}: {
  type: "user" | "word";
  title: string;
  description: string;
  placeholder: string;
  entries: NgEntry[];
  onUpdate: (list: NgEntry[]) => Promise<void>;
  icon: React.ReactNode;
  ps: PS;
}) {
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const { bg } = ps.pairs;
  const handleAdd = async () => {
    const v = input.trim();
    if (!v || entries.some((e) => e.value === v)) return;
    await onUpdate([...entries, { value: v, enabled: true }]);
    setInput("");
  };
  const handleSave = async (editValue: string) => {
    const v = editValue.trim();
    if (v) await onUpdate(entries.map((e) => (e.value === editing ? { ...e, value: v } : e)));
    setEditing(null);
  };
  const boxStyle = {
    background: bg.elevated.background,
    border: `1px solid ${ps.border.default}`,
  };
  return (
    <Paper p="md" radius="md" style={boxStyle}>
      <Stack gap="md">
        <Group gap="sm" align="flex-start">
          <ThemeIcon color="accent" size={34} radius="md">
            {icon}
          </ThemeIcon>
          <div style={{ flex: 1 }}>
            <Group gap="xs">
              <Title order={5} fw={600} c={ps.text.primary}>
                {title}
              </Title>
              <Badge size="sm" variant="light" color="dark">
                {entries.length}
              </Badge>
            </Group>
            <Text size="sm" c={ps.text.muted} mt={4}>
              {description}
            </Text>
          </div>
        </Group>
        <Paper p="sm" radius="sm" style={{ background: bg.base.background, border: ps.panel.border }}>
          <Group align="flex-end" gap="sm">
            <TextInput
              label={type === "user" ? "ユーザーID" : "NG ワード"}
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              flex={1}
              size="sm"
              styles={{
                input: {
                  background: bg.surface.background,
                  borderColor: ps.border.default,
                },
                label: { color: ps.text.primary },
              }}
            />
            <Button onClick={handleAdd} size="sm" variant="light" disabled={!input.trim()} c={ps.text.primary}>
              追加
            </Button>
          </Group>
        </Paper>
        {entries.length === 0 ? (
          <Paper
            p="lg"
            radius="sm"
            ta="center"
            style={{
              background: bg.base.background,
              border: `1px dashed ${ps.border.subtle}`,
            }}
          >
            <Text size="sm" c={ps.text.muted}>
              登録されていません
            </Text>
          </Paper>
        ) : (
          <Stack gap="xs">
            {entries.map((entry) => (
              <NgEntryRow
                key={entry.value}
                entry={entry}
                isEditing={editing === entry.value}
                onEdit={() => setEditing(entry.value)}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
                onToggle={() =>
                  onUpdate(entries.map((e) => (e.value === entry.value ? { ...e, enabled: !e.enabled } : e)))
                }
                onDelete={() => onUpdate(entries.filter((e) => e.value !== entry.value))}
                ps={ps}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
