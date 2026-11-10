import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

const STORAGE_KEY = 'userInfo';
const ROLES = ['student', 'staff', 'admin'];

// True when the JWT's exp time has passed (or the token can't be read).
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
};

// Read the saved session; drop it if it is broken or expired.
const readStoredUser = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && saved.token && ROLES.includes(saved.role) && !isTokenExpired(saved.token)) {
            return saved;
        }
    } catch {
        // ignore unreadable data
    }
    localStorage.removeItem(STORAGE_KEY);
    return null;
};

const errorMessage = (error, fallback) => error.response?.data?.message || fallback;

export const AuthProvider = ({ children }) => {
    // Read the saved session once, before the first render
    const [user, setUser] = useState(readStoredUser);
    const loading = false;

    const saveUser = useCallback((data) => {
        setUser(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    // Log out automatically when the server rejects our token.
    useEffect(() => {
        const id = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const sentToken = String(error.config?.headers?.Authorization || '').startsWith('Bearer ');
                const message = String(error.response?.data?.message || '');
                if (sentToken && error.response?.status === 401 && /token|user not found/i.test(message)) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(id);
    }, [logout]);

    // Headers for authenticated requests
    const authConfig = useCallback(
        (extra = {}) => ({ ...extra, headers: { ...(extra.headers || {}), Authorization: `Bearer ${user?.token}` } }),
        [user]
    );

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            saveUser(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, message: errorMessage(error, 'Login failed. Please try again.') };
        }
    };

    const studentLogin = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/students/login`, { email, password });
            saveUser(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, message: errorMessage(error, 'Student login failed') };
        }
    };

    // Submit the application form (multipart, with documents).
    // The logged-in session is kept; only the contact number may change.
    const studentApply = async (formData) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/students/apply`, formData, authConfig());
            if (user && data.contactNumber && data.contactNumber !== user.contactNumber) {
                saveUser({ ...user, contactNumber: data.contactNumber });
            }
            return { success: true, data };
        } catch (error) {
            return { success: false, message: errorMessage(error, 'Application failed. Please try again.') };
        }
    };

    const register = async (name, email, contactNumber, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, contactNumber, password });
            saveUser(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, message: errorMessage(error, 'Registration failed') };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const { data } = await axios.put(`${API_URL}/api/auth/password`, { currentPassword, newPassword }, authConfig());
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: errorMessage(error, 'Could not change password') };
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, studentLogin, studentApply, register, logout, changePassword, authConfig }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
