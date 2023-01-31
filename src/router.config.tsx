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

import { Route, Routes } from "@solidjs/router";

import Options from "./options/options";
import Use from "./use/use";

const RouterConfig = () => {
	return (
		<>
			<Routes>
				<Route
					path="/options"
					element={
						<div id="options">
							<Options />
						</div>
					}
				/>
				<Route
					path="/use"
					element={
						<div id="use">
							<Use />
						</div>
					}
				/>
			</Routes>
		</>
	);
};

export default RouterConfig;
