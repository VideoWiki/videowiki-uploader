import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import {registerMetamaskAccount , loginAccount} from "../utils"
import login from "../artifacts/contracts/Login.sol/Login.json"
const Metamask = () => {
    const [connected, setconnected] = useState(false);
    const [contract, setcontract] = useState(null);
    const [provider, setprovider] = useState(null);
    const [account, setaccount] = useState(null);
    const [userExists, setuserExists] = useState(false);
    const [userSignedIn, setuserSignedIn] = useState(false);
    const signup = async () => {
        try {
            await contract.createUser();
            const res = await contract.returnHash();
            registerMetamaskAccount(account, res);
            console.log("Registration SucessFull");
            loginUser();
        } catch (error) {
            console.error(error);
        }
    }
    const loginUser = async () => {
        try {
            const res = await contract.returnHash();
            console.log("User Logged in\nUnique hash ->",res);
            registerMetamaskAccount(account, res);
            console.log("Registration SucessFull");
            setuserSignedIn(true);
            
        } catch (error) {
            console.error(error);
        }
    }
    const checkUser = async () => {
        try {
            const res = await contract.checkuserRegistered();
            setuserExists(res);
        } catch (error) {
            console.error(error);
        }
    }
    const connectFetch = async () => {
        const loadProvider = async (provider) => {
            if (provider) {
                window.ethereum.on("chainChanged", () => {
                    // window.location.reload();
                    loadProvider(provider);
                });
                window.ethereum.on("accountsChanged", () => {
                    // window.location.reload();
                    loadProvider(provider);
                });
                const { ethereum } = window;
                try {
                    await ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x13881' }],
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        // Do something
                        window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x13881',
                                chainName: 'Polygon',
                                nativeCurrency: {
                                    name: 'Mumbai',
                                    symbol: 'MATIC',
                                    decimals: 18
                                },
                                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                                blockExplorerUrls: ['https://mumbai.polygonscan.com']
                            }]
                        })
                            .catch((error) => {
                            });
                    }
                }
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setaccount(address);
                let contractAddress = "0xd1eF0ba461931d02B33D6CF54a11475A744242Dd"; //mumbai
                const contractInstance = new ethers.Contract(
                    contractAddress,
                    login.abi,
                    signer
                );
                setcontract(contractInstance);
                setprovider(provider);
                setconnected(true);
            } else {
                console.error("MetaMask not Installed");
            }
        };
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await loadProvider(provider);
        } catch (error) {
            console.error("MetaMask not Installed");
        }
    }
    useEffect(() => {
        !connected && connectFetch();
        connected && checkUser();
    }, [userExists, contract])
    return (
        <div className='login-form'>
            <div>Metamask Login</div>
            {
                connected && <div>
                    {userSignedIn ?
                        <p>User Successfully Signed In</p>
                        :
                        <div>
                            {userExists ?
                                <>
                                    <button className='login-button' onClick={loginUser}>Log In</button>
                                </>
                                :
                                <>
                                    <button className='login-button' onClick={signup}>Sign Up</button>
                                </>
                            }
                        </div>
                    }


                </div>
            }
        </div>
    )
}

export default Metamask