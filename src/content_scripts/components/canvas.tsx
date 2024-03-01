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
  on_mode_change,
  on_threads_change,
  threads as getThreads,
} from "../state";

/**
 * @description
 * This function initializes the canvas for the niconico comments.
 */
async function canvasInit() {
  const video = (await find_element("video")) as HTMLVideoElement | undefined;
  if (!video) return;

  let niconiComments: NiconiComments | undefined;
  let threads = getThreads()?.threads;
  let loop: number = window.requestAnimationFrame(fn);

  const nico_id = "d-comments-nico";
  const prev_nico = document.getElementById(nico_id);
  let nico = prev_nico ?? document.createElement("canvas");
  if (!prev_nico) {
    const canvas = nico as HTMLCanvasElement;
    canvas.id = nico_id;
    // canvas.width = 1920;
    // canvas.height = 1080;
    Object.assign(canvas.style, {
      aspectRatio: "16/9",
      objectFit: "cover",
      width: "100%",
      height: "100%",
      position: "absolute",
      background: "transparent",
      zIndex: "2",
      visibility: mode().includes("nico") ? "visible" : "hidden",
    });
    nico = canvas;
    video.parentElement?.appendChild(nico);
  }

  function start(threads: Threads["threads"]) {
    nico.style.visibility = "visible";
    niconiComments = new NiconiComments(nico as HTMLCanvasElement, threads, {
      format: "v1",
      keepCA: true,
      scale: 1,
    });
    loop = window.requestAnimationFrame(fn);
  }
  function end() {
    nico.style.visibility = "hidden";
    niconiComments?.clear();
    window.cancelAnimationFrame(loop);
  }

  on_mode_change((_prev, next) => {
    threads = getThreads()?.threads;
    if (!threads) return;
    next.includes("nico") ? start(threads) : end();
  });
  on_threads_change((_prev, next) => {
    threads = next?.threads;
    if (mode().includes("nico") && threads) start(threads);
    else end();
  });

  function fn(callBack: number) {
    if (video && (Math.round(callBack / 10) * 10) % 10 === 0)
      niconiComments?.drawCanvas(Math.floor(video.currentTime * 100));
    window.requestAnimationFrame(fn);
  }

  if (mode().includes("nico") && threads) start(threads);
}

export default canvasInit;
