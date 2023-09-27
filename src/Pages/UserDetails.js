// UserDetails.js
import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "./Context/contexts";
import "./UserDetails.css";
import swarm from "../Assets/logo2.jpeg";
import Upload from "../Assets/Upload.svg";
import {
  addTodo,
  deleteTodo,
  downloadTodo,
  listTodos,
  uploadStatus,
  urlUpload,
} from "../utils";
import { calculateFileInfo } from "../PriceCalculator/calculateFileInfo";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { BiCloudUpload, BiCopy, BiTrash } from "react-icons/bi";

const UserDetails = () => {
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
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFilesSelected, setIsFilesSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileInfo, setFileInfo] = useState({});
  const [url, setUrl] = useState("");
  const [getInfo, setGetInfo] = useState(false);
  const [error, setError] = useState("");
  const [isFile, setIsFile] = useState(false);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (error !== "") setTimeout(() => setError(""), 2000);
  }, [error]);

  useEffect(() => {
    // Load user data from local storage
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    if (storedUser) {
      // Set the user data from local storage if available
      console.log("storedUser", storedUser);
      if (walletAddress === "") {
        getTodos(storedUser.userName);
      }
      setUserName(storedUser.userName);
      setWalletAddress(storedUser.walletAddress);
      setMemonic(storedUser.memonic);
      setTodos(storedUser.todos);
    } else {
      localStorage.setItem(
        "user",
        JSON.stringify({ userName, walletAddress, memonic, todos: todos })
      );
    }
  }, []);

  const getTodos = async (username) => {
    setLoading(true);
    try {
      const todos = await listTodos(username);
      if (todos.message === "expired") {
        throw todos;
      }
      setLoading(false);
      console.log("todo", todos);
      const dataUrls = todos?.map((todo) => {
        return {
          name: todo.name,
          dataURL: URL.createObjectURL(todo.blob),
          type: todo.blob.type, // Add the 'type' of the todo blob here
        };
      });
      setTodos(dataUrls);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, todos: dataUrls })
      );
      console.log(`TODOS`, todos);
    } catch (e) {
      console.log(e, "err");
      if (e.message === "jwt: invalid token" || e.message === "expired") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const uniqueTodoTypes = [
    ...new Set(todos?.map((todo) => getFileExtension(todo.name))),
  ];

  const handleFileSelection = (event) => {
    if (!event.target.files.length) return;
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setIsFilesSelected(true);
    setSelectedFileName(files[0].name);
    setIsFile(true);

    if (files.length > 0) {
      const file = files[0];
      const ttl = 31536000; // Replace this with your desired time to live value in seconds
      calculateFileInfo(file, ttl)
        .then((info) => {
          console.log(info, "bruh this is the info");
          // You can access the calculated file information here.
          console.log(4);
          setFileInfo(info);
        })
        .catch((error) => {
          console.error("Error calculating file info:", error);
        });
    }
  };

  const handleFileUpload = async () => {
    setUploading(true);
    console.log("uploading");
    try {
      for (const file of selectedFiles) {
        console.log(file, todos);
        const updatedTodos = await addTodo(todos, userName, file);
        setTodos(updatedTodos);
        // Save updated todos to local storage
        localStorage.setItem(
          "user",
          JSON.stringify({
            userName,
            walletAddress,
            memonic,
            todos: updatedTodos,
          })
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      console.log(5);
      setUploading(false);
      setIsFile(false);
      setSelectedFiles([]);
      setIsFilesSelected(false); // Reset isFilesSelected to false after upload
      setSelectedFileName(""); // Reset selected file name after upload
      setFileInfo({}); // Clear the file information after upload
      setGetInfo(true);
      setUrl("");
    }
  };

  const handleDeleteTodo = async (deleteTodoName) => {
    try {
      const updatedTodos = await deleteTodo(deleteTodoName, todos, userName);
      setTodos(updatedTodos);
      // Save updated todos to local storage
      localStorage.setItem(
        "user",
        JSON.stringify({
          userName,
          walletAddress,
          memonic,
          todos: updatedTodos,
        })
      );
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleDownloadTodo = async (downloadTodoName) => {
    try {
      const downloadSuccess = await downloadTodo(
        downloadTodoName,
        todos,
        userName
      );
      if (downloadSuccess) {
        console.log("File downloaded successfully.");
      } else {
        console.log("Failed to download file.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const copyMnemonic = () => {
    navigator.clipboard.writeText(memonic);
  };

  const isValidURL = (url) => {
    // Regular expression to match a URL
    var urlRegex = /^(https?:\/\/)?([\w.-]+)(\/[\w.-]*)*\/?$/;
    return urlRegex.test(url);
  };
  const upload = async () => {
    try {
      if (!isValidURL()) {
        setError("Not a valid url");
        return;
      }
      const resp = await urlUpload(userName, url);
      console.log("resp", resp);
      var info = resp.filedata;
      info = info.replace("{", "");
      info = info.replace("}", "");
      info = info.replace(/'/g, "");
      info = info.replace(/,/g, "");
      info = info.replace(/ /g, "");

      console.log("info", info, "this is the info");
      setFileInfo(info);

      setTimeout(() => {
        checkStatus(resp.task_id, info.split("\n")[1].split("/").pop());
      }, 1000);
    } catch (e) {
      console.log("err", e);
    }
  };

  const checkStatus = async (taskId, name) => {
    console.log(name, "21");
    try {
      const res = await uploadStatus(taskId);
      console.log(res, "reso");
      if (res.status === "SUCCESS") {
        console.log("res");
        console.log(name);
        const result = JSON.parse(res.result);
        console.log(result);
        if (result.Responses[0].message === "uploaded successfully") {
          var newTodos = todos;
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
            name: name,
            dataURL: url,
            type: type, // Add the 'type' of the todo blob here
          };
          newTodos.push({ ...newTodo });
          console.log(newTodos);
          setTodos(newTodos);
        } else {
          alert("error occur try again");
        }
        console.log(1);
        setUploading(false);
        setIsFile(false);
        setSelectedFiles([]);
        setIsFilesSelected(false); // Reset isFilesSelected to false after upload
        setSelectedFileName(""); // Reset selected file name after upload
        setTimeout(() => setFileInfo({}), 1000); // Clear the file information after upload
        setUrl("");
      } else {
        setTimeout(() => checkStatus(taskId, name), 2000);
      }
    } catch (e) {
      console.log(2);
      setUploading(false);
      setIsFile(false);
      setSelectedFiles([]);
      setIsFilesSelected(false); // Reset isFilesSelected to false after upload
      setSelectedFileName(""); // Reset selected file name after upload
      setFileInfo({}); // Clear the file information after upload
      setUrl("");
      console.log(e);
      alert("error occurred");
    }
  };
  const handleUpload = () => {
    setError("");
    if (url.length > 0) {
      setError("");
      upload();
    } else if (selectedFiles.length > 0) {
      setError("");
      handleFileUpload();
    } else {
      setError("Select a file first");
    }
  };
  const clickInput = () => {
    console.log(fileInputRef.current);
    fileInputRef.current.click();
  };

  if (uploading) {
    return (
      <div className="center">
        <ClipLoader
          loading={uploading}
          size={150}
          color="#7247C4"
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <h2 className="text-center">Uploading Files</h2>
      </div>
    );
  }

  return (
    <div className="userDetails">
      {loading ? (
        <div className="center">
          <ClipLoader
            loading={loading}
            size={150}
            color="#7247C4"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h2 className="text-center">Loading Files</h2>
        </div>
      ) : (
        <div className="user-details-container">
          <div className="user-info">
            <h2>User Details</h2>
            <p>
              <strong>Username:</strong> {userName}
            </p>
            <p className="wallet-address">
              <span>
                <strong>Wallet Address:</strong> {walletAddress}
              </span>
              <BiCopy onClick={copyWalletAddress} className="cursor" />
            </p>
            {memonic !== "" && (
              <p>
                <strong>Memonic:</strong> {memonic}
                <BiCopy onClick={copyMnemonic} className="cursor" />
              </p>
            )}
          </div>
          <div className="file-info">
            {typeof fileInfo === "string" ? (
              <>
                <p>Name: {fileInfo.split("\n")[1].split("/").pop()}</p>
                <p>Size in MB: {fileInfo.split("\n")[4].split(":").pop()}</p>
                <p>
                  totalAmountBZZ: {fileInfo.split("\n")[9].split(":").pop()}
                </p>
              </>
            ) : (
              Object.keys(fileInfo).length > 0 && (
                <>
                  <p>Name: {fileInfo.name}</p>
                  <p>Size in MB: {fileInfo.sizeMB} MB</p>
                  <p>totalAmountBZZ: {fileInfo.totalAmount}</p>
                  {/* <p>totalAmountPLUR: {fileInfo.totalAmountPLUR}</p> */}
                </>
              )
            )}
          </div>
          <div className="file-upload">
            <div className="file-select-box" onClick={clickInput}>
              <img src={Upload} alt="CloudUp" />
              <h3>Click to select file</h3>
            </div>
            <input
              type="file"
              id="todo"
              ref={fileInputRef}
              multiple
              accept="image/*, video/*"
              onChange={handleFileSelection}
            />
          </div>
          <p className="hr-lines">or</p>
          <div style={{ display: "flex" }}>
            <input
              value={url}
              placeholder="File URL"
              onChange={(e) => {
                setGetInfo(false);
                setUrl(e.target.value);
              }}
              className="url"
            />
          </div>
          <p className="error">{error}</p>
          <button onClick={handleUpload} className="upload-button">
            <img src={swarm} alt="logo" />
            <span>Upload to Swarm</span>
          </button>

          <div className="user-todos-container">
            {uniqueTodoTypes?.map((type, typeIndex) => (
              <div key={typeIndex}>
                <h4>{type} Files:</h4>
                <div className="todos-container">
                  {todos?.map((todo, todoIndex) => {
                    if (getFileExtension(todo.name) === type) {
                      return (
                        <div key={todoIndex} className="todo-item">
                          <div className="todo-thumbnail">
                            {todo.type.startsWith("image") ? (
                              <img
                                src={todo.dataURL}
                                alt={`Todo: ${todo.name}`}
                              />
                            ) : todo.type.startsWith("video") ? (
                              <video width="120" height="90" controls>
                                <source src={todo.dataURL} type={todo.type} />
                              </video>
                            ) : (
                              <p>Unsupported file type: {todo.type}</p>
                            )}
                          </div>
                          <div className="todo-details">
                            <p>
                              <strong>Name:</strong> {todo.name}
                            </p>
                            <p>
                              <strong>Type:</strong> {todo.type}
                            </p>
                            <div className="todo-actions">
                              {/* Delete button */}
                              {/* Download button */}
                              <button
                                className="download-button"
                                onClick={() => handleDownloadTodo(todo.name)}
                              >
                                Download
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteTodo(todo.name)}
                              >
                                <BiTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
