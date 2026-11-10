import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserShield, FaLock } from 'react-icons/fa';
import AdmissionSidebar from '../components/AdmissionSidebar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { studentLogin, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'student') {
                navigate('/student/dashboard');
            } else {
                navigate(`/${user.role}/dashboard`);
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await studentLogin(email, password);
        if (result.success) {
            if (result.data && result.data.role !== 'student') {
                toast.error('Staff & Admins must login via the Staff Portal.');
                logout();
                return;
            }
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="bg-neutralLight min-h-screen pt-8 pb-20">
            <div className="container mx-auto px-4">

                {/* Page Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black italic text-gray-800 uppercase tracking-tighter inline-block font-serif">
                        ADMISSION <span className="text-primary font-sans not-italic tracking-normal">TERMINAL</span>
                    </h1>
                    <div className="h-1.5 w-32 bg-primary mt-2 mx-auto rounded-full shadow-lg"></div>
                </div>

                {!user ? (
                    /* ══════════════════════════════════════════════ */
                    /*  MAIN LAYOUT — Sidebar (30%) + Content (70%) */
                    /* ══════════════════════════════════════════════ */
                    <div className="flex flex-col lg:flex-row gap-0 max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden">

                        {/* ── LEFT: Admission Sidebar (30%) ── */}
                        <div className="w-full lg:w-[30%] shrink-0">
                            <AdmissionSidebar />
                        </div>

                        {/* ── RIGHT: Student Login Form (70%) ── */}
                        <div className="w-full lg:w-[70%] bg-white flex items-center justify-center py-12 px-6 lg:px-16 border-l border-gray-100">
                            <div className="max-w-md w-full animate-fadeIn">
                                {/* Form Header */}
                                <div className="mb-8">
                                    <h2 className="text-center text-3xl font-black italic text-secondary tracking-tighter uppercase font-serif">
                                        Student Login
                                    </h2>
                                    <p className="mt-2 text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        Secure Access Terminal v2.7
                                    </p>
                                </div>

                                {/* Login Form */}
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        {/* Student ID */}
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                                                Student ID / Register Number
                                            </label>
                                            <div className="relative group">
                                                <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="ENTER YOUR REGISTER NUMBER"
                                                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all uppercase placeholder:text-gray-200"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                                                Security Password
                                            </label>
                                            <div className="relative group">
                                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Forgot Password */}
                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                                        >
                                            Forgot Credentials?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-5 rounded-full font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-secondary transition-all transform active:scale-95 border-none cursor-pointer"
                                    >
                                        Authenticate & Enter
                                    </button>

                                    {/* Register Link */}
                                    <div className="text-center mt-6">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            New Applicant?{' '}
                                        </span>
                                        <Link
                                            to="/register"
                                            className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline underline-offset-4 decoration-2"
                                        >
                                            Create New Account
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Already logged in — redirect spinner */
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-black text-primary uppercase tracking-[0.3em]">
                            Session Active. Redirecting...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
