// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // We'll need axios for the login API call

const AuthContext = createContext();

// Define the base URL for your API, consistent with other files
// Ensure this matches the API_BASE_URL in your api/Productos.jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New state to indicate if auth check is in progress

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // Set loading to false after initial check
    }, []);

    // Modified login function to make an API call
    const login = async (email, password) => {
        setLoading(true);
        try {
            // Your backend's login endpoint
            const response = await axios.post(`${API_BASE_URL}/users/login`, {
                email: email, // Assuming your backend expects 'username' for email
                password: password
            });

            // Assuming your backend returns user data, and a token if applicable
            // Make sure your backend sends back an 'is_admin: true' for admin users
            const loggedInUser = response.data.user; // Or directly response.data if it's just the user object

            localStorage.setItem('user', JSON.stringify(loggedInUser));
            // You might also want to store a token if your backend uses JWTs for authenticated requests
            // localStorage.setItem('token', response.data.access_token);

            setUser(loggedInUser);
            setLoading(false);
            return true; // Indicate successful login
        } catch (error) {
            console.error('Authentication failed:', error.response?.data || error.message);
            setUser(null);
            localStorage.removeItem('user'); // Clear user on failed login
            // localStorage.removeItem('token'); // Clear token if you're using one
            setLoading(false);
            throw error; // Re-throw to allow the UI component to handle the error
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        // localStorage.removeItem('token'); // Also remove token if you're using one
        setUser(null);
    };

    // Derived state for authentication status
    const isAuthenticated = !!user; // True if user object exists

    // Derived state for admin status
    // IMPORTANT: Ensure your backend sends an 'is_admin: true' field for admin users
    const isAdmin = user && user.is_admin === true; // Check for a specific 'is_admin' property

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};