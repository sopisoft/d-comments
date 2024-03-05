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

import { type config, type config_keys, getConfig } from "@/config";
import NiconiComments, {
  type Options,
  type V1Thread,
} from "@xpadev-net/niconicomments";
import browser from "webextension-polyfill";
import { find_element } from "../danime/dom";
import {
  mode,
  on_mode_change,
  on_partId_change,
  on_threads_change,
  threads as getThreads,
} from "../state";

const nico_id = "d-comments-nico";

let video: HTMLVideoElement | null;
let nico: HTMLCanvasElement | null;
let nc: NiconiComments | undefined;
let loop: number | undefined;

async function start(threads: Threads["threads"]) {
  console.log("nico_started", "threads", threads);
  if (nico && video && threads.length > 0) {
    nico.style.visibility = "visible";
    const v1: V1Thread[] = threads;
    const renderer = new NiconiComments.internal.renderer.CanvasRenderer(nico);
    const nc_options: Options = {
      format: "v1",
      keepCA: true,
      scale: 1,
    };
    nc = new NiconiComments(renderer, v1, nc_options);

    if (loop) cancelAnimationFrame(loop);
    function loop_fn(callBack: number) {
      if (video && nc && (Math.round(callBack / 10) * 10) % 10 === 0) {
        nc.drawCanvas(video.currentTime * 100);
      }
      requestAnimationFrame(loop_fn);
    }
    loop = requestAnimationFrame(loop_fn);
  } else if (!nico) {
    nico = await find_element(nico_id);
    setTimeout(() => canvasInit().then(() => start(threads)), 0);
    return;
  } else if (!video) {
    video = await find_element("video");
    setTimeout(() => start(threads), 0);
  }
}

function end() {
  if (nico && nico.style.visibility !== "hidden") {
    console.log("nico_ended");
    nico.style.visibility = "hidden";
  }
  if (loop) cancelAnimationFrame(loop);
  if (nc) nc.clear();
}

/**
 * @description
 * This function initializes the canvas for the niconico comments.
 */
async function canvasInit() {
  video = await find_element("video");
  const prev_nico = document.getElementById(nico_id) as HTMLCanvasElement;
  nico = prev_nico ?? document.createElement("canvas");
  if (!prev_nico) {
    nico.id = nico_id;
    nico.width = 1920;
    nico.height = 1080;
    Object.assign(nico.style, {
      objectFit: "contain",
      width: "100%",
      height: "100%",
      position: "absolute",
      background: "transparent",
      opacity: `${
        ((await getConfig("comment_area_opacity_percentage")) as number) / 100
      }`,
      zIndex: "2",
    });

    const parent = video?.parentElement;
    const parent_parent = parent?.parentElement;
    if (parent_parent && document.body.contains(parent_parent)) {
      parent.appendChild(nico);
    } else {
      setTimeout(canvasInit, 100);
      return;
    }
  }

  on_mode_change(async (_prev, next) => {
    const threads = getThreads()?.threads;
    if (next.includes("nico") && threads && threads.length > 0) {
      console.log("nico_mode_chamged", next, "threads", threads);
      start(threads);
    } else end();
  });
  on_threads_change(async (_prev, next) => {
    const modes = mode();
    const threads = next?.threads;
    if (modes.includes("nico") && threads && threads.length > 0) {
      console.log("nico_threads_changed", next, "mode", modes);
      start(threads);
    } else end();
  });
  on_partId_change(() => end());

  browser.storage.onChanged.addListener(async (changes) => {
    for (const key in changes) {
      switch (key as config_keys) {
        case "comment_area_opacity_percentage":
          if (nico)
            nico.style.opacity = (changes[key].newValue / 100).toString();
          break;
      }
    }
  });
}

export default canvasInit;
