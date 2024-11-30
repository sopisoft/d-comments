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
  const listeners = [] as ((prev: T, next: T) => void)[];

  function get_state() {
    return state;
  }

  function set_state(next: T) {
    const prev = state;
    if (typeof next === "object") {
      if (JSON.stringify(prev) === JSON.stringify(next)) return;
    } else if (prev === next) return;
    state = next;
    for (const listener of listeners) listener(prev, next);
  }

  function on_change(listener: (prev: T, next: T) => void) {
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }

  return [get_state, set_state, on_change] as const;
}

export const [threads, set_threads, on_threads_change] = use_state<
  Threads | undefined
>(undefined);

export const [messages, set_messages, on_messages_change] = use_state<
  (Error | message)[]
>([]);

type message = { title: string; description: string };
export function push_message(message: Error | message) {
  set_messages(messages().concat(message));
}
