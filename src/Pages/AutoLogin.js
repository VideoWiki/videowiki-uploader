import React, { useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Loader from "./Loader/Loader";
import { getCookie, getUsername } from "../utils";
import { StepContext, UserContext } from "./Context/contexts";
import { useNavigate } from "react-router-dom";
import {
  createAppDir,
  createAppPod,
  loginAccount,
  openAppPod,
  registerAccount,
  listTodos,
  checkLogin,
} from "../utils";
import { ClipLoader } from "react-spinners";

const AutoLogin = () => {
  var { url } = useParams();
  url = encodeURIComponent(url);
  const { setUserName, setWalletAddress, setMemonic, setTodos } =
    useContext(UserContext);
  const { load, setStep, setLoad } = useContext(StepContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const startUpload = async () => {
    try {
      const username = await getUsername(searchParams.get("id"));
      if (username.login) {
        Login(username.random_string.toLowerCase());
        return;
      }
      SignIn(username.random_string.toLowerCase(), undefined);
    } catch (e) {
      console.log("no username");
    }
  };

  const Login = async (username) => {
    try {
      const res = await loginAccount(username, username);
      setLoad("Login");
      setStep(2);
      await createAppPod(username);
      getCookie(username, username);
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
      navigate(`/upload/${url}`);
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
      getCookie(username, username);
      setStep(3);
      await openAppPod(username);
      setStep(4);
      await createAppDir(username);
      setMemonic(mnemonic);
      setUserName(username);
      setWalletAddress(res.address);
      setTodos([]);
      setLoad(false);
      navigate(`/upload/${url}`);
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

  const isLogin = async () => {
    startUpload();
  };

  useEffect(() => {
    isLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (load === "Login") {
    return (
      <>
        <Loader
          heading="Logging In"
          steps={[
            { title: "Logging In", success: "Logged in successfully" },
            { title: "Opening Pod", success: "Pod opened successfully" },
            { title: "Loading files", success: "Files Load successfully" },
          ]}
        />
        {/* VideoWikiUpload: {url} {searchParams.get("id") + userName} */}
      </>
    );
  }

  if (load === "SignIn") {
    return (
      <>
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
      </>
    );
  }
  return (
    <div>
      <div className="center">
        <ClipLoader
          size={150}
          color="#7247C4"
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <h2 className="text-center">Loading</h2>
      </div>
    </div>
  );
};

export default AutoLogin;
