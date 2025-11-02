import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { theme } from "@/theme";
import { Popup } from "./popup";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <MantineProvider theme={theme}>
      <Popup />
    </MantineProvider>
  );
}
