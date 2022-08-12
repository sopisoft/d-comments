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

const addMenu = () => {
  const items = document.querySelectorAll(".itemModule.list a");
  for (const item of items) {
    const partID = item?.getAttribute("href")?.replace(/[^0-9]/g, "");

    const a = document.createElement("a");
    a.innerText = "コメントを表示しながら再生";
    a.setAttribute("href", "sc_d_pc?partId=" + partID);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
    a.setAttribute(
      "style",
      "font-family:inherit;font-size:12px;color: rgb(51 51 51); background-color: rgb(255 255 255);height:24px;text-align:center;"
    );
    item.parentElement?.parentElement?.appendChild(a);
  }
};

export default addMenu;
