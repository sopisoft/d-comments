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

import { useRef } from "react";
import { set_threads } from "../state";

function JsonInput() {
  const input = useRef<HTMLInputElement>(null);

  function file_input_handler() {
    const [file] = input.current?.files || [null];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString();
      if (!result) return;
      const json = JSON.parse(result);
      if (!json?.threadData) return;
      const threads = json.threadData.data;
      set_threads(threads);
    };

    if (file) reader.readAsText(file);
  }

  return (
    <input
      type="file"
      ref={input}
      aria-label="コメントファイルを選択"
      className="fixed top-0 left-0 hidden w-full h-full z-50"
      accept=".json"
    />
  );
}

export default JsonInput;
