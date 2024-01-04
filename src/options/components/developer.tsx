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

import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

function ForDeveloper() {
  const [storage, setStorage] = useState<Record<string, unknown>>({});

  useEffect(() => {
    browser.storage.local.get(null).then((result) => {
      setStorage(result);
    });
  });

  return (
    <div className="w-4/5 m-auto min-h-[80vh]">
      <p className="text-xl font-bold mx-2">Local Storage</p>
      <pre className="my-2 text-sm">{JSON.stringify(storage, null, 2)}</pre>
    </div>
  );
}

export default ForDeveloper;
