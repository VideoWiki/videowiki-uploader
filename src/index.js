import React from "react";
import { render } from "react-dom";
import LoginSignupOptions from "./Pages/Login";
import "./Popup.css";
import { UserState } from "./Pages/Context/State/UserState";

function Popup() {
  return (
    <UserState>
      <div className="popup">
        <h1 className="title">VideoWiki Uploader</h1>
        <LoginSignupOptions />
      </div>
    </UserState>
  );
}

render(<Popup />, document.getElementById("root"));
