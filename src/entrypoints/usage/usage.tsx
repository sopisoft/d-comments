import { AppShell, Burger, Container, Group, NavLink, Title, Typography } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { useTheme } from "@/config";
import MD from "./usage.md?raw";
import "./usage.css";

type TocItem = { level: number; text: string; id: string };

const extractToc = (c: HTMLElement): TocItem[] =>
  Array.from(c.querySelectorAll("h1, h2, h3")).map((h) => ({
    level: Number.parseInt(h.tagName.substring(1), 10),
    text: h.textContent || "",
    id: h.id,
  }));
const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el)
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
};

export function Usage() {
  const { styles: ps } = useTheme();
  const [opened, { toggle }] = useDisclosure();
  const [toc, setToc] = useState<TocItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const updateToc = () => {
      const n = extractToc(container);
      if (n.length) setToc((p) => (JSON.stringify(p) === JSON.stringify(n) ? p : n));
    };
    const obs = new MutationObserver(updateToc);
    obs.observe(container, { childList: true, subtree: true });
    updateToc();
    return () => obs.disconnect();
  }, []);

  const shellStyles = {
    root: { backgroundColor: ps.bg.base },
    main: { backgroundColor: ps.bg.base },
    header: {
      backgroundColor: ps.bg.elevated,
      borderBottom: `1px solid ${ps.border.default}`,
    },
    navbar: {
      backgroundColor: ps.bg.elevated,
      borderRight: `1px solid ${ps.border.default}`,
    },
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
      styles={shellStyles}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1} c={ps.accent}>
            つかいかた
          </Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {toc.map((item) => (
          <NavLink
            key={item.id}
            href={`#${item.id}`}
            label={item.text}
            c={ps.text.primary}
            style={{ paddingLeft: `${(item.level - 1) * 1.5}rem` }}
            onClick={(e) => {
              e.preventDefault();
              scrollToId(item.id);
            }}
          />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Container ref={contentRef} size="md" pb="lg">
          <Typography>
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
              {MD}
            </Markdown>
          </Typography>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
