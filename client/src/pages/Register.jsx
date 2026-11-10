import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/student/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const result = await register(name, email, contactNumber, password);
        if (result.success) {
            toast.success('Account created successfully! Please login.');
            navigate('/student-login');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutralLight py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl space-y-8 border-t-8 border-primary relative overflow-hidden animate-fadeIn">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-primary opacity-5 rounded-full pointer-events-none"></div>

                <div className="relative z-10 text-center">
                    <h2 className="text-4xl font-black text-secondary tracking-tight font-serif italic uppercase">Start Journey</h2>
                    <p className="mt-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic">Enrollment Registration Portal</p>
                    <div className="h-1.5 w-16 bg-primary mx-auto mt-4 rounded-full shadow-sm opacity-20"></div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 px-1">Full Identity Name</label>
                            <input
                                type="text"
                                placeholder="ENTER FULL NAME"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all uppercase placeholder:text-gray-200"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 px-1">Active Email Communication</label>
                            <input
                                type="email"
                                placeholder="EXAMPLE@EMAIL.COM"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all uppercase placeholder:text-gray-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 px-1">Secure Contact Number</label>
                            <input
                                type="tel"
                                placeholder="10-DIGIT MOBILE NUMBER"
                                pattern="[0-9]{10}"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all uppercase placeholder:text-gray-200"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 px-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all placeholder:text-gray-200"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 px-1">Verify</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none font-bold transition-all placeholder:text-gray-200"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-5 rounded-full font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl bg-primary hover:bg-secondary text-white transition-all transform active:scale-95 border-none cursor-pointer"
                        >
                            Complete Registration
                        </button>
                    </div>

                    <div className="text-center pt-8 border-t border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exist Credentials? </span>
                        <Link to="/student-login" className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline underline-offset-8 decoration-2 transition-all">
                            Back to Student Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
