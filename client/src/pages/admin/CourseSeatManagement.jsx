import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaInbox, FaListUl } from 'react-icons/fa';
import { API_URL } from '../../config';
import { DEPARTMENT_COURSES, DEPARTMENTS } from '../../data/departments';

const EMPTY_FORM = { name: '', department: '', duration: '', fees: '', totalSeats: 60, filledSeats: 0 };
const durationFor = (name) => (/^(m\.|mba|mca|msw)/i.test(name) ? '2 Years' : '3 Years');

const CourseSeatManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null); // For editing
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/courses`);
            setCourses(data);
        } catch {
            toast.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const authHeaders = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    };

    // Add every standard course from the application form that is not in the Seat Matrix yet
    const importStandardCourses = async () => {
        const existing = new Set(courses.map((c) => c.name.trim().toLowerCase()));
        const missing = Object.entries(DEPARTMENT_COURSES).flatMap(([department, names]) =>
            names.filter((n) => !existing.has(n.toLowerCase())).map((name) => ({ name, department })));
        if (missing.length === 0) return toast.info('All standard courses are already in the Seat Matrix');
        if (!window.confirm(`Add ${missing.length} standard course(s) with 60 seats each?`)) return;

        setImporting(true);
        let added = 0;
        for (const course of missing) {
            try {
                await axios.post(`${API_URL}/api/courses`, { ...course, duration: durationFor(course.name), totalSeats: 60, filledSeats: 0 }, authHeaders());
                added += 1;
            } catch (error) {
                console.error(error);
            }
        }
        setImporting(false);
        toast.success(`${added} course(s) added`);
        fetchCourses();
    };

    const handleOpenModal = (course = null) => {
        if (course) {
            setCurrentCourse(course);
            setFormData({
                name: course.name,
                department: course.department || '',
                duration: course.duration || '',
                fees: course.fees ?? '',
                totalSeats: course.totalSeats ?? 60,
                filledSeats: course.filledSeats ?? 0
            });
        } else {
            setCurrentCourse(null);
            setFormData(EMPTY_FORM);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Number(formData.filledSeats) > Number(formData.totalSeats)) {
            return toast.error('Filled seats cannot be more than total seats');
        }
        try {
            const config = authHeaders();

            const payload = {
                name: formData.name.trim(),
                department: formData.department,
                duration: formData.duration.trim(),
                fees: formData.fees === '' ? undefined : Number(formData.fees),
                filledSeats: Number(formData.filledSeats),
                totalSeats: Number(formData.totalSeats)
            };

            if (currentCourse) {
                // Update
                await axios.put(`${API_URL}/api/courses/${currentCourse._id}`, payload, config);
                toast.success('Seat Matrix updated successfully');
            } else {
                // Create
                await axios.post(`${API_URL}/api/courses`, payload, config);
                toast.success('Seat Matrix record created');
            }

            setShowModal(false);
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you certain you want to delete this seat matrix record? This action cannot be undone.')) return;

        try {
            await axios.delete(`${API_URL}/api/courses/${id}`, authHeaders());
            toast.success('Record deleted');
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Deletion failed');
        }
    };

    if (loading) return <div className="p-8 sm:p-12 md:p-20 text-center uppercase font-black text-primary animate-pulse tracking-widest text-xs">Accessing Seat Matrix Registry...</div>;

    return (
        <div className="p-0 sm:p-4 md:p-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 pb-8 border-b-2 border-dashed border-gray-100">
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-tighter italic">
                        Seat <span className="text-primary tracking-normal">Matrix Control</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Administrative Registry for Course Capacity & Vacancy</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={importStandardCourses}
                        disabled={importing}
                        className="flex items-center gap-3 bg-white text-primary border-2 border-primary px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                        <FaListUl /> {importing ? 'Adding...' : 'Add Standard Courses'}
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-3 bg-primary text-white px-5 sm:px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-[0_20px_40px_rgba(153,27,27,0.2)] active:scale-95 border-none cursor-pointer"
                    >
                        <FaPlus /> Add Seat Matrix
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl md:rounded-[40px] shadow-2xl border border-gray-100 overflow-x-auto relative">
                <table className="w-full min-w-[640px] text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="p-4 md:p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Course Identity</th>
                            <th className="p-4 md:p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Total Seats</th>
                            <th className="p-4 md:p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Filled Seats</th>
                            <th className="p-4 md:p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Available Seats</th>
                            <th className="p-4 md:p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Administrative Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 sm:p-12 md:p-20 text-center">
                                    <FaInbox className="text-4xl sm:text-5xl md:text-6xl text-gray-100 mb-4 mx-auto" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No Registry Records Found</p>
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => {
                                const available = (course.totalSeats || 0) - (course.filledSeats || 0);
                                return (
                                    <tr key={course._id} className="group hover:bg-gray-50/30 transition-colors">
                                        <td className="p-4 md:p-8">
                                            <p className="font-black text-gray-800 uppercase text-lg tracking-tight group-hover:text-primary transition-colors">{course.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                                                    {[course.department, course.duration, course.fees ? `Semester fee ₹${Number(course.fees).toLocaleString('en-IN')}` : null].filter(Boolean).join(' · ') || 'Live Inventory'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 md:p-8 text-center text-xl font-black text-gray-600">
                                            {course.totalSeats || 0}
                                        </td>
                                        <td className="p-4 md:p-8 text-center text-xl font-black text-secondary italic">
                                            {course.filledSeats || 0}
                                        </td>
                                        <td className="p-4 md:p-8 text-center">
                                            <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm ${available <= 5 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                                {available} Available
                                            </span>
                                        </td>
                                        <td className="p-4 md:p-8 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(course)}
                                                    className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-primary transition-all shadow-xl active:scale-90 border-none cursor-pointer"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="p-4 bg-white text-primary border-2 border-primary/10 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all shadow-xl active:scale-90 cursor-pointer"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Premium CRUD Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-3 sm:p-6 animate-fadeIn">
                    <div className="bg-white rounded-3xl md:rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] w-full max-w-lg max-h-[calc(100svh-1.5rem)] overflow-y-auto overscroll-contain relative">
                        {/* Decorative Top Bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>

                        <div className="p-5 sm:p-8 md:p-10">
                            <header className="mb-6 md:mb-10 flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter italic">
                                        {currentCourse ? 'Update' : 'Register'} <span className="text-primary not-italic tracking-normal">Seat Matrix</span>
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1">Course name must match the application form</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-primary transition-colors text-2xl border-none bg-transparent cursor-pointer">
                                    <FaTimes />
                                </button>
                            </header>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700"
                                    >
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">01. Course Name</label>
                                    <input
                                        type="text"
                                        list="standard-courses"
                                        placeholder="e.g. BCA"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700"
                                    />
                                    <datalist id="standard-courses">
                                        {(DEPARTMENT_COURSES[formData.department] || Object.values(DEPARTMENT_COURSES).flat()).map((n) => <option key={n} value={n} />)}
                                    </datalist>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 3 Years"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Semester Fee (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Default by course type"
                                            value={formData.fees}
                                            onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">02. Capacity (Total Seats)</label>
                                        <input
                                            type="number"
                                            value={formData.totalSeats}
                                            onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                                            required
                                            min="1"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">03. Occupied (Filled)</label>
                                        <input
                                            type="number"
                                            value={formData.filledSeats}
                                            onChange={(e) => setFormData({ ...formData, filledSeats: e.target.value })}
                                            required
                                            min="0"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Calculated Availability Feedback */}
                                <div className="bg-neutralLight/40 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Calculated Availability</p>
                                        <p className="text-2xl font-black text-gray-800 tracking-tighter">
                                            {Number(formData.totalSeats) - Number(formData.filledSeats)} <span className="text-[10px] text-primary uppercase ml-2 tracking-widest">Vacancy</span>
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${Number(formData.totalSeats) - Number(formData.filledSeats) <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}>
                                        <FaCheck />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(153,27,27,0.3)] hover:bg-secondary transition-all active:scale-95 border-none cursor-pointer flex items-center justify-center gap-3"
                                    >
                                        <FaCheck className="text-lg" /> {currentCourse ? 'Commit Changes' : 'Initialize Matrix'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSeatManagement;
