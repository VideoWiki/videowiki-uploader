import React from 'react';
import { useStore } from './store';

const MyComponent = () => {
  const { wallet, todoItems, updateWallet, updateTodoItems } = useStore();

  const handleUpdateWallet = () => {
    // Example of updating the wallet
    const newWallet = { address: 'newAddress', mnemonic: 'newMnemonic' };
    updateWallet(newWallet);
  };

  const handleUpdateTodoItems = () => {
    // Example of updating the todo items
    const newTodoItems = [
      { id: 1, text: 'Item 1' },
      { id: 2, text: 'Item 2' },
      // ...
    ];
    updateTodoItems(newTodoItems);
  };

  return (
    <div>
      <h1>My Component</h1>
      <p>Wallet Address: {wallet.address}</p>
      <p>Mnemonic Phrase: {wallet.mnemonic}</p>
      <ul>
        {todoItems.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
      <button onClick={handleUpdateWallet}>Update Wallet</button>
      <button onClick={handleUpdateTodoItems}>Update Todo Items</button>
    </div>
  );
};

export default MyComponent;
