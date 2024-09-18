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

function make_iframe() {
  const version = browser.runtime.getManifest().version;

  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "720px";
  const url = new URL("https://forms.office.com/Pages/ResponsePage.aspx");
  url.searchParams.append(
    "id",
    "DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABWTsPtUNkUyNzMwSFkyNEVENTExTVdINUNBUDBFNC4u"
  );
  url.searchParams.append("r4fc5e3af4be04561a824b6564847f811", version);
  url.searchParams.append("embed", "true");
  iframe.src = url.toString();
  iframe.allowFullscreen = true;
  iframe.style.border = "none";
  return iframe.outerHTML;
}

function Form() {
  const version = browser.runtime.getManifest().version;

  return (
    <div className="w-4/5 m-auto">
      <div className="flex flex-row m-8 items-baseline text-xl">
        <span className="font-bold">Form</span>
        <span className="px-4 py-0">お使いのバージョン: {version}</span>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div dangerouslySetInnerHTML={{ __html: make_iframe() }} />
    </div>
  );
}

export default Form;
