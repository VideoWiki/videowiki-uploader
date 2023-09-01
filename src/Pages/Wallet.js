import React, { useContext } from "react";
import { getUsername, initTodos } from "../utils";
import { Web3 } from "web3";
import { StepContext, UserContext } from "./Context/contexts";
import { useNavigate } from "react-router-dom";
import {
  createAppDir,
  createAppPod,
  loginAccount,
  openAppPod,
  registerAccount,
  listTodos,
} from "../utils";

const Wallet = () => {
  const { setUserName, setWalletAddress, setMemonic, setTodos } =
    useContext(UserContext);
  const { setStep, setLoad, load } = useContext(StepContext);
  const navigate = useNavigate();
  const connect = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        // Request access to the user's accounts
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        var userWalletAddress = accounts[0];
        console.log(userWalletAddress);
        console.log("Connected to wallet");
      } else {
        console.error("No wallet extension detected");
      }
      try {
        const username = await getUsername(userWalletAddress);
        if (username.login) {
          Login(username.random_string.toLowerCase());
          return;
        }
        SignIn(username.random_string.toLowerCase(), undefined);
        console.log(username, "username");
      } catch (e) {
        console.log("no username");
      }
    } catch (error) {
      console.error("User denied access to wallet");
    }
  };

  const Login = async (username) => {
    try {
      const res = await loginAccount(username, username);
      console.log("dsa", res);
      setLoad("Login");
      setStep(2);
      await createAppPod(username);
      await openAppPod(username);
      setStep(3);
      await createAppDir(username);
      const list = await listTodos(username);
      const dataUrls = list.map((todo) => {
        return {
          name: todo.name,
          dataURL: URL.createObjectURL(todo.blob),
          type: todo.blob.type, // Add the 'type' of the todo blob here
        };
      });
      console.log(dataUrls);
      setTodos(dataUrls);
      setUserName(username);
      setWalletAddress(res.address);
      setLoad(false);
      // Redirect to UserDetails component
      navigate("/userdetails");
    } catch (error) {
      console.log("Error", error);
    }
  };

  const SignIn = async (username, mnemonic) => {
    setLoad("SignIn"); // Show the loader
    setStep(1);
    try {
      const res = await registerAccount(username, username, mnemonic);
      console.log(res, "res");
      if (res.status === 500) {
        throw res;
      }
      if (res.status === 402) {
        setTimeout(() => SignIn(username, res.mnemonic), 4000);
        return;
      }
      await loginAccount(username, username);
      setStep(2);
      await createAppPod(username);
      setStep(3);
      await openAppPod(username);
      setStep(4);
      await createAppDir(username);
      setMemonic(mnemonic);
      setUserName(username);
      setWalletAddress(res.address);
      setTodos([]);
      setLoad(false);
      navigate("/userdetails");
    } catch (error) {
      setLoad(false);
      console.error("Error registering account:", error);
      console.log(JSON.stringify(error));
      if (JSON.stringify(error) === "{}") {
        console.log("error");
        SignIn(username, mnemonic);
      } else {
        alert(error.message);
        console.log("else");
        // alert("error");
      }
      console.log(error.response);
      // alert("Error creating user account.");
    }
  };
  return (
    <button onClick={connect} className="option-btn">
      Metamask
    </button>
  );
};

export default Wallet;
