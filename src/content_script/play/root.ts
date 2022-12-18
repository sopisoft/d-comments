import * as Config from "../config";

const configs = {
  scrollBar: false,
  overlay: false,
  width: 300,
  height: 100,
  top: 0,
  left: 0,
  r: 0,
  g: 0,
  b: 0,
  a: 0.35,
  commentsColor: "#FFFFFF",
};

const set = () => {
  if (
    window.location.href.match(
      /https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/
    )
  ) {
    const style = document.createElement("style");
    style.id = "d-comments-style-root";
    const rgba = `${configs.r} ${configs.g} ${configs.b} / ${configs.a}%`;
    style.innerHTML = `
:root {
  --d-comments-text-color:${configs.commentsColor};
  --d-comments-container-position:${configs.overlay ? "absolute" : "relative"};
  --d-comments-container-z-index:${configs.overlay ? 1000 : 1};
  --d-comments-container-width:${configs.width}px;
  --d-comments-container-height:${configs.overlay ? configs.height : 100}vh;
  --d-comments-container-top:${configs.overlay ? configs.top : 0}%;
  --d-comments-container-left:${configs.overlay ? configs.left : 0}%;
  --d-comments-container-background:rgba(${rgba})
}
${
  configs.scrollBar
    ? `
    #d-comments-container ul::-webkit-scrollbar {
      display:block;
    }
    #d-comments-container ul::-webkit-scrollbar-track{
      background-color: #7a787830;
    }
    #d-comments-container ul::-webkit-scrollbar-thumb{
      background-color: #f9fafe4a;
    }`
    : `#d-comments-container ul::-webkit-scrollbar {
      display:none;
    }`
}`;
    document.getElementById("d-comments-style-root")?.remove();
    document.head.appendChild(style);
  }
};

const hexToRgb = (color: string) => {
  return Object.fromEntries(
    (
      (color.match(/^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/) ? color : "000")
        .replace(/^#?(.*)$/, (_, hex) =>
          hex.length == 3 ? hex.replace(/./g, "$&$&") : hex
        )
        .match(/../g) ?? []
    ).map((c: string, i: number) => ["rgb".charAt(i), parseInt("0x" + c)])
  ) as { r: number; g: number; b: number };
};

const init = () => {
  Config.getConfig("コメント欄のスクールバーを表示する", (value) => {
    configs.scrollBar = value as boolean;
  });
  Config.getConfig("作品再生画面にオーバーレイ表示", (value) => {
    configs.overlay = value as boolean;
  });
  Config.getConfig("コメント欄の幅 (px)", (value) => {
    configs.width = value as number;
  });
  Config.getConfig("コメント欄の高さ (%)", (value) => {
    configs.height = value as number;
  });
  Config.getConfig("画面の上部分からの距離", (value) => {
    configs.top = value as number;
  });
  Config.getConfig("画面の左部分からの距離", (value) => {
    configs.left = value as number;
  });
  Config.getConfig("コメント欄の背景色", (value) => {
    configs.r = hexToRgb(value as string).r;
    configs.g = hexToRgb(value as string).g;
    configs.b = hexToRgb(value as string).b;
  });
  Config.getConfig("コメント欄の背景不透明度 (%)", (value) => {
    configs.a = value as number;
  });
  Config.getConfig("コメントの文字色", (value) => {
    configs.commentsColor = value as string;
    set();
  });
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case "コメント欄のスクールバーを表示する": {
        configs.scrollBar = newValue;
        set();
        break;
      }
      case "作品再生画面にオーバーレイ表示": {
        configs.overlay = newValue;
        set();
        break;
      }
      case "コメント欄の幅 (px)": {
        configs.width = newValue;
        set();
        break;
      }
      case "コメント欄の高さ (%)": {
        configs.height = newValue;
        set();
        break;
      }
      case "画面の上部分からの距離": {
        configs.top = newValue;
        set();
        break;
      }
      case "画面の左部分からの距離": {
        configs.left = newValue;
        set();
        break;
      }
      case "コメント欄の背景色": {
        configs.r = hexToRgb(newValue).r;
        configs.g = hexToRgb(newValue).g;
        configs.b = hexToRgb(newValue).b;
        set();
        break;
      }
      case "コメント欄の背景不透明度 (%)": {
        configs.a = newValue;
        set();
        break;
      }
      case "コメントの文字色": {
        configs.commentsColor = newValue;
        set();
        break;
      }
    }
  }
});

export default init;
