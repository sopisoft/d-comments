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

import browser from "webextension-polyfill";

const iframe = document.createElement("iframe");
iframe.width = "1280px";
iframe.height = "800px";
iframe.src =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABWTsPtUNkUyNzMwSFkyNEVENTExTVdINUNBUDBFNC4u&embed=true";
iframe.allowFullscreen = true;
const iframe_string = iframe.outerHTML;

const version = browser.runtime.getManifest().version;

function Form() {
  return (
    <div className="w-4/5 m-auto min-h-[80vh]">
      <div className="flex flex-row items-baseline text-xl">
        <p className="font-bold m-2">Form</p>
        <p className="m-2">お使いのバージョン: {version}</p>
      </div>
      <div
        className="w-full max-w-screen-xl h-full max-h-svh m-8"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: iframe_string }}
      />
    </div>
  );
}

export default Form;
