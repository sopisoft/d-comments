import { Paper, Stack, Text, Title } from "@mantine/core";
import { MdFeedback } from "react-icons/md";
import { ui } from "@/config/theme";
import { useTheme } from "../hooks/useTheme";

const makeIframe = () => {
  const version = browser.runtime.getManifest().version;
  const url = new URL("https://forms.office.com/Pages/ResponsePage.aspx");
  url.searchParams.append("id", "DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABWTsPtUNkUyNzMwSFkyNEVENTExTVdINUNBUDBFNC4u");
  url.searchParams.append("r4fc5e3af4be04561a824b6564847f811", version);
  url.searchParams.append("embed", "true");
  return `<iframe width="100%" height="640px" src="${url}" allowfullscreen style="border:none;border-radius:${ui.radius.lg}px"></iframe>`;
};

export function SurveyFormPanel() {
  const { styles: ps } = useTheme();
  const panelStyle = {
    background: ps.pairs.bg.elevated.background,
    border: ps.panel.border,
  };
  return (
    <Stack gap="lg" maw="56rem" mx="auto">
      <Paper p="md" radius="md" style={panelStyle}>
        <Stack gap="xs">
          <Title order={4} fw={600} c={ps.accent}>
            <MdFeedback size={20} style={{ marginRight: 8, verticalAlign: "middle" }} />
            フィードバック
          </Title>
          <Text size="sm" c={ps.text.muted}>
            不具合報告や機能リクエストをお寄せください
          </Text>
        </Stack>
      </Paper>
      <Paper
        p="md"
        radius="md"
        style={{ ...panelStyle, overflow: "hidden" }}
        ref={(el) => {
          if (el) el.innerHTML = makeIframe();
        }}
      />
    </Stack>
  );
}
