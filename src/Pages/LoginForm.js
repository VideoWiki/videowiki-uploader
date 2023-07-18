import React, { useState, useContext } from "react";
import {} from "./Login";
import { loginAccount } from "../utils";
import { UserContext } from "./Context/contexts";

const LoginForm = () => {
  const { userName, walletAddress, memonic } = useContext(UserContext);
  console.log(memonic, walletAddress, userName, "dsadasd");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    const { email, password } = this.state;
    // Add your signup logic here
    console.log("Signup form submitted");
    console.log("Email:", email);
    console.log("Password:", password);
    if (email === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }
    loginAccount(email, password);
    // Reset form fields
    setEmail("");
    setPassword("");
  };
  // handleEmailSignupSubmit = async () => {
  //   console.log("handleEmailSignupSubmit called"); // Add this line
  //   const { email, password } = this.state;
  //   console.log(email, password, "tjtjtj"); // Print email and password to the console

  //   if (email === "" || password === "") {
  //     alert("Please enter a username and password.");
  //     return;
  //   }

  //   try {
  //     await registerAccount(email, password);
  //     console.log("Account registered successfully.");
  //     // Additional logic after successful registration, such as redirecting to a different page
  //   } catch (error) {
  //     console.error("Error registering account:", error);
  //     // Handle any errors that occur during the registration process
  //   }
  // };

  return (
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
  );
};

export default LoginForm;
