import React from "react";
import { render } from "react-dom";
import LoginSignupOptions from "./Pages/Login";
import "./Popup.css";

function Popup() {
  return (
    <div className="popup">
      <h1 className="title">VideoWiki Uploader</h1>
      <LoginSignupOptions />
    </div>
  );
}

render(<Popup />, document.getElementById("root"));
