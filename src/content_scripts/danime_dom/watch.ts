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

/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 */
export const setWorkInfo = () => {
	if (document.getElementById("backInfo")?.classList.contains("loaded")) {
		const workName = (
			document.getElementsByClassName("backInfoTxt1")[0] as HTMLElement
		).innerText;
		const partDisplayNumber = (
			document.getElementsByClassName("backInfoTxt2")[0] as HTMLElement
		).innerText;
		const partTitle = (
			document.getElementsByClassName("backInfoTxt3")[0] as HTMLElement
		).innerText;
		const title = `${workName} ${partDisplayNumber} ${partTitle}`;
		document.title = title;
		const partExp = (
			document.getElementsByClassName("backInfoTxt4")[0] as HTMLElement
		).innerText;
		document
			.querySelector("meta[name=Description]")
			?.setAttribute("content", partExp);
	} else {
		setTimeout(setWorkInfo, 60);
	}
};
