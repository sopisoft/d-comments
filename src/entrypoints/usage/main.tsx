import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import { ThemedMantineProvider } from "@/config/theme";
import { Usage } from "./usage";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ThemedMantineProvider>
      <Usage />
    </ThemedMantineProvider>
  );
}
