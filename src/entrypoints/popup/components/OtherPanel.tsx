import { Accordion, Anchor, Code, Stack, Text, Title } from "@mantine/core";

function form_url(): URL {
  const version = browser.runtime.getManifest().version;
  const url = new URL("https://forms.office.com/Pages/ResponsePage.aspx");
  url.searchParams.append(
    "id",
    "DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABWTsPtUNkUyNzMwSFkyNEVENTExTVdINUNBUDBFNC4u"
  );
  url.searchParams.append("r4fc5e3af4be04561a824b6564847f811", version);
  return url;
}

function OtherPanel() {
  const [stored, setStored] = useState<Record<string, unknown>>({});
  useEffect(() => {
    browser.storage.local.get(null).then((items) => {
      setStored(items);
    });
  }, []);

  const manifest = browser.runtime.getManifest();

  return (
    <Stack>
      <Stack align="center" gap="xs">
        <Title order={2}>{manifest.name}</Title>
        <Text size="sm" c="dimmed">
          {manifest.version}
        </Text>
      </Stack>

      <Stack m="md" gap="xs">
        <Anchor
          href={form_url().toString()}
          target="_blank"
          rel="noopener noreferrer"
        >
          不具合報告
        </Anchor>
        <Anchor
          href={browser.runtime.getURL("/usage.html").toString()}
          target="_blank"
          rel="noopener noreferrer"
        >
          使用方法
        </Anchor>
        <Anchor
          href={browser.runtime.getURL("/options.html").toString()}
          target="_blank"
          rel="noopener noreferrer"
        >
          詳細設定ページを開く
        </Anchor>
      </Stack>

      <Accordion variant="separated">
        <Accordion.Item value="storage">
          <Accordion.Control>ストレージの内容</Accordion.Control>
          <Accordion.Panel>
            <Accordion variant="contained" radius="md">
              {Object.entries(stored).map(([key, value]) => (
                <Accordion.Item value={key} key={key}>
                  <Accordion.Control>{key}</Accordion.Control>
                  <Accordion.Panel>
                    <Code block>{JSON.stringify(value, null, 2)}</Code>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}

export default OtherPanel;
