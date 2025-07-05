import {
  AppShell,
  Box,
  Burger,
  Container,
  Group,
  NavLink,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import MD from "./usage.md?raw";
import "./usage.css";
import "github-markdown-css";

interface TocItem {
  level: number;
  text: string;
  id: string;
}

function Usage() {
  const [opened, { toggle }] = useDisclosure();
  const [toc, setToc] = useState<TocItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      const headings = container.querySelectorAll("h1, h2, h3");
      if (headings.length > 0) {
        const newToc = Array.from(headings).map((heading) => ({
          level: Number.parseInt(heading.tagName.substring(1), 10),
          text: heading.textContent || "",
          id: heading.id,
        }));

        setToc((prevToc) => {
          if (JSON.stringify(prevToc) !== JSON.stringify(newToc)) {
            return newToc;
          }
          return prevToc;
        });
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    const headings = container.querySelectorAll("h1, h2, h3");
    if (headings.length > 0) {
      const newToc = Array.from(headings).map((heading) => ({
        level: Number.parseInt(heading.tagName.substring(1), 10),
        text: heading.textContent || "",
        id: heading.id,
      }));
      setToc(newToc);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1}>つかいかた</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {toc.map((item) => (
          <NavLink
            key={item.id}
            href={`#${item.id}`}
            label={item.text}
            style={{ paddingLeft: `${(item.level - 1) * 1.5}rem` }}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              if (element) {
                const headerHeight = 80;
                const elementPosition =
                  element.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Container ref={contentRef} size="md" pb="lg">
          <Box className="markdown-body" mb="lg">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
              {MD}
            </Markdown>
          </Box>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Usage;
