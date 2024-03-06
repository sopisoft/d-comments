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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function find_element<T extends Element = Element>(
  selector: string,
  trials = 50,
  interval = 100
) {
  for (let i = 0; i <= trials; i++) {
    const element = document.querySelector(selector);
    if (element !== null) return element as T | null;
    await sleep(interval);
  }
  return null;
}

export async function find_elements<T extends Element = Element>(
  selector: string,
  target: Element | Document = document,
  trials = 50,
  interval = 100
) {
  for (let i = 0; i < trials; i++) {
    const elements = target.querySelectorAll(selector);
    if (elements.length > 0) return elements as NodeListOf<T>;
    await sleep(interval);
  }
  return target.querySelectorAll(selector) as NodeListOf<T>;
}
