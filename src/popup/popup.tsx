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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import "../index.css";
import JsonFileInput from "./components/json_file_input";
import Menu from "./components/menu";
import Search from "./components/search";
import VideoIdInput from "./components/video_id_input";

export const Popup = () => {
  return (
    <Card className="w-[32rem] h-[32rem]">
      <CardHeader>
        <CardTitle>{browser.runtime.getManifest().name} Popup Page</CardTitle>
        <CardDescription className="text-stone-900">
          <Menu />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VideoIdInput />
        <JsonFileInput />
        <Search />
      </CardContent>
    </Card>
  );
};

createRoot(document.body).render(
  <ThemeProvider>
    <Popup />
    <Toaster />
  </ThemeProvider>
);
