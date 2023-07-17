import React from "react";
import { render } from "react-dom";
import LoginSignupOptions from "./Pages/Login";
import "./Popup.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupSuccessPage from "./Pages/SignupSuccessPage";

function Popup() {
  // const cookie = {
  //   "named": "value"
  // };
  // cookie={cookie}

  return (
    <div className="popup">
      <h1 className="title">VideoWiki Uploader</h1>
      <Router >
        <Routes>
          <Route path="/" element={<LoginSignupOptions />} />
          <Route path="/signup-success" component={SignupSuccessPage} />
        </Routes>
      </Router>
    </div>
  );
}

render(<Popup />, document.getElementById("root"));
