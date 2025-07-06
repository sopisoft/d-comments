import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import { theme } from "@/theme";
import App from "./usage";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  );
}
