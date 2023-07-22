import { useState } from "react";
import { UserContext } from "../contexts";

export const UserState = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [memonic, setMemonic] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [todos, setTodos] = useState([])
  const state = {
    userName,
    memonic,
    walletAddress,
    todos,
    setUserName: (name) => setUserName(name),
    setMemonic: (mnemonic) => setMemonic(mnemonic),
    setWalletAddress: (address) => setWalletAddress(address),
    setTodos: (todos) => setTodos(todos)
  };

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};
