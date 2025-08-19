import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import { contractAddress, abi } from '../constants';

// 1. Create the context
const Web3Context = createContext();

// 2. Create a custom hook for easy access to the context
export const useWeb3 = () => useContext(Web3Context);

// 3. Create the Provider component
export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to connect the user's wallet
    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask to use this dApp.");

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (accounts.length) {
                setAccount(accounts[0]);
                // Setup ethers provider and contract instance after connecting
                const ethersProvider = new ethers.BrowserProvider(window.ethereum);
                const signer = await ethersProvider.getSigner();
                const contractInstance = new ethers.Contract(contractAddress, abi, signer);
                
                setProvider(ethersProvider);
                setContract(contractInstance);
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet. See the console for more details.");
        }
    };

    // Effect to check for an already connected wallet on page load
    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            try {
                if (!window.ethereum) {
                    console.log("MetaMask is not installed.");
                    setIsLoading(false);
                    return;
                }

                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length) {
                    setAccount(accounts[0]);
                    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await ethersProvider.getSigner();
                    const contractInstance = new ethers.Contract(contractAddress, abi, signer);

                    setProvider(ethersProvider);
                    setContract(contractInstance);
                } else {
                    console.log("No authorized account found.");
                }
            } catch (error) {
                console.error("Error checking for connected wallet:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkIfWalletIsConnected();

        // Listen for account changes (e.g., user switches accounts in MetaMask)
        window.ethereum?.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                // Re-run the connection logic with the new account
                connectWallet();
            } else {
                // User disconnected
                setAccount(null);
                setProvider(null);
                setContract(null);
            }
        });

    }, []);

    // The value provided to all children components
    const value = {
        account,
        provider,
        contract,
        isLoading,
        connectWallet
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};