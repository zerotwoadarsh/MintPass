import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import { useWeb3 } from './contexts/Web3Context';
import { Header } from './components/Header';
import { EventList } from './components/EventList';
import { CreateEventForm } from './components/CreateEventForm';

function App() {
  const { account, isLoading } = useWeb3();
  const [page, setPage] = useState('home'); // 'home' or 'create'

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-xl text-purple-300 animate-pulse">Loading Web3 Connection...</p>;
    }

    if (!account) {
      return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Please Connect Your Wallet</h2>
            <p className="text-gray-400">To interact with the dApp, you need to connect a Web3 wallet like MetaMask.</p>
        </div>
      );
    }
    

    switch (page) { 
      case 'home':
        return <EventList />;
      case 'create':
        return <CreateEventForm />;
      default:
        return <EventList />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20 z-0"></div>
      <div className="relative z-10">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {renderContent()}
        </main>

        <Routes>
          <Route path= '/event-list' element=''/>
        </Routes>
        {/* We can add a Footer component here later if we want */}
      </div>
    </div>
  );
}

export default App;
