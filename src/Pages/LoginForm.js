import React, { useState, useContext } from "react";
import { loginAccount } from "../utils";
import { UserContext } from "./Context/contexts";

const LoginForm = () => {
  // const { userName, walletAddress, memonic } = useContext(UserContext);
  const {
    userName,
    walletAddress,
    memonic,
    setUserName,
    setWalletAddress,
    setMemonic,
  } = useContext(UserContext);
  console.log(memonic, walletAddress, userName, "dsadasd");
  // const [email, setEmail] = useState();
  // const [password, setPassword] = useState();
  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    console.log("handleEmailChange called");
    console.log("New email value:", event.target.value);
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    console.log("handlePasswordChange called");
    console.log("New password value:", event.target.value);
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("Login form submitted");
    console.log("Email:", email);
    console.log("Password:", password);

    if (email === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }
    // loginAccount(email, password);
    const res = await loginAccount (email, password) ;
    setMemonic(res.message)
    setUserName(res.nameHash)
    setWalletAddress(res.address)
    console.warn(res, "llllllll");
    // Reset form fields
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <p>Login</p>
      <div>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
};

export default LoginForm;
