import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { API_URL, SOCKET_URL } from '../config';

const ApplicationStatus = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchApplications = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`${API_URL}/api/applications/my`, config);
                setApplications(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load applications');
                setLoading(false);
            }
        };

        fetchApplications();

        // Real-time Updates
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('status_updated', (updatedApp) => {
            // Check if the updated app belongs to the current list
            setApplications((prevApps) => {
                const exists = prevApps.find(app => app._id === updatedApp._id);
                if (exists) {
                    toast.info(`Application status updated: ${updatedApp.status}`);
                    return prevApps.map(app => app._id === updatedApp._id ? updatedApp : app);
                }
                return prevApps;
            });
        });

        return () => {
            socket.disconnect();
        };

    }, [user, navigate]);

    if (loading) return <div className="p-5 sm:p-8 md:p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10 uppercase font-serif tracking-tight">My Applications</h1>

            {applications.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p>You have not submitted any applications yet.</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto grid gap-6">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center transition hover:shadow-2xl">
                            <div>
                                <h3 className="text-xl font-black text-primary uppercase tracking-tight">{app.course}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{app.department}</p>
                                <div className="mt-4 space-y-1">
                                    <p className="text-sm text-gray-700 font-medium"><strong>Applicant:</strong> {app.studentName}</p>
                                    <p className="text-sm text-gray-500"><strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 text-center md:text-right min-w-[150px]">
                                <div className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm inline-block
                                    ${app.status === 'Approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                                        (app.status === 'Rejected' || app.status === 'Cancelled') ? 'bg-red-100 text-red-700 border border-red-200' :
                                            app.status === 'Not Eligible' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                                                'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                    {app.status === 'Pending' && '🟡 '}
                                    {app.status === 'Approved' && '🟢 '}
                                    {(app.status === 'Rejected' || app.status === 'Cancelled') && '🔴 '}
                                    {app.status === 'Not Eligible' && '⚫ '}
                                    {app.status}
                                </div>
                                {app.adminComments && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter mb-1">Admin Remark</p>
                                        <p className="text-xs text-gray-600 italic">"{app.adminComments}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationStatus;
