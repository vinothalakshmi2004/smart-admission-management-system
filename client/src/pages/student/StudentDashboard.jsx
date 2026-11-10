import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { FaSignOutAlt, FaListUl, FaSpinner, FaChair, FaPlusCircle } from 'react-icons/fa';
import ApplicationForm from './ApplicationForm';
import ApplicationStatus from './ApplicationStatus';
import SeatAvailability from './SeatAvailability';
import ScholarshipChecker from '../../components/student/ScholarshipChecker';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('apply');
    const [loading, setLoading] = useState(true);
    const [hasApplications, setHasApplications] = useState(false);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const checkApplications = async () => {
            if (!user) return;
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/applications/my', config);
                if (data && data.length > 0) {
                    setHasApplications(true);
                    setActiveTab('status');
                } else {
                    setHasApplications(false);
                    setActiveTab('apply');
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        checkApplications();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/student-login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutralLight">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-black uppercase tracking-widest text-[10px]">Verifying Student Credentials...</p>
            </div>
        );
    }

    const navigationItems = [
        { id: 'apply', label: 'Application Form', icon: <FaPlusCircle />, hidden: hasApplications },
        { id: 'status', label: 'Application Status', icon: <FaListUl /> },
        { id: 'seats', label: 'Seat Availability', icon: <FaChair /> },
        { id: 'scholarship', label: 'Scholarship Eligibility', icon: <FaSpinner /> }
    ];

    return (
        <div className="bg-neutralLight min-h-screen pb-20 pt-10 px-4 font-sans">
            <div className="container mx-auto max-w-6xl">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-red-50 to-transparent pointer-events-none opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Academic Session 2026-27</p>
                        </div>
                        <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter leading-none italic border-l-8 border-primary pl-6">
                            Student <span className="text-primary">Terminal</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Signed In As</p>
                            <p className="text-sm font-black text-primary uppercase italic">{user?.name}</p>
                        </div>
                        <button onClick={handleLogout} className="bg-primary text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-2xl flex items-center transform active:scale-95 border-none cursor-pointer">
                            <FaSignOutAlt className="mr-2" /> LOGOUT
                        </button>
                    </div>
                </div>

                {/* Navigation Menu (Horizontal Tabs) */}
                <div className="flex flex-wrap gap-4 mb-10 bg-white/50 p-2 rounded-3xl border border-gray-100 backdrop-blur-sm">
                    {navigationItems.map(item => !item.hidden && (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 border-none cursor-pointer ${activeTab === item.id ? 'bg-primary text-white shadow-xl scale-105' : 'bg-white text-gray-400 hover:bg-red-50 hover:text-primary transition-all'}`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Rendering Zone */}
                <div className="animate-fadeIn">
                    {activeTab === 'apply' && !hasApplications && (
                        <div className="animate-slideUp">
                            <ApplicationForm />
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <div className="animate-slideUp">
                            <ApplicationStatus />
                        </div>
                    )}

                    {activeTab === 'seats' && (
                        <div className="animate-slideUp bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden p-8">
                            <SeatAvailability isComponent={true} />
                        </div>
                    )}

                    {activeTab === 'scholarship' && (
                        <div className="animate-slideUp">
                            <ScholarshipChecker />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
