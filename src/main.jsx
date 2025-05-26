import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx';
import CartProvider from './context/CartContext';
import StripeProvider from './context/StripeProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StripeProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
     </StripeProvider> 
  </React.StrictMode>
);