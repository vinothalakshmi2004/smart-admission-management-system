import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AdmissionSidebar from '../components/AdmissionSidebar';
import { FaUser, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaSchool, FaBookOpen, FaChevronLeft, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const Enquiry = ({ isInternal = false }) => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        studentName: '',
        mobileNumber: '',
        email: '',
        fatherName: '',
        dob: '',
        schoolName: '',
        twelfth_group: '',
        course1: '',
        course2: '',
        course3: '',
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Course Field Validation
        const newErrors = {};
        if (!formData.twelfth_group) newErrors.twelfth_group = "12th Group is required";
        if (!formData.course1) newErrors.course1 = "Course 1 is required";
        if (!formData.course2) newErrors.course2 = "Course 2 is required";
        if (!formData.course3) newErrors.course3 = "Course 3 is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        try {
            await axios.post('http://localhost:5000/api/enquiries', formData);
            toast.success("Enquiry Submitted Successfully", {
                position: "top-center",
                autoClose: 3000,
            });
            setFormData({
                studentName: '',
                mobileNumber: '',
                email: '',
                fatherName: '',
                dob: '',
                schoolName: '',
                twelfth_group: '',
                course1: '',
                course2: '',
                course3: '',
            });
            if (!isInternal) setTimeout(() => navigate('/student-login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const content = (
        <div className="flex-grow animate-fadeIn">
            <div className="mb-10">
                <h1 className="text-4xl font-black italic text-gray-800 uppercase tracking-tighter border-b-4 border-[#8B0000] pb-2 inline-block">
                    Quick Enquiry
                </h1>
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Academic & Personal Profile */}
                    <div>
                        <h3 className="text-xs font-black text-[#8B0000] uppercase tracking-[0.3em] mb-8 border-b pb-2">Academic & Personal Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Student Full Name</label>
                                <div className="relative group">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" />
                                    <input
                                        type="text" name="studentName" required placeholder="JOHN DOE"
                                        className="w-full bg-gray-50 border-2 border-transparent p-4 pl-12 rounded-2xl focus:border-[#8B0000] outline-none font-bold uppercase transition-all"
                                        value={formData.studentName} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Mobile Number (10 Digits)</label>
                                <div className="relative group">
                                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" />
                                    <input
                                        type="text" name="mobileNumber" maxLength="10" required placeholder="98XXXXXXXX"
                                        className="w-full bg-gray-50 border-2 border-transparent p-4 pl-12 rounded-2xl focus:border-[#8B0000] outline-none font-bold transition-all"
                                        value={formData.mobileNumber} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                                <div className="relative group">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" />
                                    <input
                                        type="email" name="email" required placeholder="EXAMPLE@MAIL.COM"
                                        className="w-full bg-gray-50 border-2 border-transparent p-4 pl-12 rounded-2xl focus:border-[#8B0000] outline-none font-bold uppercase transition-all"
                                        value={formData.email} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Father's Name</label>
                                <div className="relative group">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" />
                                    <input
                                        type="text" name="fatherName" required placeholder="MR. SMITH"
                                        className="w-full bg-gray-50 border-2 border-transparent p-4 pl-12 rounded-2xl focus:border-[#8B0000] outline-none font-bold uppercase transition-all"
                                        value={formData.fatherName} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Date of Birth</label>
                                <input
                                    type="date" name="dob" required
                                    className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold transition-all"
                                    value={formData.dob} onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">School Last Attended</label>
                                <input
                                    type="text" name="schoolName" required placeholder="MODEL SECONDARY SCHOOL"
                                    className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold uppercase transition-all"
                                    value={formData.schoolName} onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">12th Group</label>
                                <input
                                    type="text" name="twelfth_group" required placeholder="Enter your 12th Group (e.g., Biology, Computer Science, etc.)"
                                    className={`w-full bg-gray-50 border-2 ${errors.twelfth_group ? 'border-red-500' : 'border-transparent'} p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold uppercase transition-all`}
                                    value={formData.twelfth_group} onChange={handleChange}
                                />
                                {errors.twelfth_group && (
                                    <p className="text-[9px] font-black text-red-500 uppercase px-2 mt-1 italic animate-bounce">
                                        {errors.twelfth_group}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-black text-[#8B0000] uppercase tracking-[0.3em] mb-8 border-b pb-2">Academic Interests</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(num => (
                                <div key={num} className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Course {num}</label>
                                    <input
                                        type="text"
                                        name={`course${num}`}
                                        placeholder={`Enter Course ${num}`}
                                        className={`w-full bg-gray-50 border-2 ${errors[`course${num}`] ? 'border-red-500' : 'border-transparent'} p-4 rounded-2xl focus:border-[#8B0000] outline-none font-bold uppercase transition-all`}
                                        value={formData[`course${num}`]}
                                        onChange={handleChange}
                                    />
                                    {errors[`course${num}`] && (
                                        <p className="text-[9px] font-black text-red-500 uppercase px-2 mt-1 italic animate-bounce">
                                            {errors[`course${num}`]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#8B0000] text-white py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl flex items-center justify-center transition-all transform active:scale-95"
                    >
                        Submit Official Enquiry <FaPaperPlane className="ml-4" />
                    </button>
                </form>
            </div>
        </div>
    );

    if (isInternal) return content;

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-10">
                    <AdmissionSidebar />
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Enquiry;
