import { HelpCircle, Settings } from "lucide-react";
import React from "react";
import browser from "webextension-polyfill";

function Menu() {
  return (
    <div className="flex flex-row space-x-2 justify-evenly items-center">
      <a
        href={browser.runtime.getURL("options.html")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center space-x-2 m-2"
      >
        <Settings className="w-5 h-5 mr-2" />
        設定
      </a>
      <a
        href={browser.runtime.getURL("how_to_use.html")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center space-x-2 m-2"
      >
        <HelpCircle className="w-5 h-5 mr-2" />
        つかいかた
      </a>
    </div>
  );
}

export default Menu;
