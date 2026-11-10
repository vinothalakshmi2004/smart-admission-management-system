import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FaUserCircle, FaBuilding, FaIdBadge, FaChalkboardTeacher, FaSignOutAlt, FaCalendarCheck } from 'react-icons/fa';

const StaffDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/staff-login');
    };

    if (!user) return null;

    return (
        <div className="bg-neutralLight min-h-screen pb-20 pt-10 px-4 font-sans">
            <div className="container mx-auto max-w-5xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="animate-fadeIn">
                        <h1 className="text-4xl font-black text-gray-800 font-serif uppercase tracking-tight italic mb-1">
                            Staff Dashboard
                        </h1>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 border-l-4 border-primary ml-1">
                            Faculty Management Portal
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-8 py-3 bg-primary text-white font-black rounded-full hover:bg-secondary transition duration-300 shadow-xl uppercase text-[10px] tracking-widest active:scale-95 border-none cursor-pointer"
                    >
                        <FaSignOutAlt className="mr-2" /> Logout Session
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Welcome Card & Profile */}
                    <div className="lg:col-span-12">
                        <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100 relative overflow-hidden group">
                            {/* Decorative Background Icon */}
                            <div className="absolute right-0 top-0 opacity-[0.02] pointer-events-none transform translate-x-1/4 -translate-y-1/4 text-primary">
                                <FaUserCircle size={400} />
                            </div>

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                                <div className="shrink-0">
                                    <div className="w-32 h-32 bg-red-50 rounded-[40px] flex items-center justify-center text-primary shadow-inner border border-red-100 group-hover:scale-105 transition-transform duration-500">
                                        <FaUserCircle size={80} />
                                    </div>
                                    <div className="mt-4 px-4 py-1.5 bg-green-50 rounded-full border border-green-200 text-center">
                                        <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div> Active Faculty
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-grow text-center md:text-left space-y-6">
                                    <div>
                                        <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-60">Verified Identity</h2>
                                        <h3 className="text-5xl font-black text-gray-800 font-serif uppercase tracking-tighter italic">
                                            Welcome, {user.name}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center space-x-4 p-4 rounded-3xl bg-gray-50/50">
                                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-md">
                                                <FaBuilding />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</p>
                                                <p className="text-sm font-bold text-gray-800 italic">{user.department || 'Academic Dept.'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 p-4 rounded-3xl bg-gray-50/50">
                                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-md">
                                                <FaChalkboardTeacher />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Class</p>
                                                <p className="text-sm font-bold text-gray-800 italic text-nowrap">{user.className || 'Not Assigned'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 p-4 rounded-3xl bg-gray-50/50">
                                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-md">
                                                <FaIdBadge />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee ID</p>
                                                <p className="text-sm font-bold text-gray-800 italic">{user.employeeId || '#000000'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-12 lg:grid lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-[40px] shadow-xl border-t-4 border-transparent hover:border-primary transition-all cursor-pointer group">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
                                <FaCalendarCheck size={24} />
                            </div>
                            <h4 className="text-xl font-black italic font-serif text-gray-800 mb-2 uppercase tracking-tight">Mark Attendance</h4>
                            <p className="text-xs font-medium text-gray-500 leading-relaxed">System for tracking daily student participation across assigned courses.</p>
                        </div>
                        {/* Section Locked */}
                        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 opacity-40 grayscale flex flex-col justify-center items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section Locked</p>
                        </div>
                        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 opacity-40 grayscale flex flex-col justify-center items-center text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section Locked</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
