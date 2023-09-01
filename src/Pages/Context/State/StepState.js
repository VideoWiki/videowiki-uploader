import { useState } from "react";
import { StepContext } from "../contexts";

export const StepState = ({ children }) => {
  const [step, setStep] = useState(1);
  const [load, setLoad] = useState(false);
  const state = {
    step,
    setStep: (step) => setStep(step),
    load,
    setLoad: (load) => setLoad(load),
  };

  return <StepContext.Provider value={state}>{children}</StepContext.Provider>;
};
