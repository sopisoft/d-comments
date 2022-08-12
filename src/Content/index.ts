import addMenu from "./menuPage";
import render from "./watchPage";

const url = new URL(window.location.href);
window.onload = async () => {
  switch (true) {
    case url.pathname.includes("ci_pc"):
      addMenu();
      break;
    case url.pathname.includes("sc_d_pc"): {
      const restApi = document.getElementById("restApiUrl") as HTMLDivElement;
      const res = await fetch(restApi.getAttribute("value") as string);
      const data = await res.json();
      const title = data["data"]["title"];
      document.title = title ?? document.title;
      break;
    }
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "renderComments" && url.pathname.includes("sc_d_pc")) {
    render(message.movieId);
    sendResponse("Trying to render comments");
  } else {
    sendResponse("Not supported");
  }
});
