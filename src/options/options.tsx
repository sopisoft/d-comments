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

import { ThemeProvider } from "@/components/theme-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@/index.css";
import { createRoot } from "react-dom/client";
import Developer from "./components/developer";
import Footer from "./components/footer";
import Header from "./components/header";
import Options from "./components/options";

const OptionsPage = () => {
  return (
    <>
      <Tabs defaultValue="options">
        <Header
          tabsList={
            <TabsList className="flex space-x-4 max-md:hidden">
              <TabsTrigger value="options">設定</TabsTrigger>
              <TabsTrigger value="developer">開発者</TabsTrigger>
            </TabsList>
          }
        />
        <TabsContent value="options">
          <Options />
        </TabsContent>
        <TabsContent value="developer">
          <Developer />
        </TabsContent>
      </Tabs>

      <Footer />
    </>
  );
};

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ThemeProvider>
      <OptionsPage />
    </ThemeProvider>
  );
}
