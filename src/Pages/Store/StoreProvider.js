import React from 'react';
import { StoreProvider } from './store';
import App from './App';

const Root = () => {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
};

export default Root;
