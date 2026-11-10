import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';
import {
    FaUserTie, FaPlus, FaEdit, FaTrash, FaEnvelope,
    FaPhone, FaIdCard, FaBuilding, FaChalkboardTeacher, FaTimes, FaSave
} from 'react-icons/fa';

const StaffManagement = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const { user: currentUser } = useContext(AuthContext);

    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        department: '',
        employeeId: '',
        className: '',
        password: '',
        confirmPassword: ''
    });

    const departments = [
        "SCHOOL OF COMPUTER STUDIES",
        "ELECTRONICS",
        "SCHOOL OF MANAGEMENT",
        "SCHOOL OF COMMERCE",
        "FOODS & NUTRITION",
        "ENGLISH",
        "BIOCHEMISTRY",
        "BIOTECHNOLOGY",
        "MICROBIOLOGY",
        "MATHEMATICS",
        "PSYCHOLOGY",
        "CATERING SCIENCE AND HOTEL MANAGEMENT",
        "MASTER OF SOCIAL WORK",
        "LANGUAGES"
    ];

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/users?role=staff`, config);
            setStaffList(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch staff list");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            contactNumber: '',
            department: '',
            employeeId: '',
            className: '',
            password: '',
            confirmPassword: ''
        });
        setEditingStaff(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (!/^\d{10}$/.test(formData.contactNumber || '')) {
            return toast.error("Contact number must be 10 digits");
        }
        if (formData.password && formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };

            if (editingStaff) {
                // Update
                await axios.put(`${API_URL}/api/users/staff/${editingStaff._id}`, formData, config);
                toast.success("Staff updated successfully");
            } else {
                // Create
                await axios.post(`${API_URL}/api/users/staff`, formData, config);
                toast.success("Staff account created");
            }

            resetForm();
            fetchStaff();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (staff) => {
        setEditingStaff(staff);
        setFormData({
            name: staff.name,
            email: staff.email,
            contactNumber: staff.contactNumber || '',
            department: staff.department || '',
            employeeId: staff.employeeId || '',
            className: staff.className || '',
            password: '',
            confirmPassword: ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                };
                await axios.delete(`${API_URL}/api/users/${id}`, config);
                toast.success("Staff member removed");
                fetchStaff();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <div className="animate-fadeIn space-y-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b border-gray-100 pb-6 md:pb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter font-serif italic">Faculty <span className="text-primary font-sans not-italic tracking-normal">Directorate</span></h2>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em] flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 animate-pulse"></span>
                        Management of Academic Staff Records
                    </p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary text-white px-5 sm:px-8 md:px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-secondary transition-all active:scale-95 border-none cursor-pointer flex items-center"
                    >
                        <FaPlus className="mr-3" /> Provision New Faculty
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white rounded-3xl md:rounded-[40px] shadow-2xl p-5 sm:p-8 md:p-12 border border-gray-100 mb-10 overflow-hidden relative group animate-slideDown">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-primary opacity-5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="flex justify-between items-start gap-4 mb-8 md:mb-12 relative z-10 border-b border-gray-50 pb-6 md:pb-8">
                        <div>
                            <h3 className="text-2xl font-black italic font-serif text-secondary uppercase tracking-tighter">
                                {editingStaff ? 'Refine Staff Profile' : 'Credentials Generation'}
                            </h3>
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-1 opacity-60 italic">System Secure Provisioning Interface</p>
                        </div>
                        <button onClick={resetForm} className="bg-gray-50 text-gray-300 hover:text-red-600 hover:bg-red-50 p-4 rounded-2xl transition-all border-none cursor-pointer">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10">
                        {/* Name */}
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">Legal Identity Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="ENTER FULL NAME"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700 uppercase"
                                required
                            />
                        </div>

                        {/* Employee ID */}
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">Organization ID</label>
                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleInputChange}
                                placeholder="RVS-XXXX"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700 uppercase"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">Communication Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="OFFICIAL@RVSCAS.AC.IN"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700 uppercase"
                                required
                            />
                        </div>

                        {/* Contact */}
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">Secure Contact</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                placeholder="10-DIGIT MOBILE"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700 uppercase"
                                required
                            />
                        </div>

                        {/* Department */}
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">Assigned Domain</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700 uppercase cursor-pointer appearance-none"
                                required
                            >
                                <option value="">CHOOSE DEPARTMENT</option>
                                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                        </div>

                        {/* Class */}
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">Proctor Responsibility</label>
                            <input
                                type="text"
                                name="className"
                                placeholder="E.G. III MCA / B.SC CS"
                                value={formData.className}
                                onChange={handleInputChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700 uppercase"
                                required
                            />
                        </div>

                        {/* Passwords */}
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">{editingStaff ? 'New Access Key (Optional)' : 'Initial Root Password'}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                required={!editingStaff}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 px-1 italic">Verify Credentials</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                required={!editingStaff}
                            />
                        </div>

                        <div className="md:col-span-2 pt-10">
                            <button
                                type="submit"
                                className="w-full py-5 bg-primary text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-full shadow-[0_20px_50px_rgba(153,27,27,0.3)] flex items-center justify-center hover:bg-secondary transition-all active:scale-[0.98] border-none cursor-pointer"
                            >
                                <FaSave className="mr-3" /> {editingStaff ? 'UPDATE FACULTY PROFILE' : 'AUTHORIZE ACCOUNT PROVISIONING'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Staff List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {staffList.map((staff) => (
                    <div key={staff._id} className="bg-white rounded-3xl md:rounded-[40px] shadow-xl p-5 sm:p-8 md:p-10 border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between">
                        {/* Status chip */}
                        <div className="absolute top-0 right-0 px-5 sm:px-8 py-3 bg-red-50 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-[25px]">
                            AUTHORIZED STAFF
                        </div>

                        <div>
                            <div className="flex items-center space-x-6 mb-10 mt-2">
                                <div className="w-20 h-20 bg-neutralLight rounded-[25px] flex items-center justify-center text-primary font-black text-2xl md:text-3xl group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm border border-red-100/50">
                                    {staff.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic font-serif text-secondary uppercase tracking-tighter truncate w-40">{staff.name}</h4>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center mt-1">
                                        <FaIdCard className="mr-2 text-primary opacity-30" /> {staff.employeeId || 'NOT ASSIGNED'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 border-t-2 border-dashed border-gray-50 pt-8">
                                <div className="flex items-center group/item p-2 hover:bg-red-50/50 rounded-2xl transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 shadow-sm group-hover/item:text-primary transition-colors">
                                        <FaBuilding size={14} className="opacity-30" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight truncate">{staff.department || 'NO DEPARTMENT'}</span>
                                </div>
                                <div className="flex items-center group/item p-2 hover:bg-red-50/50 rounded-2xl transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 shadow-sm group-hover/item:text-primary transition-colors">
                                        <FaChalkboardTeacher size={14} className="opacity-30" />
                                    </div>
                                    <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">{staff.className || 'GENERAL STAFF'}</span>
                                </div>
                                <div className="flex items-center group/item p-2 hover:bg-red-50/50 rounded-2xl transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 shadow-sm group-hover/item:text-primary transition-colors">
                                        <FaEnvelope size={14} className="opacity-30" />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400 lowercase truncate tracking-tight">{staff.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 border-t border-gray-50 pt-8">
                            <button
                                onClick={() => handleEdit(staff)}
                                className="flex-grow bg-gray-50 text-gray-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center border-none cursor-pointer"
                            >
                                <FaEdit className="mr-3" /> Edit Entry
                            </button>
                            <button
                                onClick={() => handleDelete(staff._id)}
                                className="bg-red-50 text-red-400 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform active:scale-90 border-none cursor-pointer flex items-center justify-center"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {staffList.length === 0 && !loading && (
                <div className="text-center py-24 bg-white rounded-3xl md:rounded-[50px] shadow-inner border-4 border-dashed border-gray-50 italic text-gray-300 font-bold uppercase tracking-[0.5em] text-xs">
                    ZERO ACQUISITION : FACULTY DATABASE EMPTY
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
