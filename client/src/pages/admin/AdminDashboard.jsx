import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import ApplicationList from './ApplicationList';
import UserList from './UserList';
import StaffManagement from './StaffManagement';
import EnquiryList from './EnquiryList';
import CourseSeatManagement from './CourseSeatManagement';
import ContactMessages from './ContactMessages';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { API_URL } from '../../config';
import { FaGraduationCap, FaUserTie, FaClipboardList, FaSignOutAlt, FaBookOpen, FaChair, FaEnvelope } from 'react-icons/fa';

const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const [stats, setStats] = useState(null);
    const { logout, authConfig } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/api/users/stats`, authConfig())
            .then(({ data }) => setStats(data))
            .catch(() => setStats(null));
    }, [activeTab, authConfig]);

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    const tabs = [
        { id: 'applications', label: 'Admissions', icon: <FaClipboardList /> },
        { id: 'seats', label: 'Seat Matrix', icon: <FaChair /> },
        { id: 'students', label: 'Student Directory', icon: <FaGraduationCap /> },
        { id: 'staff', label: 'Staff Management', icon: <FaUserTie /> },
        { id: 'enquiries', label: 'Enquiries', icon: <FaBookOpen /> },
        { id: 'messages', label: 'Messages', icon: <FaEnvelope /> },
    ];

    const statTiles = stats ? [
        { label: 'Applications', value: stats.applications },
        { label: 'Fees paid', value: stats.payments },
        { label: 'Fees collected', value: formatINR(stats.revenue) },
        { label: 'Students', value: stats.students },
        { label: 'Enquiries', value: stats.enquiries },
        { label: 'Messages', value: stats.contacts },
    ] : [];

    return (
        <div className="bg-neutralLight min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-tighter mb-2 font-serif italic">Admin <span className="text-primary font-sans not-italic tracking-normal">Command Center</span></h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            System Overview & Control
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <ChangePasswordModal buttonClassName="flex items-center px-6 py-2.5 bg-white text-primary border-2 border-primary font-black rounded-xl hover:bg-red-50 transition duration-300 uppercase text-[10px] tracking-widest cursor-pointer" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-6 py-2.5 bg-primary text-white font-black rounded-xl hover:bg-secondary transition duration-300 shadow-xl uppercase text-[10px] tracking-widest active:scale-95 border-none cursor-pointer"
                        >
                            <FaSignOutAlt className="mr-2" /> TERMINATE SESSION
                        </button>
                    </div>
                </header>

                {statTiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {statTiles.map((t) => (
                            <div key={t.label} className="bg-white rounded-2xl shadow p-4 md:p-5 border border-gray-100 min-w-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.label}</p>
                                <p className="text-xl md:text-2xl font-black text-gray-800 mt-1 break-words">{t.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-4 overflow-x-auto overscroll-x-contain snap-x pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 mb-6 md:mb-8" role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-3 shrink-0 snap-start whitespace-nowrap px-4 py-3 md:px-8 md:py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition duration-300 shadow-lg border-none cursor-pointer
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-red-200'
                                    : 'bg-white text-gray-400 hover:text-primary hover:bg-red-50'}`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="transition-all duration-500 animate-fadeIn">
                    {activeTab === 'applications' && <ApplicationList />}
                    {activeTab === 'seats' && <CourseSeatManagement />}
                    {activeTab === 'students' && <UserList role="student" />}
                    {activeTab === 'staff' && <StaffManagement />}
                    {activeTab === 'enquiries' && <EnquiryList />}
                    {activeTab === 'messages' && <ContactMessages />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
