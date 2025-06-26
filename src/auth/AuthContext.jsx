// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // State to hold the authentication token
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- CHANGE 1: Use sessionStorage instead of localStorage ---
        const storedToken = sessionStorage.getItem('authToken'); // Get token from sessionStorage
        const storedUser = sessionStorage.getItem('user');      // Get user from sessionStorage

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                // --- Set Authorization header globally for Axios ---
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (e) {
                console.error("Failed to parse stored user data or token:", e);
                // Clear invalid or corrupted data
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('user');
                setUser(null);
                setToken(null);
                delete axios.defaults.headers.common['Authorization']; // Clear header
            }
        }
        setLoading(false); // Authentication check is complete
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/users/login`, {
                email: email,
                password: password
            });

            const loggedInUser = response.data.user;
            const receivedToken = response.data.token; // Assuming your backend returns a 'token' field

            // --- CHANGE 2: Store token and user in sessionStorage ---
            sessionStorage.setItem('authToken', receivedToken);
            sessionStorage.setItem('user', JSON.stringify(loggedInUser));
            
            // --- Set Authorization header globally for Axios after successful login ---
            axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

            setUser(loggedInUser);
            setToken(receivedToken); // Update token state
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Authentication failed:', error.response?.data || error.message);
            setUser(null);
            setToken(null); // Clear token state on failure
            // --- Clear items and header on failed login ---
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        // --- Clear token and user from sessionStorage ---
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization']; // Clear Axios header
        setUser(null);
        setToken(null); // Clear token state
    };

    const isAuthenticated = !!user && !!token; // True if user object AND token exist

    // Derived state for admin status
    const isAdmin = user && user.is_admin === true;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, logout, loading }}>
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