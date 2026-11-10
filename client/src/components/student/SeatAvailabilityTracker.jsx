import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChair, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { API_URL } from '../../config';

const SeatAvailabilityTracker = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/courses`);
                setCourses(data);
            } catch (error) {
                console.error("Error fetching seats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();

        // Polling for real-time updates every 30 seconds
        const interval = setInterval(fetchSeats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="mb-12 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <FaChair className="text-xl" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter italic font-serif">
                        Real-Time <span className="text-primary not-italic tracking-normal">Seat Availability</span>
                    </h2>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Live inventory of available academic placements</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const available = (course.totalSeats || 0) - (course.filledSeats || 0);
                    const isLow = available <= 5;
                    const fillPercentage = ((course.filledSeats || 0) / (course.totalSeats || 1)) * 100;

                    return (
                        <div key={course._id} className="bg-white p-6 rounded-[30px] shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-black text-gray-800 uppercase text-sm tracking-tight group-hover:text-primary transition-colors pr-4">{course.name}</h3>
                                {isLow ? (
                                    <span className="bg-red-50 text-red-600 p-2 rounded-lg animate-pulse">
                                        <FaExclamationTriangle />
                                    </span>
                                ) : (
                                    <span className="bg-green-50 text-green-600 p-2 rounded-lg">
                                        <FaCheckCircle />
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Availability Pulse</span>
                                    <span className={isLow ? 'text-red-600' : 'text-green-600'}>
                                        {available} Seats Left
                                    </span>
                                </div>

                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${fillPercentage}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                                    <div className="bg-gray-50 p-2 rounded-2xl">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Total</p>
                                        <p className="text-xs font-black text-gray-800">{course.totalSeats}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-2xl">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Filled</p>
                                        <p className="text-xs font-black text-secondary italic">{course.filledSeats}</p>
                                    </div>
                                    <div className="bg-primary/5 p-2 rounded-2xl border border-primary/10">
                                        <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Vacant</p>
                                        <p className="text-xs font-black text-primary">{available}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SeatAvailabilityTracker;
