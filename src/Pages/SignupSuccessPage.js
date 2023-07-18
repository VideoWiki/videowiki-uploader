import React from 'react';
import { useStore } from '../Pages/Store/store';

const SignupSuccessPage = () => {
  const { wallet, todoItems } = useStore();

  React.useEffect(() => {
    // Retrieve the wallet address, mnemonic phrase, and todo items from the store or API
    const walletAddress = wallet.address;
    const mnemonicPhrase = wallet.mnemonic;
    const todos = todoItems;

    // Use the data to display on the page or pass it to child components
    console.log('Wallet Address:', walletAddress);
    console.log('Mnemonic Phrase:', mnemonicPhrase);
    console.log('Todo Items:', todos);
  }, [wallet, todoItems]);

  return (
    <div>
      <h1>Signup Successful</h1>
      {/* Display the wallet address, mnemonic phrase, and todo items */}
    </div>
  );
};

export default SignupSuccessPage;