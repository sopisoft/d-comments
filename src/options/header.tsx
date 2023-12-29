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

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Settings } from "lucide-react";
import React from "react";

function Header() {
  return (
    <header className="flex items-center justify-between w-full px-4 py-2 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Settings className="w-10 h-10" />
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        設定
      </h1>
      <ModeToggle />
    </header>
  );
}

export default Header;
