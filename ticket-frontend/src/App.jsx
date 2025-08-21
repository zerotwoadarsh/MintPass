import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { useWeb3 } from './contexts/Web3Context';
import Header from './components/Header';
import Navbar  from './components/Navbar';
import Dashboard from './components/Dashboard';
import {EventList}  from './components/EventList';
import {CreateEventForm}  from './components/CreateEventForm';
import {Scanner}  from './components/Scanner';
import Profile from './components/Profile';

function App() {
  const { isLoading } = useWeb3();

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-xl text-purple-300 animate-pulse">Loading Web3 Connection...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Add the Toaster component here for global notifications */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2d3748', // gray-800
            color: '#fff',
          },
        }}
      />
      <div className="min-h-screen text-black font-sans">
        <Header/>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/create-event" element={<CreateEventForm />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;