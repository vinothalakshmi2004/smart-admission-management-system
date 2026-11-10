import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaEye, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaSchool, FaBookOpen } from 'react-icons/fa';

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/enquiries', config);
                setEnquiries(data);
                setLoading(false);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch enquiries');
                setLoading(false);
            }
        };
        fetchEnquiries();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`http://localhost:5000/api/enquiries/${id}`, config);
                setEnquiries(enquiries.filter((e) => e._id !== id));
                toast.success('Enquiry deleted');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete');
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-black animate-pulse text-[#8B0000] uppercase tracking-widest text-xs">Accessing Secure Database...</div>;

    return (
        <div className="bg-white rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 animate-fadeIn relative p-2 transition-all">
            <div className="p-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex items-center">
                    <div className="bg-primary text-white p-5 rounded-3xl shadow-2xl transform -rotate-3 mr-6 group-hover:rotate-0 transition-transform">
                        <FaBookOpen size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black italic font-serif text-secondary uppercase tracking-tighter">
                            Inquiry <span className="text-primary font-sans not-italic tracking-normal">Intelligence</span>
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 flex items-center opacity-70">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                            Live Lead Acquisition Stream
                        </p>
                    </div>
                </div>
                <div className="bg-neutralLight text-primary px-8 py-4 rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] border border-red-100 shadow-sm flex items-center group">
                    <span className="text-gray-300 mr-3 opacity-50 group-hover:text-primary transition-colors">Total Capture:</span>
                    {enquiries.length} PROSPECTS
                </div>
            </div>

            <div className="overflow-x-auto px-8 pb-12">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="py-7 px-8 rounded-l-3xl border-none">Applicant Identity</th>
                            <th className="py-7 px-4 border-none">Communication Link</th>
                            <th className="py-7 px-4 border-none">Social Background</th>
                            <th className="py-7 px-4 border-none">Academic Goals</th>
                            <th className="py-7 px-4 border-none">Timestamp</th>
                            <th className="py-7 px-8 text-center rounded-r-3xl border-none">Authority Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50 bg-white">
                        {enquiries.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-32 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 border-4 border-dashed border-gray-100">
                                            <FaBookOpen size={30} />
                                        </div>
                                        <p className="font-black text-gray-300 uppercase italic tracking-[0.5em] text-xs">Zero Leads Registered</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            enquiries.map((e) => (
                                <tr key={e._id} className="hover:bg-red-50/40 group transition-all duration-300 cursor-default border-none">
                                    <td className="py-8 px-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-800 uppercase italic font-serif tracking-tight group-hover:text-primary transition-colors flex items-center">
                                                {e.studentName}
                                                <div className="w-1.5 h-1.5 bg-primary ml-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </span>
                                            <span className="text-[9px] font-black text-gray-300 uppercase mt-2 flex items-center tracking-widest opacity-60">
                                                <FaCalendarAlt className="mr-2 text-primary opacity-30" /> BIRTH: {new Date(e.dob).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-[10px] font-black text-red-700 uppercase tracking-widest bg-red-50/50 px-3 py-1.5 rounded-xl border border-red-100/50 w-fit">
                                                <FaPhoneAlt size={9} className="mr-3 text-primary" /> {e.mobileNumber}
                                            </div>
                                            <div className="flex items-center text-[10px] font-bold text-gray-400 lowercase truncate max-w-[150px] pl-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <FaEnvelope size={9} className="mr-3 text-primary opacity-30" /> {e.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4">
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-gray-500 uppercase italic tracking-tight flex items-center">
                                                <span className="text-gray-200 mr-2 opacity-50 font-sans not-italic">PRNT:</span> {e.fatherName}
                                            </div>
                                            <div className="flex items-center text-[10px] font-bold text-gray-300 uppercase mt-1 tracking-tighter opacity-70">
                                                <FaSchool size={10} className="mr-3 text-primary opacity-20" /> {e.schoolName}
                                            </div>
                                            <div className="text-[9px] font-black text-primary uppercase italic mt-1 bg-red-50 w-fit px-2 py-0.5 rounded-md shadow-sm">GROUP: {e.twelfth_group}</div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4">
                                        <div className="space-y-3">
                                            <div className="inline-block bg-white border-2 border-primary/20 px-4 py-2 rounded-2xl text-[9px] font-black text-primary uppercase italic tracking-tighter shadow-sm group-hover:border-primary transition-colors">
                                                <span className="text-gray-300 mr-2 opacity-50 font-black font-sans not-italic">01</span> {e.course1}
                                            </div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase italic tracking-tighter block pl-4 border-l border-gray-100 opacity-60">
                                                {e.course2} • {e.course3}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest opacity-40">{new Date(e.createdAt).toLocaleDateString('en-GB')}</span>
                                            <span className="text-[8px] font-bold text-gray-300 uppercase mt-1">{new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10 text-center">
                                        <button
                                            onClick={() => deleteHandler(e._id)}
                                            className="p-4 bg-gray-50 border-none rounded-2xl text-gray-300 hover:bg-black hover:text-white transition-all transform active:scale-90 cursor-pointer shadow-sm group-hover:bg-red-50 group-hover:text-red-600 group-hover:shadow-md"
                                            title="Archive Lead Entry"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnquiryList;
