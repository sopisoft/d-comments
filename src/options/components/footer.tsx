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

import { useEffect, useRef, useState } from "react";
import browser from "webextension-polyfill";

function Footer() {
  const manifest = browser.runtime.getManifest();

  const year = useRef(2022);

  useEffect(() => {
    fetch(browser.runtime.getURL("meta.json"))
      .then((response) => response.json())
      .then((data) => {
        year.current = data.year;
      });
  }, []);

  return (
    <footer className="flex flex-row w-full h-16 p-2 text-sm text-center border-spacing-1 border-t border-gray-200">
      <a
        href="https://github.com/sopisoft/d-comments"
        target="_blank"
        rel="noreferrer"
        className="flex flex-row items-center justify-center w-full h-full"
      >
        <span className="mx-3">{manifest.name}</span>
        <span className="mx-1">2022 - {year.current}</span>
        <span className="mx-1">{browser.runtime.getManifest().author}</span>
        <span className="mx-3">Version {manifest.version}</span>
      </a>
    </footer>
  );
}

export default Footer;
