import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import LiveAdmissionCounter from '../../components/admission/LiveAdmissionCounter';
import { API_URL } from '../../config';
import { DEPARTMENTS, coursesForDepartment, seatsLeft } from '../../data/departments';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // must match the server limit
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const ApplicationForm = ({ onSubmitted }) => {
    const { user, studentApply } = useContext(AuthContext);
    const [seatMatrix, setSeatMatrix] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState(() => ({
        studentName: user?.name || '',
        contactNumber: user?.contactNumber || '',
        twelfthMark: '',
        twelfthGroup: '',
        schoolName: '',
        fatherName: '',
        motherName: '',
        dob: '',
        email: user?.email || '',
        aadharNumber: '',
        department: '',
        course: '',
    }));

    const [files, setFiles] = useState({
        communityCertificate: null,
        marksheet: null
    });

    // Seat Matrix: used to show seats left and to block full courses
    useEffect(() => {
        axios.get(`${API_URL}/api/courses`)
            .then(({ data }) => setSeatMatrix(Array.isArray(data) ? data : []))
            .catch(() => setSeatMatrix([]));
    }, []);

    const courseOptions = coursesForDepartment(formData.department, seatMatrix);

    const handleChange = (e) => {
        const { name } = e.target;
        let { value } = e.target;
        if (name === 'contactNumber') value = value.replace(/\D/g, '').slice(0, 10);
        if (name === 'aadharNumber') value = value.replace(/\D/g, '').slice(0, 12);
        if (name === 'department') {
            setFormData({ ...formData, [name]: value, course: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        const file = selectedFiles[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            e.target.value = '';
            return toast.error('Only PDF, JPG and PNG files are allowed');
        }
        if (file.size > MAX_FILE_SIZE) {
            e.target.value = '';
            return toast.error('Each file must be 5 MB or smaller');
        }
        setFiles(prev => ({ ...prev, [name]: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        if (!formData.department || !formData.course) {
            return toast.error('Please select both Department and Course');
        }
        const selected = courseOptions.find(c => c.name === formData.course);
        if (selected && selected.record && seatsLeft(selected.record) === 0) {
            return toast.error(`No seats left in ${formData.course}. Please choose another course.`);
        }
        if (!/^\d{10}$/.test(formData.contactNumber)) {
            return toast.error('Contact number must be exactly 10 digits');
        }
        if (!/^\d{12}$/.test(formData.aadharNumber)) {
            return toast.error('Aadhar number must be exactly 12 digits');
        }
        const mark = Number(formData.twelfthMark);
        if (formData.twelfthMark === '' || !Number.isFinite(mark) || mark < 0 || mark > 100) {
            return toast.error('12th mark must be a percentage between 0 and 100');
        }
        if (!files.communityCertificate || !files.marksheet) {
            return toast.error('Please upload both Community Certificate and Marksheet');
        }

        const data = new FormData();
        ['department', 'course', 'contactNumber', 'fatherName', 'motherName', 'dob',
            'twelfthMark', 'twelfthGroup', 'schoolName', 'aadharNumber']
            .forEach(key => data.append(key, formData[key]));
        data.append('communityCertificate', files.communityCertificate);
        data.append('marksheet', files.marksheet);

        setSubmitting(true);
        const result = await studentApply(data);
        setSubmitting(false);
        if (result.success) {
            toast.success('Your application was submitted successfully!');
            if (onSubmitted) onSubmitted(result.data.application);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-8 md:p-12 rounded-3xl md:rounded-[40px] shadow-2xl border border-gray-100 flex flex-col gap-6 md:gap-10 relative overflow-hidden animate-fadeIn">
            {/* Decorative background */}
            <div className="absolute right-0 top-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Enrollment Registry</p>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter italic border-l-8 border-primary pl-4 sm:pl-6 break-words">
                    Admission <span className="text-primary">Application Form</span>
                </h2>
                <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[9px] ml-4 sm:ml-8 italic">Please provide accurate academic and personal details for evaluation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                {/* Course Selection Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 sm:p-8 bg-gray-50 rounded-[30px] border border-gray-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">01. Academic Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="w-full px-4 sm:px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700 shadow-sm"
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(dept => (
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
                            className={`w-full px-4 sm:px-6 py-4 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black shadow-sm ${!formData.department ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-700'}`}
                        >
                            <option value="">Select Course</option>
                            {courseOptions.map(({ name, record }) => {
                                const left = seatsLeft(record);
                                return (
                                    <option key={name} value={name} disabled={left === 0}>
                                        {left === null ? name : left === 0 ? `${name} (Full)` : `${name} (${left} seats left)`}
                                    </option>
                                );
                            })}
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
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Contact Number *</label>
                        <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required inputMode="numeric" pattern="[0-9]{10}" maxLength="10" placeholder="10 Digit Mobile" className="w-full px-4 sm:px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Aadhar Verification *</label>
                        <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required inputMode="numeric" pattern="[0-9]{12}" maxLength="12" placeholder="12 Digit Identity" className="w-full px-4 sm:px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Parental Reference (Father) *</label>
                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full px-4 sm:px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Parental Reference (Mother) *</label>
                        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required className="w-full px-4 sm:px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Temporal Birthmark (DOB) *</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required max={new Date().toISOString().slice(0, 10)} className="w-full px-4 sm:px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-black text-gray-700" />
                    </div>
                </div>

                {/* Educational Matrix Zone */}
                <div className="bg-gray-900 p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl text-white">
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
                            <input type="number" name="twelfthMark" value={formData.twelfthMark} onChange={handleChange} required min="0" max="100" step="0.01" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all font-bold text-white" />
                        </div>
                    </div>
                </div>

                {/* Document Verification Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Community Evidence *</label>
                        <div className="relative group">
                            <input type="file" name="communityCertificate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="dash_commCert" />
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
                            <input type="file" name="marksheet" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="dash_markCert" />
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
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">PDF, JPG or PNG, up to 5 MB each</p>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto px-8 sm:px-12 md:px-20 py-6 bg-primary text-white text-lg font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/30 hover:bg-secondary hover:scale-105 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-60 disabled:cursor-wait"
                    >
                        {submitting ? 'Submitting...' : 'Initiate Application'}
                    </button>

                    {/* Horizontal Admission Counter Integrated Here */}
                    <LiveAdmissionCounter horizontal={true} />
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;
