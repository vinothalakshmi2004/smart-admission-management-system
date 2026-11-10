import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGraduationCap, FaCheckCircle, FaUsers } from 'react-icons/fa';

const LiveAdmissionCounter = ({ horizontal }) => {
    const [count, setCount] = useState(0);
    const [displayCount, setDisplayCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/applications/stats/count');
                setCount(data.totalAdmissions || 0);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching admission count:", error);
                setLoading(false);
            }
        };

        fetchCount();

        // Polling for live updates
        const interval = setInterval(fetchCount, 10000);
        return () => clearInterval(interval);
    }, []);

    // Number animation logic
    useEffect(() => {
        if (loading) return;

        let start = 0;
        const end = count;
        if (start === end) {
            setDisplayCount(end);
            return;
        }

        const duration = 2000; // 2 seconds
        const increment = end / (duration / 16); // ~60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setDisplayCount(Math.floor(start));
        }, 16);

        return () => clearInterval(timer);
    }, [count, loading]);

    if (horizontal) {
        return (
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-gray-100 mt-12 animate-fadeIn max-w-2xl mx-auto flex items-center justify-center gap-8 relative overflow-hidden group">
                <div className="absolute left-0 top-0 h-full w-2 bg-primary"></div>
                <div className="bg-primary/10 p-5 rounded-3xl text-primary shadow-lg group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <FaGraduationCap className="text-4xl" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center md:text-left">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Live Enrollment Pulse</h4>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter italic">
                            {displayCount.toLocaleString()} <span className="text-primary not-italic">+</span>
                        </p>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-100 hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest leading-none">
                            Confirmed<br /><span className="text-gray-400 text-[9px]">Admissions This Year</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[35px] shadow-2xl border border-gray-100 relative overflow-hidden group hover:border-primary/20 transition-all duration-500 animate-fadeIn">
            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
                        <FaGraduationCap className="text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Registry Pulse</h3>
                        <p className="text-xl font-black text-gray-800 uppercase tracking-tighter italic">Live Admissions</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="text-6xl font-black text-gray-900 tracking-tighter mb-2 flex items-baseline gap-2">
                        {displayCount.toLocaleString()}
                        <span className="text-primary text-2xl animate-pulse">+</span>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
                        <FaUsers className="text-primary" /> Students Enrolled This Session
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-2xl border border-green-100">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <div>
                        <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Verified Status</p>
                        <p className="text-[9px] font-bold text-green-600/70 uppercase tracking-tighter">Database Ledger Confirmed</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        <span>Real-Time Sync</span>
                        <div className="flex gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full animate-ping"></span>
                            <span className="w-1 h-1 bg-primary rounded-full opacity-50"></span>
                            <span className="w-1 h-1 bg-primary rounded-full opacity-25"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveAdmissionCounter;
