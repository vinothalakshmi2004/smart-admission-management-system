import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { FaEdit, FaUserAlt, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { API_URL, SOCKET_URL } from '../../config';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const { authConfig } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const fetchApplications = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/applications`, authConfig());
            setApplications(data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Could not load applications');
        } finally {
            setLoading(false);
        }
    }, [authConfig]);

    useEffect(() => {
        fetchApplications();

        const socket = io(SOCKET_URL);
        socket.on('new_application', () => {
            toast.info('New student application submitted!');
            fetchApplications();
        });

        return () => socket.disconnect();
    }, [fetchApplications]);

    // changes: { status } or { adminComments }
    const updateApplication = async (id, changes, successMessage) => {
        try {
            await axios.put(`${API_URL}/api/applications/${id}/status`, changes, authConfig());
            toast.success(successMessage);
            fetchApplications();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update application');
        }
    };

    // Uploaded documents are private: fetch with the login token, then open.
    const openDocument = async (studentId, type) => {
        const tab = window.open('', '_blank');
        try {
            const response = await axios.get(
                `${API_URL}/api/students/${studentId}/documents/${type}`,
                authConfig({ responseType: 'blob' })
            );
            const url = URL.createObjectURL(response.data);
            if (tab) tab.location.href = url;
            else window.location.href = url;
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) {
            if (tab) tab.close();
            toast.error(error.response?.status === 404 ? 'Document not uploaded' : 'Could not open the document');
        }
    };

    if (loading) return <div className="p-8 sm:p-12 md:p-20 text-center text-primary font-bold animate-pulse">Loading Applications...</div>;

    return (
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border border-gray-100 animate-fadeIn">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 md:mb-10 border-b border-gray-100 pb-6 md:pb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter font-serif italic">Active <span className="text-primary font-sans not-italic tracking-normal">Admissions</span></h2>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em] flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Status: {applications.length} Applications Detected
                    </p>
                </div>
                <button
                    onClick={fetchApplications}
                    className="bg-primary text-white text-[10px] font-black px-5 sm:px-8 py-3 rounded-full hover:bg-secondary transition-all shadow-xl uppercase tracking-widest border-none cursor-pointer active:scale-95"
                >
                    Refresh Records
                </button>
            </header>

            <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-inner">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-primary text-white uppercase text-[10px] font-black tracking-widest">
                            <th className="px-5 sm:px-8 py-6 text-left border-none">Applicant Identity</th>
                            <th className="px-5 sm:px-8 py-6 text-left border-none">Academic Credentials</th>
                            <th className="px-5 sm:px-8 py-6 text-left border-none">Target Course</th>
                            <th className="px-5 sm:px-8 py-6 text-left border-none">Registration Date</th>
                            <th className="px-5 sm:px-8 py-6 text-left border-none">Current Status</th>
                            <th className="px-5 sm:px-8 py-6 text-right border-none">Management Interface</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-red-50/30 transition-colors group">
                                <td className="px-5 sm:px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center text-primary mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                            <FaUserAlt size={16} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 text-sm uppercase italic font-serif tracking-tighter">{app.studentName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold lowercase tracking-normal">{app.email}</p>
                                            <p className="text-[9px] text-red-600 font-black mt-1 uppercase tracking-widest">Ph: {app.contactNumber}</p>
                                            {app.studentId?._id && (
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openDocument(app.studentId._id, 'communityCertificate')}
                                                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary bg-red-50 px-2 py-1 rounded-md border-none cursor-pointer hover:bg-red-100"
                                                    >
                                                        <FaFileAlt /> Certificate
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDocument(app.studentId._id, 'marksheet')}
                                                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary bg-red-50 px-2 py-1 rounded-md border-none cursor-pointer hover:bg-red-100"
                                                    >
                                                        <FaFileAlt /> Marksheet
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 sm:px-8 py-6">
                                    <div className="text-[10px] space-y-1.5 font-bold uppercase tracking-tight text-gray-600">
                                        <p><span className="text-gray-300 mr-1 opacity-50">SCH:</span> {app.schoolName}</p>
                                        <p><span className="text-gray-300 mr-1 opacity-50">GRP:</span> {app.twelfthGroup}</p>
                                        <p><span className="text-primary bg-red-50 px-1.5 py-0.5 rounded-md">SCORE: {app.twelfthMark}%</span></p>
                                    </div>
                                </td>
                                <td className="px-5 sm:px-8 py-6">
                                    <p className="font-black text-secondary text-xs uppercase tracking-tighter italic font-serif">{app.course}</p>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] opacity-60">{app.department}</p>
                                </td>
                                <td className="px-5 sm:px-8 py-6">
                                    <div className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                        <FaCalendarAlt className="mr-2 text-primary opacity-30" />
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-5 sm:px-8 py-6">
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border
                                        ${app.status === 'Approved' ? 'bg-green-500 text-white border-green-600' :
                                            (app.status === 'Rejected' || app.status === 'Cancelled') ? 'bg-red-600 text-white border-red-700' :
                                                app.status === 'Not Eligible' ? 'bg-gray-800 text-white border-black' :
                                                    'bg-yellow-400 text-gray-900 border-yellow-500'}`}>
                                        {app.status}
                                    </span>
                                    <p className={`mt-3 text-[9px] font-black uppercase tracking-widest ${app.paymentStatus === 'Paid' ? 'text-green-600' : 'text-gray-400'}`}>
                                        Fees: {app.paymentStatus || 'Pending'}{app.paymentStatus === 'Paid' && app.paymentMethod ? ` (${app.paymentMethod})` : ''}
                                    </p>
                                    {app.razorpayPaymentId && (
                                        <p className="text-[9px] font-bold text-gray-400 tracking-wide">Payment ID: {app.razorpayPaymentId}</p>
                                    )}
                                    {app.adminComments && (
                                        <p className="mt-1 max-w-[200px] text-[10px] text-gray-500 font-bold">Remark: {app.adminComments}</p>
                                    )}
                                </td>
                                <td className="px-5 sm:px-8 py-6 text-right">
                                    <div className="flex flex-col items-end space-y-3">
                                        <select
                                            value={app.status}
                                            onChange={(e) => updateApplication(app._id, { status: e.target.value }, `Application marked as ${e.target.value}`)}
                                            className="text-[10px] border-2 border-gray-100 bg-white px-4 py-2 rounded-xl font-black uppercase tracking-widest outline-none focus:border-primary focus:ring-4 focus:ring-red-50 transition-all cursor-pointer shadow-sm"
                                        >
                                            <option value="Pending">🟡 Pending</option>
                                            <option value="Approved">🟢 Approved</option>
                                            <option value="Rejected">🔴 Rejected</option>
                                            <option value="Cancelled">🔴 Cancelled</option>
                                            <option value="Not Eligible">⚫ Not Eligible</option>
                                        </select>
                                        <button
                                            onClick={() => {
                                                const remark = prompt('Enter remark for the student (leave empty to clear):', app.adminComments || '');
                                                if (remark !== null) updateApplication(app._id, { adminComments: remark }, 'Remark saved');
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
