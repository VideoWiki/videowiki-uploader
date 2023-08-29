// UserDetails.js
import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "./Context/contexts";
import "./UserDetails.css";
import { addTodo, deleteTodo, downloadTodo, initTodos } from "../utils";
import { calculateFileInfo } from "../PriceCalculator/calculateFileInfo";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { BiCopy } from "react-icons/bi";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#7247C4",
};

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
  const navigate = useNavigate();
  useEffect(() => {
    // Load user data from local storage
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Set the user data from local storage if available
      setUserName(storedUser.userName);
      setWalletAddress(storedUser.walletAddress);
      setMemonic(storedUser.memonic);
      setTodos(storedUser.todos);
      getTodos(storedUser.userName);
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
      const todos = await initTodos(username);
      setLoading(false);
      console.log("todo", todos);
      const dataUrls = todos.map((todo) => {
        return {
          name: todo.name,
          dataURL: URL.createObjectURL(todo.blob),
          type: todo.blob.type, // Add the 'type' of the todo blob here
        };
      });
      setTodos(dataUrls);
      localStorage.setItem(
        "user",
        JSON.stringify({ userName, walletAddress, memonic, todos: dataUrls })
      );
      console.log(`TODOS`, todos);
    } catch (e) {
      console.log(e, "err");
      if (e.message === "jwt: invalid token") {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const uniqueTodoTypes = [
    ...new Set(todos.map((todo) => getFileExtension(todo.name))),
  ];

  const handleFileSelection = (event) => {
    if (!event.target.files.length) return;
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setIsFilesSelected(true);
    setSelectedFileName(files[0].name);

    if (files.length > 0) {
      const file = files[0];
      const ttl = 31536000; // Replace this with your desired time to live value in seconds
      calculateFileInfo(file, ttl)
        .then((info) => {
          console.log(info, "bruh this is the info");
          // You can access the calculated file information here.
          setFileInfo(info);
        })
        .catch((error) => {
          console.error("Error calculating file info:", error);
        });
    }
  };

  const handleFileUpload = async () => {
    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const todo = {
          id: Date.now(),
        };

        const updatedTodos = await addTodo(todo, todos, userName, file);
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
      setUploading(false);
      setSelectedFiles([]);
      setIsFilesSelected(false); // Reset isFilesSelected to false after upload
      setSelectedFileName(""); // Reset selected file name after upload
      setFileInfo({}); // Clear the file information after upload
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

  return (
    <div className="userDetails">
      {loading ? (
        <div className="center">
          <ClipLoader
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
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
          <div className="user-todos-container">
            {uniqueTodoTypes.map((type, typeIndex) => (
              <div key={typeIndex}>
                <h4>{type} Files:</h4>
                <div className="todos-container">
                  {todos.map((todo, todoIndex) => {
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
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteTodo(todo.name)}
                              >
                                Delete
                              </button>
                              {/* Download button */}
                              <button
                                className="download-button"
                                onClick={() => handleDownloadTodo(todo.name)}
                              >
                                Download
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
          <div className="file-upload">
            {isFilesSelected && (
              <div className="selected-file-info">
                <h3>Selected File:</h3>
              </div>
            )}

            <label htmlFor="todo" className="file-label">
              {isFilesSelected ? selectedFileName : "Select Files"}
              <input
                type="file"
                id="todo"
                ref={fileInputRef}
                multiple
                accept="image/*, video/*"
                onChange={handleFileSelection}
              />
            </label>
            {selectedFiles.length ? (
              <button onClick={handleFileUpload} className="upload-button">
                Upload
              </button>
            ) : null}
            {uploading && <p>Uploading...</p>}
          </div>
          {Object.keys(fileInfo).length > 0 && (
            <div className="file-info">
              <h3>File Information:</h3>
              <p>Name: {fileInfo.name}</p>
              <p>ttl: {fileInfo.ttl} bytes</p>
              <p>Size in KB: {fileInfo.sizeKB} KB</p>
              <p>Size in MB: {fileInfo.sizeMB} MB</p>
              <p>Type: {fileInfo.type}</p>
              <p>chunks: {fileInfo.chunks}</p>
              <p>depth: {fileInfo.depth}</p>
              <p>totalAmountBZZ: {fileInfo.totalAmount}</p>
              <p>totalAmountPLUR: {fileInfo.totalAmountPLUR}</p>
              {/* Display other calculated properties as needed */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
