import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaUniversity, FaMobileAlt, FaLock, FaCheckCircle, FaChevronLeft, FaRupeeSign, FaDownload, FaFilePdf, FaArrowRight, FaQrcode, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Dynamic fee calculation (same as ApplicationStatus) ──
const SEMESTER_FEE_MAP = {
    'computer science': 30000,
    'commerce': 22000,
    'electronics': 25000,
    'maths': 22000,
    'mathematics': 22000,
    'language': 18000,
    'english literature': 22000,
    'management': 60000,
    'science': 25000,
};
const ADMISSION_FEE = 5000;
const ONE_TIME_FEE = 10000;

const getSemesterFee = (course = '', department = '') => {
    const combined = `${course} ${department}`.toLowerCase();
    if (combined.includes('master') || combined.includes('m.sc') || combined.includes('m.a') || combined.includes('m.com') || combined.includes('mba') || combined.includes('mca') || combined.includes('pg')) return 35000;
    for (const [key, fee] of Object.entries(SEMESTER_FEE_MAP)) { if (combined.includes(key)) return fee; }
    return 25000;
};

const computeFees = (app) => {
    const semesterFee = getSemesterFee(app?.course, app?.department);
    const total = ADMISSION_FEE + ONE_TIME_FEE + semesterFee;
    return { admissionFee: ADMISSION_FEE, oneTimeFee: ONE_TIME_FEE, semesterFee, total };
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { app, fees: passedFees } = location.state || {};
    // Use fees from navigation state, or compute dynamically as fallback
    const fees = passedFees || (app ? computeFees(app) : { admissionFee: 5000, oneTimeFee: 10000, semesterFee: 25000, total: 40000 });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(app?.paymentStatus === 'Paid');
    const [transactionId, setTransactionId] = useState(app?._id ? `TXN${app._id.slice(-6).toUpperCase()}${Math.floor(Math.random() * 1000)}` : '');

    // Form States
    const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [netBanking, setNetBanking] = useState({ bank: '', username: '', password: '' });

    if (!app) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
                <p className="text-gray-500 font-bold mb-4">No payment details found.</p>
                <button onClick={() => navigate('/student/dashboard')} className="text-[#8B0000] font-black uppercase text-xs underline">Back to Dashboard</button>
            </div>
        );
    }

    const validateForm = () => {
        if (paymentMethod === 'card') {
            return cardDetails.number.length === 16 && cardDetails.name && cardDetails.expiry.length === 5 && cardDetails.cvv.length === 3;
        }
        if (paymentMethod === 'upi') {
            return upiId.includes('@');
        }
        if (paymentMethod === 'net') {
            return netBanking.bank && netBanking.username && netBanking.password;
        }
        return false;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please enter valid details for the selected payment method.");
            return;
        }

        setIsProcessing(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const fakeTxnId = `RVS${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            setTransactionId(fakeTxnId);

            await axios.put(`http://localhost:5000/api/applications/${app._id}/pay`, {
                paymentMethod: paymentMethod.toUpperCase()
            }, config);

            // Simulate Banking Processing
            setTimeout(() => {
                setIsProcessing(false);
                setIsPaid(true);
                toast.success(`Admission Fee of ${formatCurrency(fees.total)} Paid Successfully via ${paymentMethod.toUpperCase()}!`, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                });
            }, 2500);
        } catch (error) {
            setIsProcessing(false);
            toast.error(error.response?.data?.message || 'Payment confirmation failed');
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFillColor(139, 0, 0); doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold");
        doc.text("RVS COLLEGE OF ARTS & SCIENCE", 105, 20, { align: "center" });
        doc.setFontSize(12); doc.setFont("helvetica", "normal");
        doc.text("Application Confirmation & Fee Receipt", 105, 30, { align: "center" });
        doc.setTextColor(0, 0, 0); doc.setFontSize(14); doc.text("PERSONAL DETAILS", 14, 55);
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
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.text("ACADEMIC DETAILS", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [["School Name", app.schoolName], ["12th Group", app.twelfthGroup], ["12th Mark", app.twelfthMark]],
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.text("FEE BREAKDOWN", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Admission Fees", formatCurrency(fees.admissionFee)],
                ["One Time Fees", formatCurrency(fees.oneTimeFee)],
                ["Semester Fees (" + app.course + ")", formatCurrency(fees.semesterFee)],
                ["Total Fees", formatCurrency(fees.total)],
            ],
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.text("COURSE & PAYMENT DETAILS", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Department", app.department],
                ["Course Applied", app.course],
                ["Application ID", app._id.toUpperCase()],
                ["Amount Paid", formatCurrency(fees.total)],
                ["Transaction ID", transactionId],
                ["Payment Date", new Date().toLocaleDateString()],
                ["Payment Status", "SUCCESSFUL"],
            ],
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("Thank you for applying to RVS College of Arts & Science.", 105, doc.lastAutoTable.finalY + 30, { align: "center" });
        doc.save(`Application_${app.studentName.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen pb-20 pt-10 px-4 font-sans">
            <div className="container mx-auto max-w-6xl">
                {!isPaid ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Summary */}
                        <div className="lg:col-span-4 space-y-6">
                            <button onClick={() => navigate(-1)} className="flex items-center text-[#8B0000] font-black uppercase tracking-widest text-[10px] mb-4 hover:translate-x-1 transition-all"><FaChevronLeft className="mr-2" /> Back</button>
                            <div className="bg-[#8B0000] rounded-[30px] p-8 text-white shadow-2xl relative overflow-hidden">
                                <h2 className="text-2xl font-black italic uppercase italic mb-8">Billing Summary</h2>
                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <p className="text-[10px] font-black text-red-200 uppercase tracking-widest leading-none">Candidate Detail</p>
                                    <p className="text-lg font-black truncate text-white uppercase italic">{app.studentName}</p>
                                    <p className="text-[10px] font-black text-red-200 uppercase tracking-widest leading-none mt-2">Course</p>
                                    <p className="text-sm font-black truncate text-white uppercase italic">{app.course}</p>
                                    <div className="bg-white/10 p-4 rounded-2xl space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold text-red-100 uppercase"><span>Admission Fees</span><span>{formatCurrency(fees.admissionFee)}</span></div>
                                        <div className="flex justify-between text-[10px] font-bold text-red-100 uppercase"><span>One Time Fees</span><span>{formatCurrency(fees.oneTimeFee)}</span></div>
                                        <div className="flex justify-between text-[10px] font-bold text-red-100 uppercase"><span>Semester Fees</span><span>{formatCurrency(fees.semesterFee)}</span></div>
                                        <div className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                                            <p className="text-[10px] font-black text-red-200 uppercase">Total Fee Payable</p>
                                            <p className="text-2xl font-black">{formatCurrency(fees.total)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-[10px] font-black text-red-100 uppercase tracking-tighter opacity-80"><FaShieldAlt className="mr-2" /> PCI DSS COMPLIANT GATEWAY</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Payment Interactive Area */}
                        <form onSubmit={handlePayment} className="lg:col-span-8 bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12">
                            <h3 className="text-xl font-black text-gray-800 uppercase italic mb-10 border-l-8 border-[#8B0000] pl-6">Secure Payment Terminal</h3>

                            {/* Method Selection Tabs */}
                            <div className="flex flex-wrap gap-4 mb-10">
                                {[
                                    { id: 'card', label: 'Credit/Debit Card', icon: <FaCreditCard /> },
                                    { id: 'upi', label: 'UPI / GPay / QR', icon: <FaMobileAlt /> },
                                    { id: 'net', label: 'Net Banking', icon: <FaUniversity /> }
                                ].map(m => (
                                    <button
                                        key={m.id} type="button"
                                        onClick={() => setPaymentMethod(m.id)}
                                        className={`flex items-center px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${paymentMethod === m.id ? 'bg-[#8B0000] text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                    >
                                        <span className="mr-3 text-lg">{m.icon}</span> {m.label}
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Forms */}
                            <div className="min-h-[300px] animate-fadeIn">
                                {paymentMethod === 'card' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Holder Name</label>
                                                <input type="text" placeholder="AS APPEARS ON CARD" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold uppercase" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Number (16 Digits)</label>
                                                <input type="text" maxLength="16" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '') })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry (MM/YY)</label>
                                                <input type="text" maxLength="5" placeholder="MM/YY" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold" value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CVV</label>
                                                <input type="password" maxLength="3" placeholder="***" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold" value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <div className="flex flex-col md:flex-row items-center gap-10">
                                        <div className="bg-gray-100 p-6 rounded-3xl border-2 border-dashed border-gray-300">
                                            <FaQrcode size={120} className="text-gray-400" />
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-4 text-center">Scan to Pay</p>
                                        </div>
                                        <div className="flex-grow space-y-4 w-full">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enter VPA / UPI ID</label>
                                            <input type="text" placeholder="example@oksbi" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold" value={upiId} onChange={e => setUpiId(e.target.value)} />
                                            <p className="text-[10px] text-gray-400 font-bold uppercase italic tracking-tighter">Enter a valid UPI ID (e.g. name@bank)</p>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'net' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Your Bank</label>
                                            <select className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold" value={netBanking.bank} onChange={e => setNetBanking({ ...netBanking, bank: e.target.value })}>
                                                <option value="">CHOOSE FROM LIST</option>
                                                <option value="sbi">STATE BANK OF INDIA</option>
                                                <option value="hdfc">HDFC BANK</option>
                                                <option value="icici">ICICI BANK</option>
                                                <option value="axis">AXIS BANK</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Netbanking Username</label>
                                                <input type="text" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold" value={netBanking.username} onChange={e => setNetBanking({ ...netBanking, username: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secret Password</label>
                                                <input type="password" title="SecurePasswordField" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold" value={netBanking.password} onChange={e => setNetBanking({ ...netBanking, password: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing || !validateForm()}
                                className={`w-full mt-10 p-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center ${isProcessing ? 'bg-gray-400' : (validateForm() ? 'bg-[#8B0000] text-white hover:bg-black transform active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed')}`}
                            >
                                {isProcessing ? (
                                    <><div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></div> BANKING AUTHORIZATION IN PROGRESS...</>
                                ) : `VALIDATE & AUTHORIZE ${formatCurrency(fees.total)}`}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Success Terminal View */
                    <div className="max-w-4xl mx-auto animate-fadeIn">
                        <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-gray-100">
                            <div className="bg-green-600 p-16 text-center text-white relative">
                                <FaCheckCircle className="mx-auto text-9xl mb-6 animate-scaleIn" />
                                <h1 className="text-5xl font-black italic uppercase tracking-tighter">Transaction Verified</h1>
                                <p className="mt-4 text-green-100 font-black uppercase tracking-widest text-[10px]">Reference: {transactionId}</p>
                            </div>
                            <div className="p-12 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 p-10 rounded-[40px]">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-[#8B0000] border-b-2 border-red-100 pb-2 uppercase tracking-widest">Admission Receipt</p>
                                        {[
                                            { l: "Candidate", v: app.studentName },
                                            { l: "Course", v: app.course },
                                            { l: "Method", v: paymentMethod.toUpperCase() },
                                        ].map((x, i) => (
                                            <div key={i} className="flex justify-between items-center"><span className="text-[9px] font-black text-gray-400 uppercase">{x.l}</span><span className="text-sm font-black text-gray-800 uppercase italic">{x.v}</span></div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-[#8B0000] border-b-2 border-red-100 pb-2 uppercase tracking-widest">Financial Summary</p>
                                        {[
                                            { l: "Amount Paid", v: formatCurrency(fees.total) },
                                            { l: "Status", v: "PROCESSED", c: "text-green-600" },
                                            { l: "Timeline", v: new Date().toLocaleDateString('en-GB') },
                                        ].map((x, i) => (
                                            <div key={i} className="flex justify-between items-center"><span className="text-[9px] font-black text-gray-400 uppercase">{x.l}</span><span className={`text-sm font-black uppercase italic ${x.c || 'text-gray-800'}`}>{x.v}</span></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                                    <button onClick={downloadPDF} className="flex items-center px-12 py-5 bg-green-600 text-white rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-xl group"><FaFilePdf className="mr-3 text-lg group-hover:scale-110" /> Download Enrollment PDF</button>
                                    <button onClick={() => navigate('/student/dashboard')} className="flex items-center px-12 py-5 border-4 border-[#8B0000] text-[#8B0000] rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-[#8B0000] hover:text-white transition-all group">Terminal Dashboard <FaArrowRight className="ml-3 group-hover:translate-x-1" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
