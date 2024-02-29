import NiconiComments from "@xpadev-net/niconicomments";
import { useContext, useRef, useState } from "react";
import { ctx } from "../context";
import { find_element } from "../danime/dom";

function nico() {
  const context = useContext(ctx);
  const { videoId, threads } = context;

  const canvas = useRef<HTMLCanvasElement>(null);

  const [video, setVideo] = useState<HTMLVideoElement>();
  find_element("video").then((v) => {
    setVideo(v as HTMLVideoElement);
  });

  const [style, setStyle] = useState<{
    width: number;
    height: number;
  }>();

  function setCanvasStyle() {
    if (video) {
      if (video.clientWidth / video.clientHeight > 1920 / 1080) {
        const width = (video.clientHeight / 1080) * 1920;
        const height = video.clientHeight;
        setStyle({ width, height });
      } else {
        const width = video.clientWidth;
        const height = (video.clientWidth / 1920) * 1080;
        setStyle({ width, height });
      }
    }
  }

  (window || video)?.addEventListener("resize", () => setCanvasStyle());

  const data = threads?.threads;
  const canvas_element = canvas.current;
  if (canvas_element) {
    const nicoComments = new NiconiComments(canvas_element, data, {
      format: "v1",
      keepCA: true,
      scale: 1,
    });
    function render(callBack: number) {
      if (video && (Math.round(callBack / 10) * 10) % 10 === 0) {
        nicoComments.drawCanvas(Math.floor(video.currentTime * 100));
      }
      window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);
  }

  return (
    <canvas
      width={1920}
      height={1080}
      ref={canvas}
      style={{
        width: style?.width,
        height: style?.height,
      }}
      className="absolute top-1/2 left-1/2 -trasnlate-x-1/2 -trasnlate-y-1/2 bg-transparent z-[2]"
    />
  );
}

export default nico();
