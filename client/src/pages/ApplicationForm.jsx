import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LiveAdmissionCounter from '../components/admission/LiveAdmissionCounter';

const departmentCourses = {
    'SCHOOL OF COMPUTER STUDIES': ['B.Sc AI & ML', 'B.Sc Data Science', 'B.Sc Computer Science', 'BCA', 'B.Sc Information Technology', 'M.Sc Computer Science', 'MCA'],
    'ELECTRONICS': ['B.Sc Electronics & Communication', 'B.Sc Internet Of Things', 'M.Sc Applied Electronics'],
    'SCHOOL OF MANAGEMENT': ['BBA (Business Administration)', 'BBA (Computer Application)', 'BBA (Logistics)', 'MBA'],
    'SCHOOL OF COMMERCE': ['B.Com', 'B.Com (Computer Applications)', 'B.Com (Information Technology)', 'B.Com (Accounting and Finance)', 'B.Com (Professional Accounting)', 'B.Com (Business Analytics)', 'M.Com', 'M.Com (International Business)', 'M.Com (Computer Applications)'],
    'FOODS & NUTRITION': ['B.Sc Nutrition and Dietetics', 'M.Sc Foods & Nutrition'],
    'ENGLISH': ['B.A. English Literature', 'M.A. English Literature'],
    'BIOCHEMISTRY': ['B.Sc Biochemistry', 'M.Sc Biochemistry'],
    'BIOTECHNOLOGY': ['B.Sc Biotechnology', 'M.Sc Biotechnology'],
    'MICROBIOLOGY': ['B.Sc Microbiology', 'M.Sc Microbiology'],
    'MATHEMATICS': ['B.Sc Maths', 'M.Sc Maths'],
    'PSYCHOLOGY': ['B.Sc Psychology'],
    'CATERING SCIENCE AND HOTEL MANAGEMENT': ['B.Sc (CS and HM)'],
    'MASTER OF SOCIAL WORK': ['MSW'],
    'LANGUAGES': ['Tamil', 'Hindi', 'Malayalam', 'French']
};

const ApplicationForm = () => {
    const { user, studentApply } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        studentName: '',
        contactNumber: '',
        twelfthMark: '',
        twelfthGroup: '',
        schoolName: '',
        fatherName: '',
        motherName: '',
        dob: '',
        email: '',
        aadharNumber: '',
        department: '',
        course: '',
    });

    const [files, setFiles] = useState({
        communityCertificate: null,
        marksheet: null
    });

    const [filePreviews, setFilePreviews] = useState({
        communityCertificate: '',
        marksheet: ''
    });

    useEffect(() => {
        if (!user) {
            toast.info('Please login as a student to apply');
            navigate('/student-login');
            return;
        }

        // Pre-fill from user context if available
        if (user) {
            setFormData(prev => ({
                ...prev,
                studentName: user.name || '',
                email: user.email || '',
                contactNumber: user.contactNumber || ''
            }));
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'department') {
            setFormData({ ...formData, [name]: value, course: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        const file = selectedFiles[0];
        if (file) {
            setFiles(prev => ({ ...prev, [name]: file }));

            // Generate preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreviews(prev => ({ ...prev, [name]: 'pdf_icon' })); // Placeholder for PDF
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.department || !formData.course) {
            toast.error('Please select both Department and Course');
            return;
        }
        if (formData.contactNumber.length !== 10) {
            toast.error('Contact number must be exactly 10 digits');
            return;
        }
        if (formData.aadharNumber.length !== 12) {
            toast.error('Aadhar number must be exactly 12 digits');
            return;
        }

        // Checklist for mandatory files
        if (!files.communityCertificate || !files.marksheet) {
            toast.error('Please upload both Community Certificate and Marksheet');
            return;
        }

        // Prepare FormData for file upload
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (files.communityCertificate) {
            data.append('communityCertificate', files.communityCertificate);
        }
        if (files.marksheet) {
            data.append('marksheet', files.marksheet);
        }

        try {
            const result = await studentApply(data);

            if (result.success) {
                toast.success('Your application was submitted successfully!');
                navigate('/student/dashboard');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error('Server error. Please try again.');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-neutralLight py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="container mx-auto max-w-7xl">

                {/* Dashboard Style Page Header */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter leading-none italic border-l-8 border-primary pl-6">
                        Admission <span className="text-primary">Registry Portal</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-3 ml-8">Academic Session 2026-2027 • Official Ledger</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Main Admission Form (Desktop Left) */}
                    <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 flex flex-col gap-10 relative overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute right-0 top-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-extrabold text-primary uppercase tracking-wide">Admission Application Form</h2>
                            <p className="mt-2 text-gray-500 font-medium italic">Welcome back, {user.name}! Please complete your application below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Dynamic Course Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-red-50 rounded-2xl border border-red-100">
                                <div>
                                    <label className="block text-sm font-bold text-primary mb-2">1️⃣ Select Department *</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white font-semibold"
                                    >
                                        <option value="">-- Choose Department --</option>
                                        {Object.keys(departmentCourses).map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-primary mb-2">2️⃣ Select Course *</label>
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.department}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none font-semibold ${!formData.department ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white text-gray-900'}`}
                                    >
                                        <option value="">-- Choose Course --</option>
                                        {formData.department && departmentCourses[formData.department].map(course => (
                                            <option key={course} value={course}>{course}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Student Name (Read Only)</label>
                                    <input type="text" name="studentName" value={formData.studentName} readOnly className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium outline-none cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email ID (Read Only)</label>
                                    <input type="email" name="email" value={formData.email} readOnly className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium outline-none cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number (Read Only)</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        readOnly
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium outline-none cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Aadhar Number *</label>
                                    <input
                                        type="text"
                                        name="aadharNumber"
                                        value={formData.aadharNumber}
                                        onChange={handleChange}
                                        required
                                        maxLength="12"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="12 Digits"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Father Name *</label>
                                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mother Name *</label>
                                    <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth (DOB) *</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-widest text-center">Educational Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">School Name *</label>
                                        <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">12th Group *</label>
                                        <input type="text" name="twelfthGroup" value={formData.twelfthGroup} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white" placeholder="e.g. MPC, BiPC" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">12th Mark *</label>
                                        <input type="number" name="twelfthMark" value={formData.twelfthMark} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload Section */}
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <h3 className="text-lg font-bold text-blue-900 mb-6 uppercase tracking-widest text-center">Required Document Uploads</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Community Certificate */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-blue-800">Community Certificate *</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                name="communityCertificate"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                                id="communityCert"
                                                required
                                            />
                                            <label
                                                htmlFor="communityCert"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-colors group-hover:border-blue-500"
                                            >
                                                {files.communityCertificate ? (
                                                    <div className="text-center p-2">
                                                        {filePreviews.communityCertificate === 'pdf_icon' ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-4xl">📄</span>
                                                                <p className="text-[10px] mt-2 font-bold text-gray-600 truncate max-w-[150px]">{files.communityCertificate.name}</p>
                                                            </div>
                                                        ) : (
                                                            <img src={filePreviews.communityCertificate} alt="Preview" className="h-20 w-20 object-cover rounded-lg mx-auto" />
                                                        )}
                                                        <p className="text-[10px] mt-1 font-bold text-blue-600">Click to change</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="text-3xl mb-2">📤</span>
                                                        <p className="text-xs font-bold text-gray-500 text-center">Click to upload <br /> (PDF, JPG, PNG)</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Marksheet */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-blue-800">12th Marksheet *</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                name="marksheet"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                                id="marksheetUpload"
                                                required
                                            />
                                            <label
                                                htmlFor="marksheetUpload"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-colors group-hover:border-blue-500"
                                            >
                                                {files.marksheet ? (
                                                    <div className="text-center p-2">
                                                        {filePreviews.marksheet === 'pdf_icon' ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-4xl">📄</span>
                                                                <p className="text-[10px] mt-2 font-bold text-gray-600 truncate max-w-[150px]">{files.marksheet.name}</p>
                                                            </div>
                                                        ) : (
                                                            <img src={filePreviews.marksheet} alt="Preview" className="h-20 w-20 object-cover rounded-lg mx-auto" />
                                                        )}
                                                        <p className="text-[10px] mt-1 font-bold text-blue-600">Click to change</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="text-3xl mb-2">📤</span>
                                                        <p className="text-xs font-bold text-gray-500 text-center">Click to upload <br /> (PDF, JPG, PNG)</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-6">
                                <button
                                    type="submit"
                                    className="w-full md:w-3/4 flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-2xl text-xl font-extrabold text-white bg-primary hover:bg-secondary focus:outline-none transition duration-300 transform hover:-translate-y-1"
                                >
                                    SUBMIT APPLICATION
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Live Admission Sidebar (Desktop Right) */}
                    <div className="lg:col-span-4 space-y-8 sticky top-10 animate-slideInRight">
                        <LiveAdmissionCounter />

                        {/* Trust Badges */}
                        <div className="bg-gray-900 p-8 rounded-[35px] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 relative z-10">Quality Assurance</h4>
                            <p className="text-sm font-bold leading-relaxed opacity-80 italic relative z-10">"Empowering minds through academic excellence for over three decades."</p>
                            <div className="mt-6 flex items-center gap-4 relative z-10">
                                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center font-black text-xs border border-white/5">RVS</div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Authorized Academic Council</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
