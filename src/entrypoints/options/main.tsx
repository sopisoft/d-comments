import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { theme } from "@/theme";
import { Options } from "./options";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <MantineProvider theme={theme}>
      <Options />
    </MantineProvider>
  );
}
