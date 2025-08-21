import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useNavigate } from 'react-router';

 const Header = () => {
  const { account, connectWallet } = useWeb3();

  const navigate = useNavigate();

  return (
    <nav className="bg-black backdrop-blur-md shadow-lg sticky border-b border-purple-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 
              onClick={() => navigate('/') } 
              className="text-2xl font-bold cursor-pointer bg-clip-text text-white"
            >
              MintPass
            </h1>
            
          </div>
          <div>
            {account ? (
              <button onClick={() => navigate('/profile')}>

              <div className="bg-white text-purple-800 text-sm font-mono px-4 py-2 rounded-full" title={account}>
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </div>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Header;