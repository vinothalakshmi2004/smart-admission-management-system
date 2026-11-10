import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaInfoCircle, FaNewspaper, FaCalendarAlt, FaUserLock, FaPhoneAlt,
    FaCheckCircle, FaAward, FaUserCheck, FaGraduationCap, FaLayerGroup,
    FaChevronRight, FaBookOpen, FaClipboardCheck
} from 'react-icons/fa';

const Examination = () => {
    const [activeSection, setActiveSection] = useState('about');
    const navigate = useNavigate();

    const handleSidebarClick = (id) => {
        if (id === 'login') return navigate('/student-login');
        if (id === 'contact') return navigate('/contact');
        setActiveSection(id);
        const el = document.getElementById(`exam-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const sidebarItems = [
        { id: 'about', label: 'About Examination', icon: <FaInfoCircle /> },
        { id: 'news', label: 'Examination News', icon: <FaNewspaper /> },
        { id: 'timetable', label: 'Exam Time Table Nov 2025', icon: <FaCalendarAlt /> },
        { id: 'login', label: 'Students Login', icon: <FaUserLock /> },
        { id: 'contact', label: 'Contact', icon: <FaPhoneAlt /> },
    ];

    const attendanceData = [
        { percentage: '75% & Above', status: 'Eligible', color: 'text-green-600 bg-green-50' },
        { percentage: '65% – 74%', status: 'With Condonation Fee', color: 'text-yellow-600 bg-yellow-50' },
        { percentage: '50% – 64%', status: 'Arrear Papers Only', color: 'text-orange-600 bg-orange-50' },
        { percentage: 'Below 49%', status: 'Redo Semester', color: 'text-red-600 bg-red-50' },
    ];

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-20 font-sans">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-white via-[#F5E6A1] to-white border-b-2 border-[#D4AF37]/30 py-16 px-4 mb-12 shadow-sm">
                <div className="container mx-auto text-center animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#8B0000] font-serif uppercase tracking-tighter mb-4 drop-shadow-sm">
                        Examination
                    </h1>
                    <nav className="flex justify-center items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                        <span className="text-gray-400">Home</span>
                        <FaChevronRight className="text-[10px]" />
                        <span>Examination</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar */}
                <aside className="lg:col-span-3 space-y-6">
                    <div className="sticky top-48 bg-white rounded-3xl shadow-xl overflow-hidden border border-[#F5E6A1]">
                        <div className="p-6 bg-gradient-to-br from-[#8B0000] to-[#500000] text-white">
                            <h3 className="font-serif font-black uppercase tracking-widest text-sm flex items-center">
                                <FaLayerGroup className="mr-2" /> Quick Menu
                            </h3>
                        </div>
                        <div className="p-2">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSidebarClick(item.id)}
                                    className={`w-full flex items-center p-4 rounded-2xl text-sm font-bold transition-all duration-300 group mb-1 ${activeSection === item.id
                                            ? 'bg-[#F5E6A1] text-[#8B0000] shadow-inner'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`mr-4 text-lg ${activeSection === item.id ? 'text-[#8B0000]' : 'text-[#D4AF37] group-hover:scale-110 transition-transform'}`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Link Card */}
                    <div className="bg-[#8B0000] rounded-3xl p-5 sm:p-8 text-white shadow-2xl relative overflow-hidden group">
                        <FaAward className="absolute right-0 bottom-0 text-5xl md:text-8xl opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-serif font-black text-xl mb-4 leading-tight italic">Need Exam Assistance?</h4>
                        <p className="text-xs font-bold text-red-100 mb-6 italic opacity-80">General information and support for candidates.</p>
                        <button type="button" onClick={() => navigate('/contact')} className="bg-white text-[#8B0000] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#F5E6A1] transition-colors">
                            Request Help
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-9 space-y-10">

                    {/* Section 1: All about Examinations */}
                    <section id="exam-about" className="scroll-mt-48 bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border border-gray-100 animate-slideDown">
                        <div className="flex items-center mb-8 border-l-8 border-[#D4AF37] pl-6">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-800 font-serif uppercase tracking-tight">
                                <span className="text-[#D4AF37]">🔹</span> All about Examinations
                            </h2>
                        </div>
                        <div className="space-y-6 text-gray-700 leading-[1.8] font-medium italic">
                            <p>
                                Excellence in evaluation is the cornerstone of academic integrity at our institution. The academic year is systematically divided into two semesters, ensuring a balanced workload and continuous assessment for our students.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-dashed border-[#D4AF37]">
                                <div className="space-y-4">
                                    <h5 className="font-black text-[#8B0000] uppercase text-xs tracking-widest flex items-center">
                                        <FaCalendarAlt className="mr-2" /> Semester Cycle
                                    </h5>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center"><FaCheckCircle className="text-[#D4AF37] mr-2 text-[10px]" /> June/July – November/December</li>
                                        <li className="flex items-center"><FaCheckCircle className="text-[#D4AF37] mr-2 text-[10px]" /> November/December – April/May</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="font-black text-[#8B0000] uppercase text-xs tracking-widest flex items-center">
                                        <FaBookOpen className="mr-2" /> Duration & Scope
                                    </h5>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center"><FaCheckCircle className="text-[#D4AF37] mr-2 text-[10px]" /> Minimum 90 working days</li>
                                        <li className="flex items-center"><FaCheckCircle className="text-[#D4AF37] mr-2 text-[10px]" /> Applicable for all UG & PG</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: COP */}
                    <section className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-xl border border-gray-100">
                        <div className="flex items-center mb-8 border-l-8 border-[#D4AF37] pl-6">
                            <h2 className="text-2xl font-black text-gray-800 font-serif uppercase tracking-tight">
                                Career Oriented Programme (COP)
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <ul className="space-y-4">
                                {[
                                    "UGC vocationalisation programme",
                                    "Skill-based add-on courses",
                                    "Certificate/Diploma/Advanced Diploma",
                                    "Annual Examination conducted",
                                    "COP certificate issued after completion"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start bg-[#D4AF37]/5 p-3 rounded-xl border-l-4 border-[#D4AF37] group hover:bg-[#D4AF37]/10 transition-colors">
                                        <FaAward className="text-[#D4AF37] mt-0.5 mr-3 flex-shrink-0" />
                                        <span className="text-sm font-bold text-gray-700 italic">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="bg-[#D4AF37] p-1 rounded-[30px] shadow-lg">
                                <div className="bg-white p-5 sm:p-8 rounded-[28px] text-center">
                                    <FaGraduationCap className="text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mx-auto mb-4" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Enhance your</p>
                                    <h4 className="text-xl font-black text-[#8B0000] font-serif italic">Employability Skills</h4>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 & 4: ALCTA & Attendance */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* ALCTA */}
                        <section className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-xl border border-[#F5E6A1] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 bg-[#D4AF37] text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                                Special Subject
                            </div>
                            <h3 className="text-xl font-black text-gray-800 font-serif mb-6 uppercase tracking-tight">ALCTA</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Module Type", value: "Self-study subject" },
                                    { label: "Credit Value", value: "4 Extra Credits" },
                                    { label: "Assessment", value: "100 Marks (EOS Only)" },
                                    { label: "Condition", value: "One Attempt Clearance" },
                                ].map((info, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-xs font-black text-[#8B0000] uppercase opacity-70">{info.label}</span>
                                        <span className="text-sm font-bold text-gray-700 italic">{info.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Attendance Requirements */}
                        <section className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-xl border border-gray-100">
                            <h3 className="text-xl font-black text-gray-800 font-serif mb-6 uppercase tracking-tight flex items-center">
                                <FaUserCheck className="mr-2 text-[#D4AF37]" size={20} /> Attendance Requirements
                            </h3>
                            <div className="overflow-hidden rounded-2xl border border-gray-100">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#FAF9F6] text-[#8B0000] font-black uppercase text-[10px] tracking-widest">
                                        <tr>
                                            <th className="px-4 py-3">Attendance %</th>
                                            <th className="px-4 py-3">Eligibility</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-bold italic">
                                        {attendanceData.map((row, idx) => (
                                            <tr key={idx} className={`${row.color} border-t border-white`}>
                                                <td className="px-4 py-3">{row.percentage}</td>
                                                <td className="px-4 py-3">{row.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Section 5: Passing Requirements */}
                    <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border-t-8 border-[#D4AF37]">
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-1 text-center md:text-left border-r border-[#D4AF37]/20">
                                <h3 className="text-2xl font-black text-[#8B0000] font-serif uppercase tracking-tight leading-none mb-2">Passing</h3>
                                <p className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Min Standards</p>
                            </div>
                            <div className="md:col-span-2 flex flex-wrap gap-4">
                                <div className="bg-[#8B0000] text-white px-5 sm:px-8 py-4 rounded-3xl shadow-lg transform -rotate-2">
                                    <span className="block text-[10px] uppercase font-black opacity-70">UG Course</span>
                                    <span className="text-2xl md:text-3xl font-black italic">40%</span>
                                </div>
                                <div className="bg-[#D4AF37] text-white px-5 sm:px-8 py-4 rounded-3xl shadow-lg transform rotate-2">
                                    <span className="block text-[10px] uppercase font-black opacity-70">PG Course</span>
                                    <span className="text-2xl md:text-3xl font-black italic">50%</span>
                                </div>
                                <div className="bg-gray-100 text-gray-400 px-6 py-4 rounded-3xl flex items-center">
                                    <span className="text-[10px] uppercase font-black italic">No Min for CIA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Assessment Structure */}
                    <section>
                        <h2 className="text-2xl font-black text-gray-800 mb-8 font-serif uppercase tracking-widest text-center">
                            Assessment Structure
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Theory", items: ["One CIA", "One Model"], icon: <FaBookOpen /> },
                                { title: "Practical", items: ["One Model", "Class Performance"], icon: <FaClipboardCheck /> },
                                { title: "Project", items: ["Review I, II", "Outcome Assessment"], icon: <FaLayerGroup /> }
                            ].map((box, idx) => (
                                <div key={idx} className="bg-white p-5 sm:p-8 rounded-[35px] shadow-xl border-b-8 border-[#D4AF37] hover:bg-[#F5E6A1]/10 transition-all group">
                                    <div className="text-[#D4AF37] text-2xl sm:text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform">
                                        {box.icon}
                                    </div>
                                    <h4 className="text-lg font-black text-gray-800 font-serif mb-4 italic uppercase tracking-tight">{box.title}</h4>
                                    <ul className="space-y-2">
                                        {box.items.map((it, i) => (
                                            <li key={i} className="text-xs font-bold text-gray-500 italic flex items-center">
                                                <FaChevronRight className="text-[8px] mr-2 text-[#D4AF37]" /> {it}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default Examination;
