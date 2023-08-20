import React, { useState, useContext } from "react";
import { loginAccount } from "../utils";
import { UserContext } from "./Context/contexts";
import { useNavigate } from "react-router-dom"; // Import useHistory hook
import "../Popup.css"; // Import the CSS file here


const LoginForm = () => {
  const {
    userName,
    walletAddress,
    memonic,
    todos,
    setUserName,
    setWalletAddress,
    setMemonic,
    setTodos
  } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    try {
      
      const res = await loginAccount(email, password);
  
      setUserName(res.userName);
      setWalletAddress(res.address);
      setTodos(res.todoItems);
  
      // Redirect to UserDetails component
      navigate("/userdetails");
  
      // Reset form fields
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Error",error);
    }
  };

  return (
    <div className="login-form">
      <p>Login</p>
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
        Login
      </button>
      
    </div>
  );
};

export default LoginForm;
