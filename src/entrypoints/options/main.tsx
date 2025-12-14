import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import { ThemedMantineProvider } from "@/config/theme";
import { Options } from "./options";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ThemedMantineProvider>
      <Options />
    </ThemedMantineProvider>
  );
}
