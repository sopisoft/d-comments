/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";
import { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import Menu from "../content_scripts/components/menu";

export const VideoIdContext = createContext<{
  videoId: string;
  setVideoId: (videoId: string) => void;
}>({ videoId: "", setVideoId: () => {} });

export const Popup = () => {
  const manifest = browser.runtime.getManifest();
  const { name, version } = manifest;

  return (
    <div className="w-96 h-full p-4">
      <span className="text-lg">{name}</span>
      <Menu />
      <span className="flex justify-center text-sm mt-3">{`Version : ${version}`}</span>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ThemeProvider>
      <Popup />
      <Toaster />
    </ThemeProvider>
  );
}
