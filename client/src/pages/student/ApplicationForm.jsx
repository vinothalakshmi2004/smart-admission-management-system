import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import LiveAdmissionCounter from '../../components/admission/LiveAdmissionCounter';

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
        if (user) {
            setFormData(prev => ({
                ...prev,
                studentName: user.name || '',
                email: user.email || '',
                contactNumber: user.contactNumber || ''
            }));
        }
    }, [user]);

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
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreviews(prev => ({ ...prev, [name]: 'pdf_icon' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.department || !formData.course) {
            return toast.error('Please select both Department and Course');
        }
        if (formData.contactNumber.length !== 10) {
            return toast.error('Contact number must be exactly 10 digits');
        }
        if (formData.aadharNumber.length !== 12) {
            return toast.error('Aadhar number must be exactly 12 digits');
        }
        if (!files.communityCertificate || !files.marksheet) {
            return toast.error('Please upload both Community Certificate and Marksheet');
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('communityCertificate', files.communityCertificate);
        data.append('marksheet', files.marksheet);

        try {
            const result = await studentApply(data);
            if (result.success) {
                toast.success('Your application was submitted successfully!');
                window.location.reload(); // Refresh to update dashboard status
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Server error. Please try again.');
        }
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 flex flex-col gap-10 relative overflow-hidden animate-fadeIn">
            {/* Decorative background */}
            <div className="absolute right-0 top-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Enrollment Registry</p>
                </div>
                <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter italic border-l-8 border-primary pl-6">
                    Admission <span className="text-primary">Application Form</span>
                </h2>
                <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[9px] ml-8 italic">Please provide accurate academic and personal details for evaluation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                {/* Course Selection Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50 rounded-[30px] border border-gray-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">01. Academic Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700 shadow-sm"
                        >
                            <option value="">Select Department</option>
                            {Object.keys(departmentCourses).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">02. Specific Course</label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            disabled={!formData.department}
                            className={`w-full px-6 py-4 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black shadow-sm ${!formData.department ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-700'}`}
                        >
                            <option value="">Select Course</option>
                            {formData.department && departmentCourses[formData.department].map(course => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Personal Intelligence Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Student Identity</label>
                        <input type="text" value={formData.studentName} readOnly className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-gray-400 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Contact Alpha</label>
                        <input type="text" value={formData.contactNumber} readOnly className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-gray-400 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Aadhar Verification *</label>
                        <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required maxLength="12" placeholder="12 Digit Identity" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Parental Reference (Father) *</label>
                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Temporal Birthmark (DOB) *</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                </div>

                {/* Educational Matrix Zone */}
                <div className="bg-gray-900 p-8 md:p-10 rounded-[40px] shadow-2xl text-white">
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-8 border-l-4 border-primary pl-4">Academic Ledger Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">School Name</label>
                            <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} required className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all font-bold text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">12th Stream</label>
                            <input type="text" name="twelfthGroup" value={formData.twelfthGroup} onChange={handleChange} required placeholder="e.g. MPC" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all font-bold text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Aggregate Score (%)</label>
                            <input type="number" name="twelfthMark" value={formData.twelfthMark} onChange={handleChange} required className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all font-bold text-white" />
                        </div>
                    </div>
                </div>

                {/* Document Verification Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Community Evidence *</label>
                        <div className="relative group">
                            <input type="file" name="communityCertificate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="dash_commCert" required />
                            <label htmlFor="dash_commCert" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50 hover:bg-red-50 hover:border-primary transition-all group-hover:shadow-lg">
                                {files.communityCertificate ? (
                                    <div className="text-center p-4">
                                        <p className="text-secondary font-black text-xs truncate max-w-[200px]">{files.communityCertificate.name}</p>
                                        <span className="text-[10px] text-primary font-bold uppercase mt-2 block tracking-widest">Click to Replace</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Community Ledger</span>
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Educational Record (Marksheet) *</label>
                        <div className="relative group">
                            <input type="file" name="marksheet" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="dash_markCert" required />
                            <label htmlFor="dash_markCert" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50 hover:bg-red-50 hover:border-primary transition-all group-hover:shadow-lg">
                                {files.marksheet ? (
                                    <div className="text-center p-4">
                                        <p className="text-secondary font-black text-xs truncate max-w-[200px]">{files.marksheet.name}</p>
                                        <span className="text-[10px] text-primary font-bold uppercase mt-2 block tracking-widest">Click to Replace</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Level 12 Marksheet</span>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-10 flex flex-col items-center border-t border-gray-100">
                    <button
                        type="submit"
                        className="w-full md:w-auto px-20 py-6 bg-primary text-white text-lg font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/30 hover:bg-secondary hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
                    >
                        Initiate Application
                    </button>

                    {/* Horizontal Admission Counter Integrated Here */}
                    <LiveAdmissionCounter horizontal={true} />
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;
