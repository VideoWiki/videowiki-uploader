import React, { useState, useContext } from "react";
import {} from "./Login";
import { registerAccount } from "../utils";
import { UserContext } from "./Context/contexts";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    userName,
    walletAddress,
    memonic,
    setUserName,
    setWalletAddress,
    setMemonic,
  } = useContext(UserContext);
  console.log(memonic, walletAddress, userName, "dsadasd");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    // const { email, password } = this.state;
    // Add your signup logic here
    console.log("Signup form submitted");
    console.log("Email:", email);
    console.log("Password:", password);
    if (email === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }
    registerAccount(email, password).then((res) => {
      alert();
      console.log(res);
    });
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
      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
};

export default SignupForm;
