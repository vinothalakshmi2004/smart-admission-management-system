import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ApplicationList from './ApplicationList';
import UserList from './UserList';
import StaffManagement from './StaffManagement';
import EnquiryList from './EnquiryList';
import CourseSeatManagement from './CourseSeatManagement';
import { FaGraduationCap, FaUserTie, FaClipboardList, FaHistory, FaSignOutAlt, FaBookOpen, FaChair } from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

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
        { id: 'activities', label: 'Staff Activities', icon: <FaHistory /> },
    ];

    return (
        <div className="bg-neutralLight min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter mb-2 font-serif italic">Admin <span className="text-primary font-sans not-italic tracking-normal">Command Center</span></h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            System Overview & Control
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 flex items-center px-6 py-2.5 bg-primary text-white font-black rounded-xl hover:bg-secondary transition duration-300 shadow-xl uppercase text-[10px] tracking-widest active:scale-95 border-none cursor-pointer"
                    >
                        <FaSignOutAlt className="mr-2" /> TERMINATE SESSION
                    </button>
                </header>

                <div className="flex flex-wrap gap-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-3 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition duration-300 shadow-lg border-none cursor-pointer
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-red-200'
                                    : 'bg-white text-gray-400 hover:text-primary hover:bg-red-50'}`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="transition-all duration-500">
                    {activeTab === 'applications' && (
                        <div className="animate-fadeIn">
                            <ApplicationList />
                        </div>
                    )}
                    {activeTab === 'seats' && (
                        <div className="animate-fadeIn">
                            <CourseSeatManagement />
                        </div>
                    )}
                    {activeTab === 'students' && (
                        <div className="animate-fadeIn">
                            <UserList role="student" />
                        </div>
                    )}
                    {activeTab === 'staff' && (
                        <div className="animate-fadeIn">
                            <StaffManagement />
                        </div>
                    )}
                    {activeTab === 'enquiries' && (
                        <div className="animate-fadeIn">
                            <EnquiryList />
                        </div>
                    )}
                    {activeTab === 'activities' && (
                        <div className="bg-white p-24 rounded-[40px] shadow-2xl border border-gray-100 text-center animate-fadeIn relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4 text-primary">
                                <FaHistory size={400} />
                            </div>
                            <div className="text-6xl text-red-50 mb-6 flex justify-center"><FaHistory className="text-primary opacity-20" /></div>
                            <h3 className="text-2xl font-black text-gray-800 uppercase italic font-serif">Activity Logs Locked</h3>
                            <p className="text-gray-400 mt-4 max-w-sm mx-auto italic font-medium leading-relaxed uppercase text-[10px] tracking-widest opacity-60">System monitoring and detailed audit logs are being provisioned for the next deployment phase.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

