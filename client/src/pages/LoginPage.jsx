import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // If already logged in, redirect to appropriate dashboard
    useEffect(() => {
        if (user) {
            if (user.role === 'staff') {
                navigate('/staff/dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'student') {
                navigate('/student/dashboard');
            }
        }
    }, [user, navigate]);

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.success) {
            toast.success('Login successful! Redirecting...');
            // Redirect handled by useEffect when user state updates
        } else {
            toast.error(result.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-16"
            style={{ background: '#f4f6f9' }}
        >
            <div
                className="w-full animate-fadeIn"
                style={{
                    maxWidth: '400px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow:
                        '0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 0, 0, 0.04)',
                    padding: '36px 30px',
                    borderTop: '5px solid #8B0000',
                }}
            >
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8B0000, #b30000)',
                            boxShadow: '0 8px 24px rgba(139, 0, 0, 0.25)',
                        }}
                    >
                        <FaUserShield className="text-white text-2xl" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-7">
                    <h1
                        className="font-extrabold tracking-tight"
                        style={{
                            fontSize: '24px',
                            color: '#8B0000',
                        }}
                    >
                        Staff Login
                    </h1>
                    <p
                        className="font-medium mt-1 italic"
                        style={{
                            fontSize: '12px',
                            color: '#999',
                        }}
                    >
                        Administration & Management Portal
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="mb-5">
                        <label
                            className="block uppercase font-bold mb-2 ml-1"
                            style={{
                                fontSize: '10px',
                                color: '#999',
                                letterSpacing: '2px',
                            }}
                        >
                            Official Email ID
                        </label>
                        <div className="relative">
                            <div
                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                style={{ color: errors.email ? '#dc2626' : '#bbb' }}
                            >
                                <FaEnvelope />
                            </div>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="name@rvscas.ac.in"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                                }}
                                className="w-full outline-none font-medium transition-all duration-200"
                                style={{
                                    paddingLeft: '44px',
                                    paddingRight: '16px',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    fontSize: '13px',
                                    color: '#444',
                                    background: errors.email ? '#fef2f2' : '#f7f8fa',
                                    border: errors.email
                                        ? '2px solid #dc2626'
                                        : '2px solid #eee',
                                    borderRadius: '10px',
                                }}
                                onFocus={(e) => {
                                    if (!errors.email)
                                        e.target.style.border = '2px solid #8B0000';
                                }}
                                onBlur={(e) => {
                                    if (!errors.email)
                                        e.target.style.border = '2px solid #eee';
                                }}
                            />
                        </div>
                        {errors.email && (
                            <p
                                className="mt-1 ml-1 font-bold"
                                style={{ fontSize: '10px', color: '#dc2626' }}
                            >
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label
                            className="block uppercase font-bold mb-2 ml-1"
                            style={{
                                fontSize: '10px',
                                color: '#999',
                                letterSpacing: '2px',
                            }}
                        >
                            Secure Password
                        </label>
                        <div className="relative">
                            <div
                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                style={{ color: errors.password ? '#dc2626' : '#bbb' }}
                            >
                                <FaLock />
                            </div>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password)
                                        setErrors((prev) => ({ ...prev, password: '' }));
                                }}
                                className="w-full outline-none font-medium transition-all duration-200"
                                style={{
                                    paddingLeft: '44px',
                                    paddingRight: '16px',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    fontSize: '13px',
                                    color: '#444',
                                    background: errors.password ? '#fef2f2' : '#f7f8fa',
                                    border: errors.password
                                        ? '2px solid #dc2626'
                                        : '2px solid #eee',
                                    borderRadius: '10px',
                                }}
                                onFocus={(e) => {
                                    if (!errors.password)
                                        e.target.style.border = '2px solid #8B0000';
                                }}
                                onBlur={(e) => {
                                    if (!errors.password)
                                        e.target.style.border = '2px solid #eee';
                                }}
                            />
                        </div>
                        {errors.password && (
                            <p
                                className="mt-1 ml-1 font-bold"
                                style={{ fontSize: '10px', color: '#dc2626' }}
                            >
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-white font-black uppercase transition-all duration-300 transform active:scale-95"
                        style={{
                            padding: '14px',
                            fontSize: '12px',
                            letterSpacing: '3px',
                            background: isSubmitting
                                ? '#999'
                                : 'linear-gradient(135deg, #8B0000, #a00000)',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            boxShadow: '0 8px 20px rgba(139, 0, 0, 0.25)',
                        }}
                        onMouseEnter={(e) => {
                            if (!isSubmitting) {
                                e.target.style.background =
                                    'linear-gradient(135deg, #000, #222)';
                                e.target.style.boxShadow =
                                    '0 10px 28px rgba(0, 0, 0, 0.25)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSubmitting) {
                                e.target.style.background =
                                    'linear-gradient(135deg, #8B0000, #a00000)';
                                e.target.style.boxShadow =
                                    '0 8px 20px rgba(139, 0, 0, 0.25)';
                            }
                        }}
                    >
                        {isSubmitting ? 'Authenticating...' : 'Login'}
                    </button>

                    {/* Student Login Link */}
                    <div
                        className="text-center mt-7 pt-5"
                        style={{ borderTop: '1px solid #eee' }}
                    >
                        <p
                            className="font-bold uppercase italic mb-2"
                            style={{
                                fontSize: '10px',
                                color: '#aaa',
                                letterSpacing: '1px',
                            }}
                        >
                            Student Admission?
                        </p>
                        <Link
                            to="/student-login"
                            className="font-black uppercase hover:underline underline-offset-4 decoration-2 transition-colors duration-200"
                            style={{
                                fontSize: '12px',
                                color: '#8B0000',
                            }}
                        >
                            Go to Student Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
