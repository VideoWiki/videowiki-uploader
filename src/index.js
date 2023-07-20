import React from "react";
import { render } from "react-dom";
import LoginSignupOptions from "./Pages/Login";
import LoginForm from "./Pages/LoginForm";
import SignupForm from "./Pages/SignupForm";
import "./Popup.css";
// import { UserState } from "./Pages/Context/State/UserState";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserState } from "./Pages/Context/State/UserState";

function Home() {
  return (
    <div className="popup">
      <div className="options">
        <Link to="/login">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

function Popup() {
  return (
    // <UserState>
    //   <div className="popup">
    //     <h1 className="title">VideoWiki Uploader</h1>
    //     <LoginSignupOptions />
    //   </div>
    // </UserState>
    <Router>
      <UserState>
        <div className="popup">
          <h1 className="title">VideoWiki Uploader</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </div>
      </UserState>
    </Router>
  );
}

render(<Popup />, document.getElementById("root"));
