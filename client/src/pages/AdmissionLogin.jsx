import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserShield, FaLock, FaGraduationCap } from 'react-icons/fa';

const AdmissionLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user, logout } = useContext(AuthContext);
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

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email / Register Number is required';
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
            if (result.data && result.data.role !== 'student') {
                toast.error('Staff & Admins must login via the Staff Portal.');
                logout();
                return;
            }
            toast.success('Login successful! Redirecting...');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-neutralLight">
            {/* Login Card */}
            <div className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl space-y-8 border-t-8 border-primary relative overflow-hidden animate-fadeIn">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-primary opacity-5 rounded-full pointer-events-none"></div>

                {/* Icon */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="mx-auto h-20 w-20 bg-primary text-white rounded-3xl flex items-center justify-center text-4xl shadow-2xl mb-6 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <FaGraduationCap />
                    </div>
                    <h1 className="text-4xl font-black text-secondary tracking-tight font-serif italic uppercase text-center">Admission <span className="text-primary font-sans not-italic tracking-normal">Portal</span></h1>
                    <p className="mt-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] italic text-center">Secure Applicant Authentication</p>
                    <div className="h-1.5 w-16 bg-primary mt-4 rounded-full shadow-sm opacity-20"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Email / Register Number */}
                    <div className="relative group">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1">Email / Register Identifier</label>
                        <div className="relative">
                            <FaUserShield
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${errors.email ? 'text-red-500' : 'text-gray-300 group-focus-within:text-red-500'}`}
                            />
                            <input
                                id="admission-email"
                                type="text"
                                placeholder="ENTER CREDENTIALS"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                                }}
                                className={`w-full pl-12 pr-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold transition-all uppercase placeholder:text-gray-200 ${errors.email ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-red-500 focus:bg-white'}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-2 px-2 font-black text-[9px] text-red-600 uppercase tracking-widest flex items-center">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1">Security Code / Password</label>
                        <div className="relative">
                            <FaLock
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${errors.password ? 'text-red-500' : 'text-gray-300 group-focus-within:text-red-500'}`}
                            />
                            <input
                                id="admission-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                                }}
                                className={`w-full pl-12 pr-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold transition-all placeholder:text-gray-200 ${errors.password ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-red-500 focus:bg-white'}`}
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-2 px-2 font-black text-[9px] text-red-600 uppercase tracking-widest flex items-center">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span> {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end p-1">
                        <Link
                            to="/forgot-password"
                            className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors duration-200"
                        >
                            Forgot Credentials?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-5 rounded-full font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl transition-all transform active:scale-95 flex items-center justify-center border-none ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary text-white cursor-pointer'}`}
                    >
                        {isSubmitting ? 'Authenticating...' : 'Authorize & Enter'}
                    </button>

                    {/* Register Link */}
                    <div className="text-center pt-8 mt-4 border-t border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            New Applicant?{' '}
                        </span>
                        <Link
                            to="/register"
                            className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline underline-offset-8 decoration-2"
                        >
                            Create Admission Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdmissionLogin;
