import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { FaEdit, FaCheck, FaTimes, FaUserAlt, FaCalendarAlt, FaIdCard } from 'react-icons/fa';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();

        const socket = io('http://localhost:5000');
        socket.on('new_application', () => {
            toast.info('New student application submitted!');
            fetchApplications();
        });

        return () => socket.disconnect();
    }, [user]);

    const fetchApplications = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/applications', config);
            setApplications(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, comments = '') => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status, adminComments: comments }, config);
            toast.success(`Application marked as ${status}`);
            fetchApplications();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="p-20 text-center text-primary font-bold animate-pulse">Loading Applications...</div>;

    return (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 animate-fadeIn">
            <header className="flex justify-between items-center mb-10 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter font-serif italic">Active <span className="text-primary font-sans not-italic tracking-normal">Admissions</span></h2>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em] flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Status: {applications.length} Applications Detected
                    </p>
                </div>
                <button
                    onClick={fetchApplications}
                    className="bg-primary text-white text-[10px] font-black px-8 py-3 rounded-full hover:bg-secondary transition-all shadow-xl uppercase tracking-widest border-none cursor-pointer active:scale-95"
                >
                    Refresh Records
                </button>
            </header>

            <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-inner">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-primary text-white uppercase text-[10px] font-black tracking-widest">
                            <th className="px-8 py-6 text-left border-none">Applicant Identity</th>
                            <th className="px-8 py-6 text-left border-none">Academic Credentials</th>
                            <th className="px-8 py-6 text-left border-none">Target Course</th>
                            <th className="px-8 py-6 text-left border-none">Registration Date</th>
                            <th className="px-8 py-6 text-left border-none">Current Status</th>
                            <th className="px-8 py-6 text-right border-none">Management Interface</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-red-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center text-primary mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                            <FaUserAlt size={16} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 text-sm uppercase italic font-serif tracking-tighter">{app.studentName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold lowercase tracking-normal">{app.email}</p>
                                            <p className="text-[9px] text-red-600 font-black mt-1 uppercase tracking-widest">Ph: {app.contactNumber}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-[10px] space-y-1.5 font-bold uppercase tracking-tight text-gray-600">
                                        <p><span className="text-gray-300 mr-1 opacity-50">SCH:</span> {app.schoolName}</p>
                                        <p><span className="text-gray-300 mr-1 opacity-50">GRP:</span> {app.twelfthGroup}</p>
                                        <p><span className="text-primary bg-red-50 px-1.5 py-0.5 rounded-md">SCORE: {app.twelfthMark}%</span></p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-secondary text-xs uppercase tracking-tighter italic font-serif">{app.course}</p>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] opacity-60">{app.department}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                        <FaCalendarAlt className="mr-2 text-primary opacity-30" />
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border
                                        ${app.status === 'Approved' ? 'bg-green-500 text-white border-green-600' :
                                            (app.status === 'Rejected' || app.status === 'Cancelled') ? 'bg-red-600 text-white border-red-700' :
                                                app.status === 'Not Eligible' ? 'bg-gray-800 text-white border-black' :
                                                    'bg-yellow-400 text-gray-900 border-yellow-500'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex flex-col items-end space-y-3">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusUpdate(app._id, e.target.value, app.adminComments)}
                                            className="text-[10px] border-2 border-gray-100 bg-white px-4 py-2 rounded-xl font-black uppercase tracking-widest outline-none focus:border-primary focus:ring-4 focus:ring-red-50 transition-all cursor-pointer shadow-sm"
                                        >
                                            <option value="Pending">🟡 Pending</option>
                                            <option value="Approved">🟢 Approved</option>
                                            <option value="Cancelled">🔴 Cancelled</option>
                                            <option value="Not Eligible">⚫ Not Eligible</option>
                                        </select>
                                        <button
                                            onClick={() => {
                                                const remark = prompt('Enter Admin Remark:', app.adminComments || '');
                                                if (remark !== null) handleStatusUpdate(app._id, app.status, remark);
                                            }}
                                            className="flex items-center space-x-2 text-[9px] font-black text-gray-300 hover:text-primary transition-colors uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer"
                                        >
                                            <FaEdit /> <span>Update Logs</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {applications.length === 0 && (
                <div className="text-center py-20 text-gray-300 font-medium italic">
                    No student applications found.
                </div>
            )}
        </div>
    );
};

export default ApplicationList;
