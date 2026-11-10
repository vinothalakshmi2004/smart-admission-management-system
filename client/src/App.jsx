import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthContext from './context/AuthContext';
import Contact from './pages/Contact';
import About from './pages/About';
import Courses from './pages/Courses';
import StaffLogin from './pages/StaffLogin';
import AdminLogin from './pages/AdminLogin';
import AdmissionLogin from './pages/AdmissionLogin';
import LoginPage from './pages/LoginPage';
import Campus from './pages/Campus';
import TrainingPlacement from './pages/TrainingPlacement';
import Examination from './pages/Examination';
import UGCProjects from './pages/research/UGCProjects';
import Payment from './pages/student/Payment';
import Brochure from './pages/Brochure';
import Enquiry from './pages/Enquiry';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';


// Private Route Component
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    if (allowedRoles && allowedRoles.includes('admin')) {
      return <Navigate to="/admin-login" />;
    }
    if (allowedRoles && allowedRoles.includes('staff')) {
      return <Navigate to="/login" />;
    }
    return <Navigate to="/student-login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/student/dashboard" />;
    if (user.role === 'staff') return <Navigate to="/staff/dashboard" />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/student-login" element={<Login />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admission-login" element={<AdmissionLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/campus" element={<Campus />} />
            <Route path="/training-placement" element={<TrainingPlacement />} />
            <Route path="/examination" element={<Examination />} />
            <Route path="/research/ugc-projects" element={<UGCProjects />} />
            <Route path="/brochure" element={<Brochure />} />
            <Route path="/enquiry" element={<Enquiry />} />

            {/* Admission and application access is consolidated under /student-login */}

            {/* Application redirect to dashboard */}
            <Route path="/apply" element={<PrivateRoute allowedRoles={['student']}><Navigate to="/student/dashboard" /></PrivateRoute>} />

            {/* Protected Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/status" element={<PrivateRoute allowedRoles={['student']}><Navigate to="/student/dashboard" /></PrivateRoute>} />
            <Route path="/student/payment" element={<PrivateRoute allowedRoles={['student']}><Payment /></PrivateRoute>} />
            <Route path="/student/seat-availability" element={<PrivateRoute allowedRoles={['student']}><Navigate to="/student/dashboard" /></PrivateRoute>} />

            {/* Protected Staff Routes */}
            <Route
              path="/staff/dashboard"
              element={
                <PrivateRoute allowedRoles={['staff']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />


            {/* Catch-all dashboard redirect */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Unknown addresses */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
};

export default App;
