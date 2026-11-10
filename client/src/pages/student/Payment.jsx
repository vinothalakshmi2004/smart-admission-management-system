import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaUniversity, FaMobileAlt, FaLock, FaCheckCircle, FaChevronLeft, FaFilePdf, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AuthContext from '../../context/AuthContext';
import { API_URL } from '../../config';
import { feesFor, formatCurrency } from '../../utils/fees';

const COLLEGE_NAME = 'RVS College of Arts and Science';
const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

// Load Razorpay Checkout once
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
        const script = existing || document.createElement('script');
        script.addEventListener('load', () => resolve(true));
        script.addEventListener('error', () => resolve(false));
        if (!existing) {
            script.src = RAZORPAY_SCRIPT;
            script.async = true;
            document.body.appendChild(script);
        }
    });

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { authConfig } = useContext(AuthContext);
    const { app } = location.state || {};
    const fees = feesFor(app); // fees stored on the application by the server

    const [payConfig, setPayConfig] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paidApp, setPaidApp] = useState(app?.paymentStatus === 'Paid' ? app : null);

    useEffect(() => {
        axios.get(`${API_URL}/api/payments/config`)
            .then(({ data }) => setPayConfig(data))
            .catch(() => setPayConfig({ enabled: false, demoPayment: false }));
    }, []);

    if (!app) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
                <p className="text-gray-500 font-bold mb-4">No payment details found.</p>
                <button onClick={() => navigate('/student/dashboard')} className="text-[#8B0000] font-black uppercase text-xs underline">Back to Dashboard</button>
            </div>
        );
    }

    const onPaid = (updated) => {
        setPaidApp(updated);
        setIsProcessing(false);
        toast.success(`Admission fee of ${formatCurrency(updated.paidAmount || fees.total)} paid successfully!`, { position: 'top-center', autoClose: 4000 });
    };

    const payWithRazorpay = async () => {
        const loaded = await loadRazorpay();
        if (!loaded) throw new Error('Could not load the payment window. Please check your internet connection.');

        const { data: order } = await axios.post(`${API_URL}/api/payments/order`, { applicationId: app._id }, authConfig());

        const checkout = new window.Razorpay({
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            order_id: order.orderId,
            name: COLLEGE_NAME,
            description: order.description,
            prefill: order.prefill,
            notes: { applicationId: app._id },
            theme: { color: '#991b1b' },
            handler: async (response) => {
                try {
                    const { data } = await axios.post(`${API_URL}/api/payments/verify`, { applicationId: app._id, ...response }, authConfig());
                    onPaid(data);
                } catch (error) {
                    setIsProcessing(false);
                    toast.error(
                        `${error.response?.data?.message || 'Payment could not be verified'}. If money was debited, contact the admission office with payment ID ${response.razorpay_payment_id}.`,
                        { autoClose: false }
                    );
                }
            },
            modal: { ondismiss: () => setIsProcessing(false) },
        });
        checkout.on('payment.failed', (response) => {
            toast.error(response.error?.description || 'Payment failed. Please try again.');
        });
        checkout.open();
    };

    // Development only (no Razorpay keys on the server)
    const payDemo = async () => {
        const { data } = await axios.put(`${API_URL}/api/applications/${app._id}/pay`, { paymentMethod: 'DEMO' }, authConfig());
        onPaid(data);
    };

    const handlePay = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            if (payConfig?.enabled) await payWithRazorpay();
            else if (payConfig?.demoPayment) await payDemo();
            else throw new Error('Online payment is not available right now. Please contact the admission office.');
        } catch (error) {
            setIsProcessing(false);
            toast.error(error.response?.data?.message || error.message || 'Could not start the payment');
        }
    };

    const receipt = paidApp || app;
    const amountPaid = receipt.paidAmount || fees.total;
    const paidOn = receipt.paidAt ? new Date(receipt.paidAt) : new Date();
    const paymentRef = receipt.razorpayPaymentId || `APP-${String(app._id).slice(-8).toUpperCase()}`;

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
                ["Student Name", receipt.studentName],
                ["Email Address", receipt.email],
                ["Contact Number", receipt.contactNumber],
                ["Date of Birth", new Date(receipt.dob).toLocaleDateString('en-IN')],
                ["Father's Name", receipt.fatherName],
                ["Mother's Name", receipt.motherName],
                ["Aadhar Number", receipt.aadharNumber],
            ],
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.text("ACADEMIC DETAILS", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [["School Name", receipt.schoolName], ["12th Group", receipt.twelfthGroup], ["12th Mark", `${receipt.twelfthMark}%`]],
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.text("FEE BREAKDOWN", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Admission Fees", formatCurrency(fees.admissionFee)],
                ["One Time Fees", formatCurrency(fees.oneTimeFee)],
                ["Semester Fees (" + receipt.course + ")", formatCurrency(fees.semesterFee)],
                ["Total Fees", formatCurrency(fees.total)],
            ],
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.text("COURSE & PAYMENT DETAILS", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Department", receipt.department],
                ["Course Applied", receipt.course],
                ["Application ID", String(receipt._id).toUpperCase()],
                ["Amount Paid", formatCurrency(amountPaid)],
                ["Payment ID", paymentRef],
                ["Payment Method", receipt.paymentMethod || '-'],
                ["Payment Date", paidOn.toLocaleDateString('en-IN')],
                ["Payment Status", "PAID"],
            ],
            theme: 'grid', headStyles: { fillColor: [139, 0, 0] }, styles: { fontSize: 10 }
        });
        doc.setFontSize(10); doc.setFont("helvetica", "italic");
        doc.text("This is a computer-generated receipt and does not require a signature.", 105, doc.lastAutoTable.finalY + 20, { align: "center" });
        doc.text("Thank you for applying to RVS College of Arts & Science.", 105, doc.lastAutoTable.finalY + 28, { align: "center" });
        doc.save(`Application_${String(receipt.studentName).replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen pb-20 pt-10 px-4 font-sans">
            <div className="container mx-auto max-w-6xl">
                {!paidApp ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                        {/* Left: Summary */}
                        <div className="lg:col-span-4 space-y-6">
                            <button onClick={() => navigate(-1)} className="flex items-center text-[#8B0000] font-black uppercase tracking-widest text-[10px] mb-4 hover:translate-x-1 transition-all bg-transparent border-none cursor-pointer"><FaChevronLeft className="mr-2" /> Back</button>
                            <div className="bg-[#8B0000] rounded-[30px] p-5 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                                <h2 className="text-2xl font-black italic uppercase mb-8">Billing Summary</h2>
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
                                    <div className="flex items-center text-[10px] font-black text-red-100 uppercase tracking-tighter opacity-80"><FaShieldAlt className="mr-2" /> Payments processed by Razorpay</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Payment */}
                        <div className="lg:col-span-8 bg-white rounded-3xl md:rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12">
                            <h3 className="text-xl font-black text-gray-800 uppercase italic mb-8 border-l-8 border-[#8B0000] pl-6">Secure Online Payment</h3>

                            {payConfig?.testMode && (
                                <div className="mb-8 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold">
                                    TEST MODE: no real money is charged. Use Razorpay test payment details (for example UPI ID <code>success@razorpay</code>).
                                </div>
                            )}
                            {payConfig && !payConfig.enabled && payConfig.demoPayment && (
                                <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                                    DEVELOPMENT DEMO: Razorpay keys are not set on the server, so this payment is simulated.
                                </div>
                            )}

                            <p className="text-sm text-gray-600 font-medium mb-6">
                                Click the button below to open the Razorpay payment window. You can pay with any of these methods:
                            </p>
                            <div className="flex flex-wrap gap-4 mb-10">
                                {[
                                    { label: 'Credit / Debit Card', icon: <FaCreditCard /> },
                                    { label: 'UPI / GPay / PhonePe', icon: <FaMobileAlt /> },
                                    { label: 'Net Banking', icon: <FaUniversity /> },
                                ].map((m) => (
                                    <span key={m.label} className="flex items-center px-5 py-3 rounded-2xl bg-gray-50 text-gray-600 font-black uppercase text-[10px] tracking-widest">
                                        <span className="mr-3 text-lg text-[#8B0000]">{m.icon}</span> {m.label}
                                    </span>
                                ))}
                            </div>

                            <ul className="text-xs text-gray-500 font-medium space-y-2 mb-10 list-disc pl-5">
                                <li>Do not close or refresh this page until you see "Payment Successful".</li>
                                <li>Your card, UPI and bank details are entered only in the Razorpay window; the college never sees them.</li>
                                <li>If money is debited but this page shows an error, contact the admission office with your payment ID.</li>
                            </ul>

                            <button
                                type="button"
                                onClick={handlePay}
                                disabled={isProcessing || !payConfig || (!payConfig.enabled && !payConfig.demoPayment)}
                                className={`w-full p-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center border-none ${isProcessing || !payConfig ? 'bg-gray-400 text-white cursor-wait' : 'bg-[#8B0000] text-white hover:bg-black transform active:scale-95 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'}`}
                            >
                                {isProcessing ? (
                                    <><span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></span> PAYMENT IN PROGRESS...</>
                                ) : (
                                    <><FaLock className="mr-3" /> PAY {formatCurrency(fees.total)} SECURELY</>
                                )}
                            </button>
                            {payConfig && !payConfig.enabled && !payConfig.demoPayment && (
                                <p className="mt-4 text-center text-xs font-bold text-red-600">Online payment is not available right now. Please contact the admission office.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Success View */
                    <div className="max-w-4xl mx-auto animate-fadeIn">
                        <div className="bg-white rounded-3xl md:rounded-[50px] shadow-2xl overflow-hidden border border-gray-100">
                            <div className="bg-green-600 p-6 sm:p-10 md:p-16 text-center text-white relative">
                                <FaCheckCircle className="mx-auto text-6xl md:text-9xl mb-6 animate-scaleIn" />
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Payment Successful</h1>
                                <p className="mt-4 text-green-100 font-black uppercase tracking-widest text-[10px]">Payment ID: {paymentRef}</p>
                            </div>
                            <div className="p-5 sm:p-8 md:p-12 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 bg-gray-50 p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px]">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-[#8B0000] border-b-2 border-red-100 pb-2 uppercase tracking-widest">Admission Receipt</p>
                                        {[
                                            { l: "Candidate", v: receipt.studentName },
                                            { l: "Course", v: receipt.course },
                                            { l: "Method", v: receipt.paymentMethod || '-' },
                                        ].map((x) => (
                                            <div key={x.l} className="flex justify-between items-center gap-4"><span className="text-[9px] font-black text-gray-400 uppercase">{x.l}</span><span className="text-sm font-black text-gray-800 uppercase italic text-right">{x.v}</span></div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-[#8B0000] border-b-2 border-red-100 pb-2 uppercase tracking-widest">Financial Summary</p>
                                        {[
                                            { l: "Amount Paid", v: formatCurrency(amountPaid) },
                                            { l: "Status", v: "PAID", c: "text-green-600" },
                                            { l: "Date", v: paidOn.toLocaleDateString('en-GB') },
                                        ].map((x) => (
                                            <div key={x.l} className="flex justify-between items-center"><span className="text-[9px] font-black text-gray-400 uppercase">{x.l}</span><span className={`text-sm font-black uppercase italic ${x.c || 'text-gray-800'}`}>{x.v}</span></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                                    <button onClick={downloadPDF} className="flex items-center justify-center px-5 sm:px-8 md:px-12 py-5 bg-green-600 text-white rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-xl group border-none cursor-pointer"><FaFilePdf className="mr-3 text-lg group-hover:scale-110" /> Download Receipt PDF</button>
                                    <button onClick={() => navigate('/student/dashboard')} className="flex items-center justify-center px-5 sm:px-8 md:px-12 py-5 border-4 border-[#8B0000] text-[#8B0000] bg-white rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-[#8B0000] hover:text-white transition-all group cursor-pointer">Back to Dashboard <FaArrowRight className="ml-3 group-hover:translate-x-1" /></button>
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
