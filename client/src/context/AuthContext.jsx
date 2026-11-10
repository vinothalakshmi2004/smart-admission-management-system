import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/auth/login',
                { email, password },
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            };
        }
    };

    const studentLogin = async (email, password) => {
        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/students/login',
                { email, password }
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Student login failed',
            };
        }
    };

    const studentApply = async (formData) => {
        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/students/apply',
                formData
            );

            // If it returns a user/token, log them in
            if (data.token) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
            }
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Application failed',
            };
        }
    };

    const register = async (name, email, contactNumber, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/auth/register',
                { name, email, contactNumber, password },
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, studentLogin, studentApply, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
