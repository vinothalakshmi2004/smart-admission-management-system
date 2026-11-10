import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FaGraduationCap, FaFileAlt, FaCreditCard, FaUser, FaIdCard, FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle, FaFilePdf, FaDownload, FaRupeeSign, FaBook, FaMoneyBillWave } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../../config';
import { feesFor as computeFees, formatCurrency } from '../../utils/fees';

const ApplicationStatus = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showAdmissionDetails, setShowAdmissionDetails] = useState(false);
    const { user, authConfig } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return undefined;

        const fetchApplications = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/applications/my`, authConfig());
                setApplications(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchApplications();

        // Refresh when the admission office changes one of my applications
        const socket = io(SOCKET_URL);
        socket.on('status_updated', (update) => {
            if (update && String(update.studentId) === String(user._id)) fetchApplications();
        });
        return () => socket.disconnect();
    }, [user, authConfig]);

    const handleAdmissionClick = (app) => {
        setSelectedApp(app);
        setShowAdmissionDetails(true);
    };

    const downloadPDF = (app) => {
        const doc = new jsPDF();
        const fees = computeFees(app);

        // Header
        doc.setFillColor(153, 27, 27);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("RVS COLLEGE OF ARTS & SCIENCE", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Application Confirmation & Fee Receipt", 105, 30, { align: "center" });

        // Personal Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("PERSONAL DETAILS", 14, 55);
        autoTable(doc, {
            startY: 60,
            body: [
                ["Student Name", app.studentName],
                ["Email Address", app.email],
                ["Contact Number", app.contactNumber],
                ["Date of Birth", new Date(app.dob).toLocaleDateString()],
                ["Father's Name", app.fatherName],
                ["Mother's Name", app.motherName],
                ["Aadhar Number", app.aadharNumber],
            ],
            theme: 'grid',
            headStyles: { fillColor: [139, 0, 0] },
            styles: { fontSize: 10 }
        });

        // Academic Details
        doc.text("ACADEMIC DETAILS", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["School Name", app.schoolName],
                ["12th Group", app.twelfthGroup],
                ["12th Mark", app.twelfthMark],
            ],
            theme: 'grid',
            headStyles: { fillColor: [153, 27, 27] },
            styles: { fontSize: 10 }
        });

        // Fee Breakdown
        doc.text("FEE BREAKDOWN", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Admission Fees", formatCurrency(fees.admissionFee)],
                ["One Time Fees", formatCurrency(fees.oneTimeFee)],
                ["Semester Fees (" + app.course + ")", formatCurrency(fees.semesterFee)],
                ["Total Fees", formatCurrency(fees.total)],
            ],
            theme: 'grid',
            headStyles: { fillColor: [153, 27, 27] },
            styles: { fontSize: 10 }
        });

        // Course & Payment Details
        doc.text("COURSE & PAYMENT DETAILS", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Department", app.department],
                ["Course Applied", app.course],
                ["Application ID", app._id.toUpperCase()],
                ["Amount Paid", formatCurrency(app.paidAmount || fees.total)],
                ["Payment ID", app.razorpayPaymentId || '-'],
                ["Payment Method", app.paymentMethod || '-'],
                ["Payment Date", new Date(app.paidAt || app.updatedAt || app.createdAt).toLocaleDateString('en-IN')],
                ["Payment Status", String(app.paymentStatus || '').toUpperCase()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [153, 27, 27] },
            styles: { fontSize: 10 }
        });

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for applying to RVS College of Arts & Science.", 105, doc.lastAutoTable.finalY + 30, { align: "center" });
        doc.text("This is a computer-generated receipt and does not require a signature.", 105, doc.lastAutoTable.finalY + 35, { align: "center" });

        doc.save(`Application_${app.studentName.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="bg-white p-5 sm:p-8 md:p-12 rounded-3xl md:rounded-[40px] shadow-2xl mt-8 border border-gray-100 flex flex-col items-center animate-fadeIn relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-primary opacity-5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

            <h2 className="text-2xl md:text-3xl font-black mb-8 md:mb-12 text-secondary font-serif uppercase tracking-tighter italic flex flex-wrap items-center gap-y-2 self-start relative z-10 break-words">
                <div className="bg-primary text-white p-4 rounded-2xl mr-5 shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform">
                    <FaFileAlt size={24} />
                </div>
                Academic <span className="text-primary font-sans not-italic tracking-normal ml-3">Dossier</span>
            </h2>

            {applications.length === 0 ? (
                <div className="p-8 sm:p-12 md:p-20 text-center bg-neutralLight/50 rounded-3xl md:rounded-[40px] border-4 border-dashed border-gray-100 w-full mb-8 relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 mb-6 shadow-inner">
                        <FaFileAlt size={30} />
                    </div>
                    <p className="text-gray-300 font-black uppercase tracking-[0.4em] italic text-xs">Zero Submissions Detected</p>
                </div>
            ) : (
                <>
                {/* Phones: one card per application */}
                <div className="md:hidden w-full space-y-4 mb-8 relative z-10">
                    {applications.map((app) => {
                        const closed = ['Rejected', 'Cancelled', 'Not Eligible'].includes(app.status);
                        const statusClass = app.status === 'Approved' ? 'bg-green-500 text-white' : closed ? 'bg-red-600 text-white' : 'bg-yellow-400 text-gray-900';
                        return (
                            <div key={app._id} className="rounded-3xl border border-gray-100 shadow-md p-5 bg-white">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest break-words">{app.department}</p>
                                <p className="text-lg font-black text-secondary uppercase italic font-serif break-words mt-1">{app.course}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {app._id.slice(-6)} · 12th: {app.twelfthMark}%</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusClass}`}>{app.status}</span>
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${app.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-50 text-red-600'}`}>
                                        Fees: {app.paymentStatus || 'Pending'}
                                    </span>
                                </div>
                                {app.adminComments && (
                                    <p className="mt-3 text-xs font-bold text-gray-600 break-words">Remark: {app.adminComments}</p>
                                )}
                                <div className="mt-4">
                                    {app.paymentStatus === 'Paid' ? (
                                        <button onClick={() => downloadPDF(app)} className="w-full bg-green-600 text-white py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center border-none cursor-pointer">
                                            <FaDownload className="mr-2" /> Download Receipt
                                        </button>
                                    ) : app.status === 'Approved' ? (
                                        <button onClick={() => handleAdmissionClick(app)} className="w-full bg-primary text-white py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center border-none cursor-pointer">
                                            <FaGraduationCap className="mr-2" /> Proceed to Pay
                                        </button>
                                    ) : (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{closed ? 'Application closed' : 'Under review by the admission office'}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Tablets and larger: table */}
                <div className="hidden md:block overflow-x-auto w-full mb-10 relative z-10 rounded-3xl border border-gray-100 shadow-inner">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-5 sm:px-8 py-6 text-left border-none">Applicant Identity</th>
                                <th className="px-6 py-6 text-left border-none">Administrative Node</th>
                                <th className="px-6 py-6 text-left border-none">Target Faculty</th>
                                <th className="px-6 py-6 text-left border-none">Metric</th>
                                <th className="px-6 py-6 text-left border-none">Admission State</th>
                                <th className="px-6 py-6 text-left border-none">Ledger State</th>
                                <th className="px-5 sm:px-8 py-6 text-right border-none">Executive Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50 bg-white">
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-red-50/30 transition-all duration-300 group/row border-none">
                                    <td className="px-5 sm:px-8 py-6">
                                        <p className="text-sm font-black text-gray-800 uppercase italic font-serif tracking-tight group-hover/row:text-primary transition-colors">{app.studentName || user.name}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60">System ID: {app._id.slice(-6)}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight opacity-70">{app.department || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-xs font-black italic uppercase text-secondary font-serif group-hover/row:translate-x-1 transition-transform">{app.course || 'Not Selected'}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-[10px] font-black text-primary bg-red-50 px-3 py-1 rounded-lg w-fit shadow-sm">{app.twelfthMark || '0.0'}%</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border
                                            ${app.status === 'Approved' ? 'bg-green-500 text-white border-green-600' :
                                                ['Rejected', 'Cancelled', 'Not Eligible'].includes(app.status) ? 'bg-red-600 text-white border-red-700' :
                                                    'bg-yellow-400 text-gray-900 border-yellow-500'}`}
                                        >
                                            {app.status}
                                        </span>
                                        {app.adminComments && (
                                            <p className="mt-2 max-w-[220px] text-[10px] font-bold text-gray-500 normal-case">
                                                Remark: {app.adminComments}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border
                                            ${app.paymentStatus === 'Paid' ? 'bg-green-500 text-white border-green-600' : 'bg-red-50 text-red-600 border-red-100'}`}
                                        >
                                            {app.paymentStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-5 sm:px-8 py-6 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            {app.status === 'Approved' && app.paymentStatus !== 'Paid' && (
                                                <button
                                                    onClick={() => handleAdmissionClick(app)}
                                                    className="bg-primary text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-100 flex items-center transform active:scale-95 border-none cursor-pointer group/btn"
                                                >
                                                    <FaGraduationCap className="mr-2 text-sm group-hover/btn:animate-wiggle" /> PROCEED
                                                </button>
                                            )}
                                            {app.paymentStatus === 'Paid' ? (
                                                <button
                                                    onClick={() => downloadPDF(app)}
                                                    className="bg-green-600 text-white px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-green-100 flex items-center transform active:scale-95 group/pdf border-none cursor-pointer"
                                                >
                                                    <FaDownload className="mr-2 group-hover/pdf:animate-bounce" /> DOWNLOAD
                                                </button>
                                            ) : (
                                                app.status === 'Approved' ? null : app.status === 'Pending' ? (
                                                    <span className="text-gray-300 font-black text-[9px] uppercase tracking-[0.3em] flex items-center italic opacity-40">
                                                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                                                        In-Review
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 font-black text-[9px] uppercase tracking-[0.3em] italic">
                                                        Closed
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ADMISSION DETAILS + FEE STRUCTURE  (only when Approved)   */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {showAdmissionDetails && selectedApp && selectedApp.status === 'Approved' && (() => {
                const fees = computeFees(selectedApp);
                return (
                    <div className="w-full max-w-4xl mt-12 animate-fadeIn border-t-4 border-[#8B0000] pt-12">
                        <div className="bg-white rounded-3xl md:rounded-[40px] shadow-2xl p-5 sm:p-8 md:p-10 border border-gray-100 relative overflow-hidden group">
                            {/* Background decor */}
                            <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                                <FaGraduationCap size={300} />
                            </div>

                            {/* ── Header ── */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-10 pb-6 border-b border-gray-100">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-800 font-serif uppercase tracking-tight italic mb-2">Student Admission Details</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase">Verified Registration | Session 2026-27</p>
                                </div>
                                <div className="mt-4 md:mt-0 px-6 py-2 bg-green-50 rounded-full border border-green-200">
                                    <span className="text-[10px] font-black text-green-700 uppercase flex items-center">
                                        <FaCheckCircle className="mr-2" /> Application Approved
                                    </span>
                                </div>
                            </div>

                            {/* ── Student Info Grid ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 md:gap-x-16">
                                <div className="space-y-6">
                                    <div className="flex items-center group min-w-0 [&>div:last-child]:min-w-0 [&_p]:break-words">
                                        <div className="w-12 h-12 shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-[#8B0000] mr-4 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all">
                                            <FaUser />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</p>
                                            <p className="text-lg font-black text-gray-800 italic uppercase">{user.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center group min-w-0 [&>div:last-child]:min-w-0 [&_p]:break-words">
                                        <div className="w-12 h-12 shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-[#8B0000] mr-4 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all">
                                            <FaIdCard />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Register Number / Application ID</p>
                                            <p className="text-lg font-black text-gray-800 italic uppercase">{selectedApp._id.slice(-8)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center group min-w-0 [&>div:last-child]:min-w-0 [&_p]:break-words">
                                        <div className="w-12 h-12 shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-[#8B0000] mr-4 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all">
                                            <FaEnvelope />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-bold text-gray-700 italic break-all">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center group min-w-0 [&>div:last-child]:min-w-0 [&_p]:break-words">
                                        <div className="w-12 h-12 shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-[#8B0000] mr-4 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all">
                                            <FaGraduationCap />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Course</p>
                                            <p className="text-lg font-black text-gray-800 italic uppercase">{selectedApp.course}</p>
                                            <p className="text-[10px] font-bold text-[#8B0000] uppercase tracking-tighter opacity-60">{selectedApp.department}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center group min-w-0 [&>div:last-child]:min-w-0 [&_p]:break-words">
                                        <div className="w-12 h-12 shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-[#8B0000] mr-4 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all">
                                            <FaPhone />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Number</p>
                                            <p className="text-sm font-bold text-gray-700 italic">{user.contactNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center group min-w-0 [&>div:last-child]:min-w-0 [&_p]:break-words">
                                        <div className="w-12 h-12 shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-[#8B0000] mr-4 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all">
                                            <FaCalendarAlt />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Application Date</p>
                                            <p className="text-sm font-bold text-gray-700 italic">{new Date(selectedApp.createdAt).toLocaleDateString('en-GB')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ═══════════════════════════════════════════ */}
                            {/* ── FEE STRUCTURE BREAKDOWN ──             */}
                            {/* ═══════════════════════════════════════════ */}
                            <div className="mt-12 pt-10 border-t-2 border-dashed border-gray-200">
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-[#8B0000] rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-gray-800 font-serif uppercase tracking-tight italic">Fee Structure</h4>
                                        <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Breakdown for {selectedApp.course}</p>
                                    </div>
                                </div>

                                <div className="bg-[#FAF9F6] rounded-3xl p-4 sm:p-8 space-y-0 border border-gray-100 shadow-inner">
                                    {/* Admission Fee */}
                                    <div className="flex justify-between items-center gap-3 py-5 border-b border-gray-200 [&>div:first-child]:min-w-0 [&_p]:break-words">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 shrink-0 bg-white rounded-xl flex items-center justify-center text-[#8B0000] mr-3 sm:mr-4 shadow-sm">
                                                <FaBook className="text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-700 uppercase">Admission Fees</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Common for all students</p>
                                            </div>
                                        </div>
                                        <p className="text-base sm:text-lg font-black text-gray-800 shrink-0 whitespace-nowrap">{formatCurrency(fees.admissionFee)}</p>
                                    </div>

                                    {/* One Time Fee */}
                                    <div className="flex justify-between items-center gap-3 py-5 border-b border-gray-200 [&>div:first-child]:min-w-0 [&_p]:break-words">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 shrink-0 bg-white rounded-xl flex items-center justify-center text-[#8B0000] mr-3 sm:mr-4 shadow-sm">
                                                <FaFileAlt className="text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-700 uppercase">One Time Fees</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Common for all students</p>
                                            </div>
                                        </div>
                                        <p className="text-base sm:text-lg font-black text-gray-800 shrink-0 whitespace-nowrap">{formatCurrency(fees.oneTimeFee)}</p>
                                    </div>

                                    {/* Semester Fee (Dynamic) */}
                                    <div className="flex justify-between items-center gap-3 py-5 border-b border-gray-200 [&>div:first-child]:min-w-0 [&_p]:break-words">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 shrink-0 bg-white rounded-xl flex items-center justify-center text-[#8B0000] mr-3 sm:mr-4 shadow-sm">
                                                <FaGraduationCap className="text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-700 uppercase">Semester Fees</p>
                                                <p className="text-[9px] font-bold text-[#8B0000] uppercase tracking-widest">Based on: {selectedApp.course}</p>
                                            </div>
                                        </div>
                                        <p className="text-base sm:text-lg font-black text-[#8B0000] shrink-0 whitespace-nowrap">{formatCurrency(fees.semesterFee)}</p>
                                    </div>

                                    {/* ── TOTAL ── */}
                                    <div className="flex flex-wrap justify-between items-center gap-3 pt-6 mt-2">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[#8B0000] rounded-xl flex items-center justify-center text-white mr-4 shadow-lg">
                                                <FaRupeeSign />
                                            </div>
                                            <p className="text-xl font-black text-gray-900 uppercase tracking-tight">Total Fees</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl md:text-3xl font-black text-[#8B0000] italic">{formatCurrency(fees.total)}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Payable at admission</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Pay Now Button ── */}
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={() => navigate('/student/payment', { state: { app: selectedApp, fees: computeFees(selectedApp) } })}
                                    className="w-full md:w-auto bg-gradient-to-r from-[#8B0000] to-black text-white px-8 sm:px-12 md:px-20 py-5 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center shadow-2xl transform transition-all hover:scale-105 active:scale-95 group/btn"
                                >
                                    <FaCreditCard className="mr-3 text-lg group-hover/btn:animate-bounce" /> Pay Now — {formatCurrency(fees.total)}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default ApplicationStatus;
