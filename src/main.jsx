/* import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'; // Importá esto

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);