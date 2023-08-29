import React, { useState, useContext, useEffect } from "react";
import { getCookie, initTodos, loginAccount, registerAccount } from "../utils";
import { UserContext } from "./Context/contexts";
import { useNavigate } from "react-router-dom";
import "../Popup.css";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state
  const {
    userName,
    walletAddress,
    memonic,
    todos,
    setUserName,
    setWalletAddress,
    setMemonic,
    setTodos,
  } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/userdetails");
      return;
    }
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

    setLoading(true); // Show the loader

    try {
      const res = await registerAccount(email, password, mnemonic);
      console.log(res);
      if (res.status === 402) {
        setTimeout(() => handleSubmit(res.mnemonic), 4000);
        return;
      }
      const todos = await loginAccount(email, password);
      const tod = await initTodos(email);
      console.log(tod);
      setMemonic(mnemonic);
      setUserName(email);
      setWalletAddress(res.address);
      setTodos([]);

      setLoading(false); // Hide the loader
      // alert(JSON.stringify(res));
      navigate("/userdetails");
    } catch (error) {
      setLoading(false); // Hide the loader in case of an error
      console.error("Error registering account:", error);
      console.log(JSON.stringify(error));
      if (JSON.stringify(error) === "{}") {
        console.log("error");
        handleSubmit(mnemonic);
      } else {
        console.log("else");
        handleSubmit(mnemonic);
      }
      console.log(error.response);
      // alert("Error creating user account.");
    }

    // Reset form fields
    setEmail("");
    setPassword("");
  };

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

        <button className="login-button" onClick={() => handleSubmit()}>
          {loading ? "Creating Account..." : "Signup"}{" "}
          {/* Conditional button text */}
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
