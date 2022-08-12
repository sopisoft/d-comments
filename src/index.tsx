import React from "react";
import ReactDOM from "react-dom";
import Popup from "./Pages/Popup";
import Options from "./Pages/Options";
import reportWebVitals from "./Pages/reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("popup") || document.createElement("div")
);

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("options") || document.createElement("div")
);

reportWebVitals(console.log);
