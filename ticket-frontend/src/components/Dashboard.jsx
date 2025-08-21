// File: src/components/Dashboard.jsx
import React from 'react';
import Aurora from '../animations/Aurora'; 

const Dashboard = () => {
  return (
    <div className="relative text-center h-screen flex flex-col items-center justify-center bg-black">

      <div className="absolute inset-0 z-0">
         <Aurora colorStops={["#55315c","#5b1182", "#d898fa"]} />
      </div>


      <div className="relative z-10">
        <h2 className="text-5xl font-bold mb-4 text-white">Welcome to MintPass</h2>
        <p className="text-xl text-purple-300">The future of decentralized event ticketing.</p>
      </div>
    </div>
  );
};

export default Dashboard;