import React from 'react';
import {
    FaUserTie, FaLightbulb, FaCheckCircle, FaHandshake,
    FaSearch, FaClipboardList, FaLaptopCode, FaBriefcase, FaGraduationCap, FaUserGraduate, FaCalendarCheck, FaChartLine
} from 'react-icons/fa';

const TrainingPlacement = () => {
    const keyFeatures = [
        { icon: <FaLaptopCode />, title: "Industry-focused training programs" },
        { icon: <FaLightbulb />, title: "Skill development workshops" },
        { icon: <FaUserTie />, title: "Mock interviews & aptitude tests" },
        { icon: <FaHandshake />, title: "Strong corporate tie-ups" },
        { icon: <FaSearch />, title: "Personalized career guidance" },
        { icon: <FaBriefcase />, title: "Industry networking events" },
    ];

    const highlights = [
        "Placement Counseling & Online Survey",
        "One Month Placement Training Program",
        "TCS CodeVita participation encouragement",
        "Govt job coaching (TNPSC, UPSC, Banking, Insurance, Defense)",
        "Industrial visits",
        "Internship cum placement for PG",
        "Mega Job Fairs",
        "Pool Campus Interviews",
        "Alumni Talks",
        "Career Day Celebration"
    ];

    const mous = [
        { name: "5K Car Care", year: "2025-2026" },
        { name: "Unlox Academy", year: "2025-2026" },
        { name: "CorroHealth", year: "2025-2026" },
        { name: "App Innovation Technologies", year: "2024-2025" },
        { name: "GTT Foundation", year: "2024-2025" },
        { name: "Park Global", year: "2024-25" },
        { name: "CPBFI", year: "2024-25" },
        { name: "Veranda Race", year: "2023-24" },
        { name: "Value Health Inc", year: "2023-24" },
        { name: "CALYXPOD Talent Solutions Pvt. Ltd", year: "2022-23" },
        { name: "ICT Academy Membership", year: "Jan 2022" },
        { name: "INFOSYS BPM", year: "2021" },
    ];

    const recruiters = ["Wipro", "TCS", "Infosys", "HCL", "Cognizant", "Accenture", "GKM", "Sagility", "Rndsoft", "FACE Prep", "Lucid Imaging", "Aggregate Intelligence", "Loadshare"];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#8B0000] to-[#500000] text-white py-20 px-4 text-center shadow-xl">
                <div className="container mx-auto animate-fadeIn">
                    <h1 className="text-4xl md:text-6xl font-black italic font-serif mb-6 drop-shadow-md">
                        RVS College of Arts & Science – Placement & Training
                    </h1>
                    <p className="text-xl md:text-3xl text-red-100 font-light italic max-w-4xl mx-auto border-t border-red-400 pt-6">
                        Empowering Students for Career Excellence
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">

                {/* Left Side: Content & Features */}
                <div className="lg:col-span-8 space-y-12">

                    {/* About Placement Cell */}
                    <section className="bg-red-50/30 p-5 sm:p-8 rounded-3xl border border-red-100/50">
                        <h2 className="text-2xl md:text-3xl font-black text-[#8B0000] mb-6 font-serif uppercase tracking-tight flex items-center">
                            <FaUserGraduate className="mr-3 text-2xl" /> About Placement Cell
                        </h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed text-justify font-medium italic">
                            <p>
                                The Placement and Training Division at RVS College of Arts and Science, Coimbatore, aims to empower students with career opportunities by bridging the gap between academia and industry through structured training and placement initiatives. Our cell's vision is to increase the employability skills of students at both institutional and industrial levels, equipping them with professional skills and guiding them toward successful careers globally.
                            </p>
                            <p>
                                We instill values of genuineness, hard work, and justice in every candidate. Our comprehensive approach ensures that every student is not just prepared for a job, but for a lifelong career journey. Through constant industry interaction and rigorous training modules, we maintain an exceptional track record of successful placements across various sectors.
                            </p>
                        </div>
                    </section>

                    {/* Key Features */}
                    <section>
                        <h2 className="text-2xl font-black text-gray-800 mb-8 font-serif uppercase tracking-widest border-l-8 border-[#8B0000] pl-4">
                            Key Features
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {keyFeatures.map((feature, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                                    <div className="text-[#8B0000] text-2xl md:text-3xl mb-4 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <p className="font-black text-sm text-gray-800 uppercase leading-tight italic">
                                        {feature.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* MoU Section */}
                    <section>
                        <h2 className="text-2xl font-black text-gray-800 mb-8 font-serif uppercase tracking-widest border-l-8 border-[#8B0000] pl-4">
                            Industry MoUs & Collaborations
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mous.map((mou, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#8B0000] transition-colors group">
                                    <span className="font-bold text-gray-700 group-hover:text-[#8B0000] flex items-center text-sm">
                                        <FaCheckCircle className="mr-2 text-xs text-green-500" /> {mou.name}
                                    </span>
                                    <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-500 group-hover:bg-[#8B0000] group-hover:text-white transition-colors">
                                        {mou.year}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Highlights */}
                    <section className="bg-[#8B0000] text-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                            <FaChartLine size={200} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 font-serif uppercase tracking-tight flex items-center">
                            <FaCalendarCheck className="mr-3" /> Placement Division – Highlights
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            {highlights.map((item, idx) => (
                                <li key={idx} className="flex items-start space-x-3 text-sm font-bold italic">
                                    <FaCheckCircle className="mt-1 text-red-300 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                </div>

                {/* Right Side: Recruiters */}
                <div className="lg:col-span-4">
                    <div className="sticky top-48">
                        <h2 className="text-2xl font-black text-[#8B0000] mb-8 font-serif uppercase tracking-widest text-center border-b-4 border-[#8B0000] pb-2">
                            Our Recruiters
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {recruiters.map((company, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white aspect-video flex flex-col items-center justify-center p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-2xl hover:border-[#8B0000] transition-all duration-300 transform hover:scale-105 group"
                                >
                                    <div className="h-8 w-8 mb-2 text-gray-300 group-hover:text-[#8B0000] transition-colors">
                                        <FaBriefcase size={24} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 group-hover:text-gray-800 uppercase tracking-tighter text-center leading-none">
                                        {company}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Summary Card */}
                        <div className="mt-10 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-black">Success Ratio</p>
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#8B0000] font-serif italic">95%+</h4>
                            <p className="text-[11px] text-gray-400 font-medium mt-2">Consistent placement track record for eligible candidates</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Background Decorative Element */}
            <div aria-hidden="true" className="hidden md:block pointer-events-none fixed top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-30 -z-10 -translate-y-1/2 translate-x-1/2"></div>
            <div aria-hidden="true" className="hidden md:block pointer-events-none fixed bottom-0 left-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-30 -z-10 translate-y-1/2 -translate-x-1/2"></div>
        </div>
    );
};

export default TrainingPlacement;
