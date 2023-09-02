import React, { useState, useContext, useEffect } from "react";
import {
  createAppDir,
  createAppPod,
  getCookie,
  initTodos,
  listTodos,
  loginAccount,
  openAppPod,
} from "../utils";
import { UserContext, StepContext } from "./Context/contexts";
import { useNavigate } from "react-router-dom"; // Import useHistory hook
import "../Popup.css"; // Import the CSS file here
import Loader from "./Loader/Loader";

const LoginForm = () => {
  const { setUserName, setWalletAddress, setTodos } = useContext(UserContext);
  const { step, setStep, setLoad, load } = useContext(StepContext);
  console.log(step);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      // navigate("/userdetails");
      return;
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");

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
      setLoad(true);
      setStep(1);
      const res = await loginAccount(email, password);
      console.log("hello world", res);
      setStep(2);
      getCookie(email, password);
      await createAppPod(email);
      await openAppPod(email);
      setStep(3);
      await createAppDir(email);
      const list = await listTodos(email);
      const dataUrls = list.map((todo) => {
        return {
          name: todo.name,
          dataURL: URL.createObjectURL(todo.blob),
          type: todo.blob.type, // Add the 'type' of the todo blob here
        };
      });
      console.log(dataUrls);
      setStep(4);
      setTodos(dataUrls);
      setUserName(res.userName);
      setWalletAddress(res.address);
      setLoad(false);
      setStep(1);
      // Redirect to UserDetails component
      navigate("/userdetails");

      // Reset form fields
      setEmail("");
      setPassword("");
    } catch (error) {
      setLoad(false);
      console.log("Error", error);
      setText(error.message);
    }
  };
  if (load) {
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
        <p className="error">{text}</p>
        <button className="login-button" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
