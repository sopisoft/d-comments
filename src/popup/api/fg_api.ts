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

async function fg_message_apis(query: {
  type: fg_message_apis["type"];
  data: fg_message_apis["data"];
  active_tab?: fg_message_apis["active_tab"];
}): Promise<fg_message_apis["response"] | Error> {
  query.active_tab ??= true;
  return (await send_message(query)) as fg_message_apis["response"];
}

export default fg_message_apis;
