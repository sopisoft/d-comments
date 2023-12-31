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
  type: messaging_api["type"];
  data: messaging_api["data"];
  active_tab: boolean;
}): Promise<messaging_api["response"] | Error> {
  return await send_message(query);
}

export default bg_message_apis;
