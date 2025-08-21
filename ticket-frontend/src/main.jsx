import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Web3Provider } from './contexts/Web3Context'; // Import our provider
import { BrowserRouter } from 'react-router';

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <Web3Provider>
      <App />
    </Web3Provider>
  </BrowserRouter>
  </React.StrictMode>,
);