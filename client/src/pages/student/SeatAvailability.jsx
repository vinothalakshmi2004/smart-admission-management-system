import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChair, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../../config';

const SeatAvailability = ({ isComponent }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/courses`);
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();

        // Live seat updates (list and the currently selected course)
        const socket = io(SOCKET_URL);
        socket.on('seats_updated', ({ course, filledSeats } = {}) => {
            if (!course || typeof filledSeats !== 'number') return;
            const target = String(course).toLowerCase();
            const update = (c) => (c && c.name?.toLowerCase() === target ? { ...c, filledSeats } : c);
            setCourses((prev) => prev.map(update));
            setSelectedCourse((prev) => update(prev));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutralLight">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-black uppercase tracking-widest text-[10px]">Accessing Course Inventory...</p>
            </div>
        );
    }

    return (
        <div className={`${isComponent ? '' : 'bg-neutralLight min-h-screen pb-20 pt-10 px-4'} font-sans animate-fadeIn`}>
            <div className={isComponent ? '' : 'container mx-auto max-w-4xl'}>

                {/* Header Section - Hide if component */}
                {!isComponent && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-12">
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-widest border-none bg-transparent cursor-pointer group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </button>
                        <div className="text-right">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter italic border-r-8 border-primary pr-6 leading-none">
                                Academic <span className="text-primary">Seat Pulse</span>
                            </h1>
                        </div>
                    </div>
                )}

                {!selectedCourse ? (
                    /* Step 1: Course List Selection */
                    <div className="space-y-6">
                        <div className={`bg-white p-5 sm:p-8 rounded-[30px] border border-gray-100 flex items-center gap-4 mb-8 ${isComponent ? 'shadow-none border-none' : 'shadow-sm'}`}>
                            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                                <FaChair className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Available Programs</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select a course to view real-time availability</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses.map((course) => (
                                <button
                                    key={course._id}
                                    onClick={() => setSelectedCourse(course)}
                                    className="bg-white p-5 sm:p-8 rounded-[30px] shadow-xl border border-gray-100 hover:border-primary/30 text-left transition-all duration-300 group flex items-center justify-between group cursor-pointer border-none text-left"
                                >
                                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                                        <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 text-lg">
                                            {course.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-gray-800 uppercase text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors break-words">{course.name}</h3>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Institutional Program</p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-gray-200 group-hover:text-primary group-hover:translate-x-2 transition-all duration-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Step 2: Specific Course Availability Details */
                    <div className="animate-slideUp">
                        <button
                            onClick={() => setSelectedCourse(null)}
                            className="bg-white px-6 py-3 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-md hover:text-primary transition-all mb-8 flex items-center gap-2 border-none cursor-pointer"
                        >
                            <FaArrowLeft /> View All Courses
                        </button>

                        <div className={`bg-white rounded-3xl md:rounded-[40px] border border-gray-100 overflow-hidden relative group ${isComponent ? 'shadow-none border-none' : 'shadow-2xl'}`}>
                            {/* Accent Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className={`${isComponent ? 'p-8' : 'p-12'} relative z-10`}>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Course Identity</span>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 uppercase tracking-tighter leading-none italic">{selectedCourse.name}</h2>
                                    </div>

                                    <div className="flex gap-4">
                                        {((selectedCourse.totalSeats || 0) - (selectedCourse.filledSeats || 0)) <= 5 ? (
                                            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-3xl flex items-center gap-4 animate-pulse border border-red-100 shadow-lg shadow-red-500/10">
                                                <FaExclamationTriangle className="text-2xl" />
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Critical</p>
                                                    <p className="text-xl font-black italic uppercase leading-tight">Very Low</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-green-50 text-green-600 px-6 py-4 rounded-3xl flex items-center gap-4 border border-green-100 shadow-xl shadow-green-500/10">
                                                <FaCheckCircle className="text-2xl" />
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Stable</p>
                                                    <p className="text-xl font-black italic uppercase leading-tight">Available</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                    <div className="bg-gray-50 p-5 sm:p-8 md:p-10 rounded-[35px] border border-gray-100 text-center transform transition-transform hover:-translate-y-2 group/card">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Total Capacity</p>
                                        <p className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 group-hover/card:text-primary transition-colors">{selectedCourse.totalSeats || 0}</p>
                                        <p className="text-[9px] font-black text-gray-300 uppercase mt-4 tracking-tighter">Seats Registered</p>
                                    </div>
                                    <div className="bg-secondary/5 p-5 sm:p-8 md:p-10 rounded-[35px] border border-secondary/10 text-center transform transition-transform hover:-translate-y-2 group/card">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Occupied Seats</p>
                                        <p className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary italic group-hover/card:scale-110 transition-transform duration-500">{selectedCourse.filledSeats || 0}</p>
                                        <p className="text-[9px] font-black text-gray-300 uppercase mt-4 tracking-tighter">Confirmations Pulse</p>
                                    </div>
                                    <div className="bg-primary/5 p-5 sm:p-8 md:p-10 rounded-[35px] border border-primary/20 text-center transform transition-transform hover:-translate-y-2 group/card">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 italic">Vacancy Balance</p>
                                        <p className="text-3xl sm:text-4xl md:text-5xl font-black text-primary animate-pulse group-hover/card:scale-110 transition-transform duration-500">{(selectedCourse.totalSeats || 0) - (selectedCourse.filledSeats || 0)}</p>
                                        <p className="text-[9px] font-black text-primary/40 uppercase mt-4 tracking-tighter">Live Openings</p>
                                    </div>
                                </div>

                                {/* Progress Bar Visualization */}
                                <div className="bg-neutralLight/50 p-5 sm:p-8 rounded-[30px] border border-gray-100">
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Growth Tracker</p>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                                            {Math.round(((selectedCourse.filledSeats || 0) / (selectedCourse.totalSeats || 1)) * 100)}% Filled
                                        </p>
                                    </div>
                                    <div className="h-4 w-full bg-white rounded-full overflow-hidden border border-gray-200">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out rounded-full ${((selectedCourse.totalSeats || 0) - (selectedCourse.filledSeats || 0)) <= 5 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'}`}
                                            style={{ width: `${((selectedCourse.filledSeats || 0) / (selectedCourse.totalSeats || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-12 text-center">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic underline underline-offset-8 decoration-primary/20">Authorized Seat Matrix Pulse • Updated via Live Ledger</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatAvailability;
