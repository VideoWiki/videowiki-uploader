import React, { createContext, useState } from 'react';

// Create a new context for the store
const StoreContext = createContext();

// Create a provider component to wrap the app and provide the store
const StoreProvider = ({ children }) => {
  const [wallet, setWallet] = useState({});
  const [todoItems, setTodoItems] = useState([]);
  // Add more state variables as needed

  // Define functions to update the state
  const updateWallet = (newWallet) => {
    setWallet(newWallet);
  };

  const updateTodoItems = (newTodoItems) => {
    setTodoItems(newTodoItems);
  };

  // Create the store object with state variables and update functions
  const store = {
    wallet,
    todoItems,
    updateWallet,
    updateTodoItems,
    // Add more state variables and update functions to the store
  };

  // Provide the store to the children components
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to access the store from any component
const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};

export { StoreProvider, useStore };
