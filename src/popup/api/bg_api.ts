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

import send_message from "./send_message";

async function bg_message_apis(query: {
  type: bg_message_apis["type"];
  data: bg_message_apis["data"];
  active_tab?: bg_message_apis["active_tab"];
}): Promise<bg_message_apis["response"]> {
  query.active_tab ??= false;
  return await send_message(query);
}

export default bg_message_apis;
