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

function use_state<T>(initial: T) {
  let state = initial;
  const listeners = new Set<(prev: T, next: T) => void>();

  const get_state = () => state;

  const set_state = (next: T) => {
    if (Object.is(state, next)) return;
    const prev = state;
    state = next;
    for (const listener of listeners) listener(prev, next);
  };

  const on_change = (listener: (prev: T, next: T) => void) => {
    listeners.add(listener);
    return {
      unsubscribe: () => {
        listeners.delete(listener);
      },
    };
  };

  return [get_state, set_state, on_change] as const;
}

export const [mode, set_mode, on_mode_change] = use_state<("list" | "nico")[]>(
  []
);

export const [partId, set_partId, on_partId_change] = use_state<
  string | undefined
>(undefined);

export const [threads, set_threads, on_threads_change] = use_state<
  Threads | undefined
>(undefined);
