import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaFlask, FaMicroscope, FaDna, FaSatellite, FaArrowAltCircleRight,
    FaFileAlt, FaUserTie, FaMoneyBillWave, FaClock, FaChevronRight
} from 'react-icons/fa';

const OFFICIAL_SITE = 'https://rvscas.ac.in';

const UGCProjects = () => {
    // Only UGC Projects has a page here; the rest live on the official college site.
    const researchMenu = [
        { name: 'Funded Projects', href: OFFICIAL_SITE },
        { name: 'Other Projects', href: OFFICIAL_SITE },
        { name: 'UGC Projects', path: '/research/ugc-projects', active: true },
        { name: 'Ph.D', href: OFFICIAL_SITE },
        { name: 'Publications', href: OFFICIAL_SITE },
        { name: 'Books Published', href: OFFICIAL_SITE },
        { name: 'Patents', href: OFFICIAL_SITE },
        { name: 'Paper Presentation', href: OFFICIAL_SITE },
    ];
    const menuItemBase = 'flex items-center justify-between w-full p-4 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all duration-300 group';
    const menuItemInactive = 'text-gray-600 hover:bg-red-50 hover:text-[#8B0000]';

    const instrumentationFacility = [
        'Central Instrumentation Facility',
        'Central Instrumentation Committee',
        'Quaternary HPLC',
        'FTIR-ATR',
        'Spray Pyrolysis Unit',
        'Spin Coating Unit',
        'Dip Coating Unit',
        'Fermenter'
    ];

    const dbtSection = [
        'DBT Star College Scheme',
        'Objectives',
        'Advisory Committee',
        'DBT Activities',
        'Meeting Minutes',
        'Assets Acquired'
    ];

    const projects = [
        {
            type: "UGC Minor Research",
            fNo: "MRP - 5441/14 (UGC SERO)",
            title: "A Study on the Level of Awareness about Hygiene among School Students at Sulur Taluk, Coimbatore",
            investigator: "R. Kumudha",
            department: "Computer Studies",
            amount: "Rs. 1,85,000/-",
            period: "24 months"
        },
        {
            type: "UGC Minor Research",
            fNo: "MRP - 4988/14 (UGC SERO)",
            title: "Prevalence of Anaemia among Adolescent Girls (17–19 years) and Impact of Iron Rich Supplement and Nutrition Education",
            investigator: "Ms. K. Yasodhadevi",
            department: "Foods and Nutrition",
            amount: "Rs. 2,50,000/-",
            period: "12 months"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Page Header */}
            <div className="bg-[#8B0000] text-white py-12 px-4 shadow-md relative overflow-hidden">
                <div className="container mx-auto relative z-10 animate-fadeIn text-center">
                    <h1 className="text-4xl md:text-5xl font-black italic font-serif mb-4 uppercase tracking-tighter">Research</h1>
                    <nav className="flex justify-center items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-red-100/70">
                        <span>Home</span>
                        <FaChevronRight className="text-[8px]" />
                        <span>Research</span>
                        <FaChevronRight className="text-[8px]" />
                        <span className="text-white">UGC Projects</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

                {/* Left Sidebar */}
                <aside className="lg:col-span-3 space-y-8 animate-slideDown">

                    {/* Research Menu */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-6 bg-gradient-to-br from-[#8B0000] to-[#600000] text-white">
                            <h3 className="text-sm font-black uppercase tracking-widest font-serif italic">Research Menu</h3>
                        </div>
                        <div className="p-2">
                            {researchMenu.map((item) => {
                                const inner = (
                                    <>
                                        <span className="flex items-center">
                                            <FaArrowAltCircleRight className={`mr-3 text-sm ${item.active ? 'text-red-200' : 'text-red-900/20'} group-hover:text-[#8B0000] transition-colors`} />
                                            {item.name}
                                        </span>
                                        <FaChevronRight className="text-[9px] opacity-20" />
                                    </>
                                );
                                return item.path ? (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `${menuItemBase} ${isActive || item.active
                                                ? 'bg-[#8B0000] text-white shadow-lg transform scale-[1.02]'
                                                : menuItemInactive
                                            }`
                                        }
                                    >
                                        {inner}
                                    </NavLink>
                                ) : (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${menuItemBase} ${menuItemInactive}`}
                                    >
                                        {inner}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Instrumentation Facility */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#8B0000] flex items-center">
                                <FaFlask className="mr-2" /> Instrumentation Facility
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {instrumentationFacility.map((item) => (
                                <div key={item} className="flex items-center text-[10px] font-bold text-gray-500 hover:text-[#8B0000] cursor-pointer transition-colors p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-[#8B0000]/30 rounded-full mr-3 shrink-0"></div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DBT Section */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 border-l-8 border-green-700">
                        <div className="p-6 bg-green-50/30">
                            <h3 className="text-xs font-black uppercase tracking-widest text-green-900 flex items-center">
                                <FaDna className="mr-2" /> DBT Section
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {dbtSection.map((item) => (
                                <div key={item} className="flex items-center text-[10px] font-bold text-gray-500 hover:text-green-700 cursor-pointer transition-colors p-2 hover:bg-green-50 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-green-700/30 rounded-full mr-3 shrink-0"></div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DST Section */}
                    <div className="bg-[#8B0000] rounded-3xl p-5 sm:p-8 text-white shadow-2xl relative overflow-hidden group">
                        <FaSatellite className="absolute right-0 bottom-0 text-5xl md:text-8xl opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-serif font-black text-xl mb-4 leading-tight uppercase tracking-widest italic">DST Section</h4>
                        <div className="flex items-center space-x-2 mt-4 bg-white/10 p-4 rounded-2xl border border-white/20">
                            <FaChevronRight className="text-xs text-yellow-400" />
                            <span className="text-[11px] font-black uppercase tracking-widest">DST-FIST Scheme</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-9 animate-fadeIn">
                    <div className="mb-10 text-center lg:text-left border-b-4 border-[#8B0000] pb-6">
                        <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2 italic">Research & Development</h2>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#8B0000] font-serif uppercase tracking-tight">UGC Funded Projects</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:gap-12 mt-12">
                        {projects.map((project, idx) => (
                            <div key={idx} className="bg-white rounded-3xl md:rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 hover:shadow-red-900/5 transition-all duration-500 group">
                                <div className="bg-gray-50/50 p-5 sm:p-8 md:p-10 border-b border-gray-100 relative">
                                    <div className="absolute top-0 right-0 px-5 sm:px-8 py-3 bg-[#8B0000] text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl shadow-lg transform -rotate-2">
                                        {project.type}
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                        <div className="bg-white p-6 rounded-[30px] border-b-8 border-[#8B0000] shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <FaMicroscope className="text-3xl sm:text-4xl md:text-5xl text-[#8B0000]" />
                                        </div>
                                        <div className="space-y-4 flex-grow">
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                                <FaFileAlt className="mr-2 text-[#8B0000]" /> Project F.No: {project.fNo}
                                            </p>
                                            <h4 className="text-2xl font-black text-gray-800 font-serif leading-tight italic uppercase tracking-tight">
                                                {project.title}
                                            </h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-[#8B0000] uppercase opacity-60 flex items-center"><FaUserTie className="mr-2" /> Investigator</span>
                                                    <p className="text-sm font-bold text-gray-700 italic">{project.investigator}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-[#8B0000] uppercase opacity-60 flex items-center">Department</span>
                                                    <p className="text-sm font-bold text-gray-700 italic">{project.department || 'General'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-[#8B0000] uppercase opacity-60 flex items-center"><FaMoneyBillWave className="mr-2" /> Allocated</span>
                                                    <p className="text-sm font-bold text-[#8B0000] italic underline decoration-red-200">{project.amount}</p>
                                                </div>
                                                <div className="space-y-1 sm:col-span-2">
                                                    <span className="text-[10px] font-black text-[#8B0000] uppercase opacity-60 flex items-center"><FaClock className="mr-2" /> Execution Period</span>
                                                    <p className="text-sm font-bold text-gray-700 italic">{project.period}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Counter */}
                    <div className="mt-20 flex justify-center">
                        <div className="bg-white px-5 sm:px-8 md:px-12 py-8 rounded-3xl md:rounded-[40px] shadow-2xl border-t-8 border-[#8B0000] text-center max-w-xs group transition-all hover:scale-105">
                            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Funded</h5>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-[#8B0000] font-serif italic leading-none">{projects.length}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-tighter">Current UGC Minor Projects</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UGCProjects;
