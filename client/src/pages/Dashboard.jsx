import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import StudentDashboard from './student/StudentDashboard';
import StaffDashboard from './staff/StaffDashboard';
import AdminDashboard from './admin/AdminDashboard';


const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/student-login" />;
    }

    // Role-based rendering
    if (user.role === 'student') {
        return <StudentDashboard />;
    } else if (user.role === 'staff') {
        return <StaffDashboard />;
    } else if (user.role === 'admin') {
        return <AdminDashboard />;

    } else {
        return <div className="p-8 sm:p-12 md:p-20 text-center font-bold text-red-600">Unauthorized Access or Invalid Role</div>;
    }
};

export default Dashboard;
