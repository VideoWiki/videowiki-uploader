import React, { useEffect, useState, useContext } from "react";
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
  urlUpload,
  uploadStatus,
} from "../utils";

const VideoWikiUpload = () => {
  const { url } = useParams();
  console.log("swarm", window.swarm);
  const [searchParams] = useSearchParams();
  const { todos, setUserName, setWalletAddress, setMemonic, setTodos } =
    useContext(UserContext);
  const { setStep, setLoad, load } = useContext(StepContext);
  const navigate = useNavigate();
  console.log(searchParams.get("id"));
  const [login, setLogin] = useState(false);
  const [userName, setUserNames] = useState("");
  const startUpload = async () => {
    try {
      const username = await getUsername(searchParams.get("id"));
      if (username.login) {
        setLogin(true);
        setUserNames(username.random_string.toLowerCase());
        Login(username.random_string.toLowerCase());
        return;
      }
      setUserNames(username.random_string.toLowerCase());
      setLogin(false);
      SignIn(username.random_string.toLowerCase(), undefined);
      console.log(username, "username");
    } catch (e) {
      console.log("no username");
    }
  };
  const Login = async (username) => {
    try {
      const res = await loginAccount(username, username);
      console.log("dsa", res);
      setLoad("Login");
      setStep(2);
      await createAppPod(username);
      getCookie(username, username);
      await openAppPod(username);
      setStep(3);
      await createAppDir(username);
      upload(username);
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
      getCookie(username, username);
      setStep(3);
      await openAppPod(username);
      setStep(4);
      upload(username);
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

  const upload = async (username) => {
    try {
      const resp = await urlUpload(username, url);
      console.log("resp", resp);
      var info = resp.filedata;
      info = info.replace("{", "");
      info = info.replace("}", "");
      info = info.replace("'", "");
      console.log("info", info, "this is the info");
      checkStatus(resp.task_id);
    } catch (e) {
      console.log("err", e);
    }
  };

  const checkStatus = async (taskId) => {
    try {
      const res = await uploadStatus(taskId);
      console.log(res, "reso");
      if (res.status === "SUCCESS") {
        console.log("res");
        const result = JSON.parse(res.result);
        console.log(result);
        if (result.Responses[0].message === "uploaded successfully") {
          var newTodos = todos;
          const name = url.split("/");
          var type = url.split(".");
          console.log("type", type);
          switch (type[type.length - 1]) {
            default:
              type = "file";
              break;
            case "pdf":
              type = "file";
              break;
            case "webm":
              type = "video/webm";
              break;
            case "mp4":
              type = "video/mp4";
              break;
            case "png":
              type = "image/png";
              break;
            case "jpg":
              type = "image/jpg";
              break;
            case "jpeg":
              type = "image/jpeg";
              break;
            case "svg":
              type = "image/svg";
              break;
          }
          var newTodo = {
            name: name[name.length - 1],
            dataURL: url,
            type: type, // Add the 'type' of the todo blob here
          };
          newTodos.push({ ...newTodo });
          setTodos(newTodos);
        } else {
          alert("error occur try again");
        }
      } else {
        setTimeout(() => checkStatus(taskId), 2000);
      }
    } catch (e) {
      console.log(e);
      alert("error occurred");
    }
  };
  // useEffect(() => {
  //   startUpload();
  // }, []);
  if (login) {
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
      {/* VideoWikiUpload: {url} {searchParams.get("id") + userName} */}
    </>
  );
};

export default VideoWikiUpload;
