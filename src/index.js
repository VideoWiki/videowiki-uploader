import React, { useContext, useEffect } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { UserState } from "./Pages/Context/State/UserState";
import { StepState } from "./Pages/Context/State/StepState";
import UserDetails from "./Pages/UserDetails";
import "./Popup.css"; // Import the CSS file here
import LoginForm from "./Pages/LoginForm";
import SignupForm from "./Pages/SignupForm";
// import Metamask from "./Pages/Metamask";
import Navbar from "./Pages/Navbar";
import Wallet from "./Pages/Wallet";
import { StepContext } from "./Pages/Context/contexts";
import Loader from "./Pages/Loader/Loader";

function Home() {
  const { load } = useContext(StepContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/userdetails");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (load === "SignIn") {
    return (
      <Loader
        heading="Signing Up"
        steps={[
          { title: "Signing In", success: "Sign in successfully" },
          { title: "Creating Pod", success: "Pod created successfully" },
          { title: "Opening Pod", success: "Pod open successfully" },
          {
            title: "Creating Directory",
            success: "Directory created successfully",
          },
        ]}
      />
    );
  }
  if (load === "Login") {
    return (
      <Loader
        heading="Logging In"
        steps={[
          { title: "Logging In", success: "Logged in successfully" },
          { title: "Opening Pod", success: "Pod opened successfully" },
          { title: "Loading files", success: "Files Load successfully" },
        ]}
      />
    );
  }
  return (
    <div className="popup container">
      <h1 className="title">VideoWiki Uploader</h1>
      <div className="popup">
        <div className="options">
          {/* <Link to="/metamask" className="option-btn">Connect with Metamask</Link> */}
        </div>
        <div className="options">
          <Link to="/login" className="option-btn">
            Sign In
          </Link>
          <Wallet />
          <Link to="/signup" className="option-btn">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

function Popup() {
  return (
    <Router>
      <UserState>
        <StepState>
          <Navbar />
          <div className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Other routes go here */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/userdetails" element={<UserDetails />} />
              {/* <Route path="/metamask" element={<Metamask />} /> */}
            </Routes>
          </div>
        </StepState>
      </UserState>
    </Router>
  );
}

render(<Popup />, document.getElementById("root"));
