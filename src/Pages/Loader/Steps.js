import React, { useContext } from "react";
import { StepContext } from "../Context/contexts";
import { BiCheck } from "react-icons/bi";
import ClipLoader from "react-spinners/ClipLoader";

const Steps = (props) => {
  console.log(props.steps, "dsasteps");
  const { step } = useContext(StepContext);
  return (
    <div>
      {props.steps.map((item, index) => {
        return (
          <div key={index} className="step">
            {step > index + 1 ? (
              <div className="number">
                <div className="check">
                  <BiCheck />
                </div>
              </div>
            ) : step === index + 1 ? (
              <div className="number">
                <ClipLoader size={30} />
              </div>
            ) : (
              <div className="number text-center">{index + 1}</div>
            )}
            <p className="heading">
              {step > index + 1 ? item.success : item.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Steps;
