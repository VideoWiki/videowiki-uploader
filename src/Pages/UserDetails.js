// UserDetails.js
import React, { useContext, useRef, useState } from "react";
import { UserContext } from "./Context/contexts";
import "./UserDetails.css";
import { addTodo, deleteTodo, downloadTodo } from "../utils";

const UserDetails = () => {
  const { userName, walletAddress, memonic, todos, setTodos } = useContext(UserContext);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFilesSelected, setIsFilesSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(""); // Added to store the selected file name

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const uniqueTodoTypes = [...new Set(todos.map((todo) => getFileExtension(todo.name)))];

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files); // Convert the FileList to an array
    setSelectedFiles(files);
    setIsFilesSelected(true);
    setSelectedFileName(files[0].name); // Store the name of the first selected file
  };

  const handleFileUpload = async () => {
    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const todo = {
          id: Date.now(),
        };

        const updatedTodos = await addTodo(todo, todos, file);
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
      setSelectedFiles([]);
      setIsFilesSelected(false); // Reset isFilesSelected to false after upload
      setSelectedFileName(""); // Reset selected file name after upload
    }
  };

  const handleDeleteTodo = async (deleteTodoName) => {
    try {
      const updatedTodos = await deleteTodo(deleteTodoName, todos);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  const handleDownloadTodo = async (downloadTodoName) => {
    try {
      const downloadSuccess = await downloadTodo(downloadTodoName, todos);
      if (downloadSuccess) {
        console.log("File downloaded successfully.");
      } else {
        console.log("Failed to download file.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="user-details-container">
      <div className="user-info">
        <h2>User Details</h2>
        <p>
          <strong>Username:</strong> {userName}
        </p>
        {memonic !== "" && <p><strong>Memonic:</strong> {memonic}</p>}
        <p className="wallet-address">
          <strong>Wallet Address:</strong> {walletAddress}
        </p>
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
                          <img src={todo.dataURL} alt={`Todo: ${todo.name}`} />
                        ) : todo.type.startsWith("video") ? (
                          <video width="120" height="90" controls>
                            <source src={todo.dataURL} type={todo.type} />
                          </video>
                        ) : (
                          <p>Unsupported file type: {todo.type}</p>
                        )}
                      </div>
                      <div className="todo-details">
                        <p><strong>Name:</strong> {todo.name}</p>
                        <p><strong>Type:</strong> {todo.type}</p>
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
        <label htmlFor="todo" className="file-label">
          {isFilesSelected ? selectedFileName : "Select Files"} {/* Display selected file name when files are selected */}
          <input
            type="file"
            id="todo"
            ref={fileInputRef}
            multiple
            accept="image/*, video/*"
            onChange={handleFileSelection}
          />
        </label>
        <button onClick={handleFileUpload} className="upload-button">
          Upload
        </button>
        {uploading && <p>Uploading...</p>}
      </div>
    </div>
  );
};

export default UserDetails;
