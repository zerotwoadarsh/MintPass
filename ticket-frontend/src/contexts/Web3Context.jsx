
import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { contractAddress, abi } from '../constants';

// Helper object for network-specific details
const networkConfig = {
    '0xaa36a7': { // Sepolia Chain ID
        blockExplorerUrl: 'https://sepolia.etherscan.io',
    },
    // You can add other networks here, e.g., Fuji, Amoy
};

const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider]= useState(null);
    const [contract, setContract] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [blockExplorerUrl, setBlockExplorerUrl] = useState('');

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return toast.error("Please install MetaMask.");

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (accounts.length) {
                setAccount(accounts[0]);
                const ethersProvider = new ethers.BrowserProvider(window.ethereum);
                const signer = await ethersProvider.getSigner();
                const contractInstance = new ethers.Contract(contractAddress, abi, signer);
                
                setProvider(ethersProvider);
                setContract(contractInstance);

                // Set block explorer URL based on network
                const network = await ethersProvider.getNetwork();
                const chainId = `0x${network.chainId.toString(16)}`;
                setBlockExplorerUrl(networkConfig[chainId]?.blockExplorerUrl || '');

                toast.success('Wallet connected!');
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            toast.error("Failed to connect wallet.");
        }
    };

    useEffect(() => {
        const setupProvider = async () => {
            try {
                if (!window.ethereum) {
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

                    const network = await ethersProvider.getNetwork();
                    const chainId = `0x${network.chainId.toString(16)}`;
                    setBlockExplorerUrl(networkConfig[chainId]?.blockExplorerUrl || '');
                }
            } catch (error) {
                console.error("Error setting up provider:", error);
            } finally {
                setIsLoading(false);
            }
        };
        setupProvider();

        window.ethereum?.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                connectWallet();
            } else {
                setAccount(null);
                setProvider(null);
                setContract(null);
                setBlockExplorerUrl('');
                toast('Wallet disconnected.', { icon: '👋' });
            }
        });
    }, []);

    const value = { account, provider, contract, isLoading, connectWallet, blockExplorerUrl };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};