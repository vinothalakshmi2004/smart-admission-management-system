import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, logout, user } = useContext(AuthContext);
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
        const result = await login(email, password);
        if (result.success) {
            if (result.data && result.data.role !== 'admin') {
                toast.error('Access Denied. Only Administrators allowed.');
                logout();
                return;
            }
        } else {
            toast.error(result.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutralLight py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-5 sm:p-8 md:p-12 rounded-3xl md:rounded-[40px] shadow-2xl space-y-8 border-t-8 border-primary relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-primary opacity-5 rounded-full pointer-events-none"></div>

                <div className="relative z-10 text-center">
                    <div className="mx-auto h-20 w-20 bg-primary text-white rounded-3xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-2xl mb-6 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <FaUserShield />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-secondary tracking-tight font-serif italic uppercase">Admin Control</h2>
                    <p className="mt-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic">System Overseer Authentication</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="relative group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Administrative Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-red-500 transition-colors">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    placeholder="ADMIN_ACCESS@RVSCAS.AC.IN"
                                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all uppercase placeholder:text-gray-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Root Security Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-red-500 transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all placeholder:text-gray-200"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-5 px-4 border-none text-[11px] font-black rounded-full text-white bg-primary hover:bg-secondary transition duration-300 shadow-2xl uppercase tracking-[0.2em] transform active:scale-95 cursor-pointer"
                        >
                            Authorize Admin Access
                        </button>
                    </div>

                    <div className="text-center mt-10 border-t border-gray-100 pt-8">
                        <p className="text-gray-300 text-[9px] font-black uppercase tracking-widest mb-4 italic">Higher Authorization?</p>
                        <Link to="/staff-login" className="text-primary font-black hover:text-secondary transition-all flex items-center justify-center text-[10px] uppercase tracking-widest underline underline-offset-8 decoration-2 hover:decoration-4">
                            Switch to Faculty Portal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
