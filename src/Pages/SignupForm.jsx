import React, { useState, useContext, useEffect } from "react";
import {
  createAppDir,
  createAppPod,
  getCookie,
  loginAccount,
  openAppPod,
  registerAccount,
} from "../utils";
import { StepContext, UserContext } from "./Context/contexts";
import { useNavigate } from "react-router-dom";
import "../Popup.css";
import Loader from "./Loader/Loader";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state
  const [text, setText] = useState("");
  const { setUserName, setWalletAddress, setMemonic, setTodos } =
    useContext(UserContext);
  const { setStep, setLoad, load } = useContext(StepContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/userdetails");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = async (mnemonic) => {
    if (email === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }
    try {
      const res = await registerAccount(email, password, mnemonic);
      console.log(res, "res");
      if (res.status === 500 || res.status === 400) {
        throw res;
      }
      setLoad(true);
      setLoading(true); // Show the loader
      setStep(1);
      if (res.status === 402) {
        setTimeout(() => handleSubmit(res.mnemonic), 4000);
        return;
      }
      await loginAccount(email, password);
      setStep(2);
      await createAppPod(email);
      getCookie(email, password);
      setStep(3);
      await openAppPod(email);
      setStep(4);
      await createAppDir(email);
      setMemonic(mnemonic);
      setUserName(email);
      setWalletAddress(res.address);
      setTodos([]);
      setLoad(false);
      setLoading(false); // Hide the loader
      // alert(JSON.stringify(res));
      setEmail("");
      setPassword("");
      navigate("/userdetails");
    } catch (error) {
      setLoading(false); // Hide the loader in case of an error
      setLoad(false);
      console.error("Error registering account:", error);
      console.log(JSON.stringify(error));
      if (JSON.stringify(error) === "{}") {
        console.log("error");
        handleSubmit(mnemonic);
      } else {
        console.log("else");
        setText(error.message);
      }
      console.log(error.response);
      // alert("Error creating user account.");
    }

    // Reset form fields
  };
  if (load) {
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
  return (
    <div className="popup container">
      <h1 className="title">VideoWiki Uploader</h1>
      <div className="login-form">
        <p>Signup</p>
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter username"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <p className="error">{text}</p>
        <button className="login-button" onClick={() => handleSubmit()}>
          {loading ? "Creating Account..." : "Signup"}{" "}
          {/* Conditional button text */}
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
