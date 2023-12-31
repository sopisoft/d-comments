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
import { getConfig } from "@/content_scripts/config";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import browser, { Tabs } from "webextension-polyfill";
import "../index.css";
import api from "./api/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import search from "./api/search";
import JsonFileInput from "./components/json_file_input";
import Menu from "./components/menu";
import VideoIdInput from "./components/video_id_input";

export const Popup = () => {
  const [tabPage, setTabPage] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<VideoId>();
  const [word, setWord] = useState<searchApi["data"]["word"]>("");
  const [owner, setOwner] = useState<Owner>();
  const [snapshot, setSnapshot] = useState<Snapshot>();

  const { toast } = useToast();

  function ErrorMessage(props: {
    error?: Error;
    message?: { title: string; description: string };
  }) {
    toast({
      title: props.message?.title || props.error?.name || "エラー",
      description:
        props.message?.description ||
        props.error?.message ||
        "予期しないエラーが発生しました。",
    });
  }

  /**
   * 作品視聴ページか判定
   * @returns boolean
   */
  const isWatchPage = async (location?: Tabs.Tab["url"]) => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const url = new URL(location ?? tabs[0]?.url ?? "");
    return url.pathname === "/animestore/sc_d_pc";
  };

  const render_comments = async (videoId: VideoId) => {
    if (!(await isWatchPage())) {
      ErrorMessage({
        message: {
          title: "作品視聴ページ以外で実行されました。",
          description: "render_comments は作品視聴ページでのみ実行できます。",
        },
      });
      return;
    }
    const query: {
      type: renderCommentsApi["type"];
      data: renderCommentsApi["data"];
      active_tab: renderCommentsApi["active_tab"];
    } = {
      type: "render_comments",
      data: {
        videoId: videoId,
      },
      active_tab: true,
    };
    return await api(query).catch((error) => {
      ErrorMessage({ error: error });
    });
  };

  async () => {
    (await isWatchPage()) && setTabPage(true);

    getConfig("show_last_searched_video_id", (value) => {
      value === true &&
        setVideoId(window.localStorage.getItem("videoId") as VideoId);
    });
    getConfig("auto_search", async (value) => {
      if (value === true) {
        const work_title = await browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            return tabs[0]?.title ?? "";
          });

        setWord(work_title);
        search(work_title).then((res) => {
          typeof res === typeof Error
            ? ErrorMessage({ error: res as Error })
            : setSnapshot(res as Snapshot);
        });
      }
    });
  };

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
        <Button
          onClick={() => {
            render_comments(videoId as VideoId);
          }}
        >
          Render Comments
        </Button>
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
