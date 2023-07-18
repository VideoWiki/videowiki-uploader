import { useState } from "react";
import { UserContext } from "../contexts";

export const UserState = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [memonic, setMemonic] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const state = {
    userName,
    memonic,
    walletAddress,
    setUserName: (name) => setUserName(name),
    setMemonic: (mnemonic) => setMemonic(mnemonic),
    setWalletAddress: (address) => setWalletAddress(address),
  };

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};
