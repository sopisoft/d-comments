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

import NiconiComments from "@xpadev-net/niconicomments";
import { find_element } from "../danime/dom";
import {
  mode,
  onOpacityChange,
  onTextColorChange,
  on_mode_change,
  on_threads_change,
  opacity,
  textColor,
  threads as getThreads,
} from "../state";

const video = (await find_element("video")) as HTMLVideoElement | undefined;

let nc: NiconiComments | undefined;
let nico: HTMLCanvasElement;

const nico_id = "d-comments-nico";

const nc_options = {
  keepCA: true,
  scale: 1,
};

function start(threads: Threads["threads"]) {
  console.log("nico_started");
  nico.style.visibility = "visible";
  nc = new NiconiComments(nico, threads, nc_options);
}
function end() {
  console.log("nico_ended");
  nico.style.visibility = "hidden";
}

onTextColorChange((_prev, next) => {
  nico.style.color = next;
});
onOpacityChange((_prev, next) => {
  nico.style.opacity = (next / 100).toString();
});
on_mode_change(async (_prev, next) => {
  const threads = (await getThreads())?.threads;
  console.log("nico_mode_chamged", next, "threads", threads);
  if (next.includes("nico") && threads) start(threads);
  else end();
});
on_threads_change(async (_prev, next) => {
  const modes = await mode();
  console.log("nico_threads_changed", next, "mode", modes);
  const threads = next?.threads;
  if (modes.includes("nico") && threads) start(threads);
  else end();
});

/**
 * @description
 * This function initializes the canvas for the niconico comments.
 */
async function canvasInit() {
  const prev_nico = document.getElementById(nico_id);
  nico = (prev_nico ?? document.createElement("canvas")) as HTMLCanvasElement;
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
      color: textColor(),
      opacity: ((await opacity()) / 100).toString(),
      zIndex: "2",
      visibility: (await mode()).includes("nico") ? "visible" : "hidden",
    });
    video?.parentElement?.appendChild(nico);
  }

  requestAnimationFrame(function loop(callBack: number) {
    if (video && (Math.round(callBack / 10) * 10) % 10 === 0)
      nc?.drawCanvas(Math.floor(video.currentTime * 100));
    window.requestAnimationFrame(loop);
  });
}

export default canvasInit;
