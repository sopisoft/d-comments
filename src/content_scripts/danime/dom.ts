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

export async function find_element(
  selector: string,
  trials = 100,
  interval = 100
) {
  for (let i = 0; i < trials; i++) {
    const element = document.querySelector(selector);
    if (element !== null) return element;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

export async function find_elements(
  selector: string,
  trials = 100,
  interval = 100
): Promise<NodeListOf<Element>> {
  for (let i = 0; i < trials; i++) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0)
      await new Promise((resolve) => setTimeout(resolve, interval));
    else break;
  }
  return document.querySelectorAll(selector);
}
