import type { SidebarConfig } from "../context/SidebarContext";

export type ThemeProps = {
  palette: SidebarConfig["palette"];
  showNicoru: boolean;
  alpha: SidebarConfig["alpha"];
  fontSizePx?: number;
};
