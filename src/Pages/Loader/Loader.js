import React, { useContext } from "react";
import { StepContext } from "../Context/contexts";
import Steps from "./Steps";
import "./Loader.css";

const Loader = (props) => {
  const { setLoad } = useContext(StepContext);
  return (
    <div id="loader">
      <h1 className="text-center">{props.heading}</h1>
      <div id="steps">
        <Steps steps={props.steps} />
      </div>
      {/* <button
        onClick={() => {
          setLoad(false);
        }}
        s
      >
        go Login
      </button> */}
    </div>
  );
};

export default Loader;
