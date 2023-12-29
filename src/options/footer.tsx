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

import React from "react";
import browser from "webextension-polyfill";

function Footer() {
  return (
    <footer>
      <span className="info">
        {browser.runtime.getManifest().name}
        &nbsp;-&nbsp;Version&nbsp;{browser.runtime.getManifest().version}
      </span>
      <span className="info">
        &copy;&nbsp;{new Date().getFullYear()}&nbsp;
        {browser.runtime.getManifest().author}
      </span>
      <div className="links">
        <span className="link">
          <a
            href="https://forms.office.com/r/JR9KksWHJD"
            target="_blank"
            rel="noreferrer"
          >
            <i className="codicon codicon-feedback" />
            &nbsp;
            <span>FeedBack</span>
          </a>
        </span>
        <span className="link">
          <a
            href="https://github.com/gobosan/d-comments"
            target="_blank"
            rel="noreferrer"
          >
            <i className="codicon codicon-mark-github" />
            &nbsp;
            <span>GitHub</span>
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
