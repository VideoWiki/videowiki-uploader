import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserState } from "./Pages/Context/State/UserState";
import UserDetails from "./Pages/UserDetails";
import "./Popup.css"; // Import the CSS file here
import LoginForm from "./Pages/LoginForm";
import SignupForm from "./Pages/SignupForm";
import Metamask from "./Pages/Metamask";

function Home() {
  return (
    <div className="popup">
      <div className="options">
        <Link to="/metamask" className="option-btn">Connect with Metamask</Link>
      </div>
      <div className="options">
        <Link to="/login" className="option-btn">Sign In</Link>
        <Link to="/signup" className="option-btn">Sign Up</Link>
      </div>
    </div>
  );
}

function Popup() {
  return (
    <Router>
      <UserState>
        <div className="popup container">
          <h1 className="title">VideoWiki Uploader</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Other routes go here */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/userdetails" element={<UserDetails />} />
            <Route path="/metamask" element={<Metamask />} />
          </Routes>
        </div>
      </UserState>
    </Router>
  );
}

render(<Popup />, document.getElementById("root"));
