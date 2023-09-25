import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "./Context/contexts";
import { urlUpload, uploadStatus } from "../utils";
import { ClipLoader } from "react-spinners";

const VideoWikiUpload = () => {
  const { url } = useParams();
  const { todos, userName, setTodos } = useContext(UserContext);
  const navigate = useNavigate();
  const upload = async (username) => {
    console.log(username, url, "args");
    try {
      const resp = await urlUpload(username, url);
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
          navigate("/userdetails");
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
  useEffect(() => {
    upload(userName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="center">
      <ClipLoader
        size={150}
        color="#7247C4"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <h2 className="text-center">Uploading...</h2>
    </div>
  );
};

export default VideoWikiUpload;
