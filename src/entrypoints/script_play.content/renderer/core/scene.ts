import { Application, Container } from "pixi.js";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";

export type PixiScene = {
  app: Application;
  layer: Container;
};

export async function createPixiScene(
  overlay: HTMLElement
): Promise<PixiScene> {
  const app = new Application();
  await app.init({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
  });
  app.ticker.maxFPS = 60;

  overlay.appendChild(app.canvas);
  Object.assign(app.canvas.style, {
    objectFit: "contain",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
    display: "block",
    pointerEvents: "none",
    zIndex: "2",
  });

  const layer = new Container();
  layer.eventMode = "passive";
  app.stage.addChild(layer);

  return { app, layer };
}
