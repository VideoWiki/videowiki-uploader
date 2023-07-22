import React, { useState, useContext } from "react";
import { registerAccount } from "../utils";
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }

    setLoading(true); // Show the loader

    try {
      const res = await registerAccount(email, password);

      setMemonic(res.mnemonic);
      setUserName(res.userName);
      setWalletAddress(res.address);
      setTodos(res.todos);

      setLoading(false); // Hide the loader
      alert(JSON.stringify(res));
      navigate("/userdetails");
    } catch (error) {
      setLoading(false); // Hide the loader in case of an error
      console.error("Error registering account:", error);
      alert("Error creating user account.");
    }

    // Reset form fields
    setEmail("");
    setPassword("");
  };

  return (
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

      <button className="login-button" onClick={handleSubmit}>
        {loading ? "Creating Account..." : "Signup"} {/* Conditional button text */}
      </button>
    </div>
  );
};

export default SignupForm;
