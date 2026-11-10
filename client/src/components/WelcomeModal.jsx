import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaTimes, FaArrowRight } from 'react-icons/fa';

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Show modal on load with a slight delay for better UX
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleApplyNow = () => {
        setIsOpen(false);
        navigate("/enquiry");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Dark Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 animate-fadeIn"
                onClick={handleClose}
            ></div>

            {/* Modal Card */}
            <div className="relative bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-slideDown scale-100">
                {/* Header Decoration */}
                <div className="bg-primary h-2 w-full"></div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors cursor-pointer p-1"
                    aria-label="Close"
                >
                    <FaTimes size={24} />
                </button>

                <div className="p-8 md:p-10 text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6 border-2 border-primary/10 shadow-inner">
                        <FaGraduationCap className="text-2xl sm:text-3xl md:text-4xl text-primary" />
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl md:text-3xl font-serif font-black text-gray-900 mb-4 leading-tight">
                        🎓 Admission Open <br />
                        <span className="text-primary italic">for 2026</span>
                    </h2>

                    <div className="space-y-4 mb-8">
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Admissions for the <span className="font-bold text-gray-900 underline decoration-accent decoration-2 underline-offset-4">2026 academic year</span> are now open.
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed px-4">
                            Students can apply for various courses and programs.
                            Limited seats available — secure your admission early.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleApplyNow}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-red-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transform hover:-translate-y-1 active:scale-95 cursor-pointer text-lg tracking-wide"
                        >
                            Apply Now <FaArrowRight />
                        </button>
                        <button
                            onClick={handleClose}
                            className="w-full bg-gray-50 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-100 transition-all cursor-pointer text-sm"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

                {/* Footer Tag */}
                <div className="bg-gray-50 py-3 text-center border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                        Join the Excellence • RVS College 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
