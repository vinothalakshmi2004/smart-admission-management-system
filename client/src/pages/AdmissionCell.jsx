import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaCheckCircle, FaChevronRight, FaPhoneAlt, FaUserTie, FaSchool, FaHistory, FaBullseye, FaMapMarkerAlt } from 'react-icons/fa';
import AdmissionSidebar from '../components/AdmissionSidebar';

const AdmissionCell = ({ isInternal = false }) => {
    const navigate = useNavigate();

    const programmes = [
        {
            category: "Computer Science",
            items: ["B.Sc AI & ML", "B.Sc Data Science", "BCA", "B.Sc Computer Science", "B.Sc Information Technology", "M.Sc Information Technology", "M.Sc Computer Science", "MCA"]
        },
        {
            category: "Commerce",
            items: ["B.Com", "B.Com (CA)", "B.Com (IT)", "B.Com (Accounting & Finance)", "B.Com (Business Analytics)", "B.Com (Professional Accounting)", "M.Com", "M.Com (Computer Applications)", "M.Com (International Business)"]
        },
        { category: "Mathematics", items: ["B.Sc Maths", "M.Sc Maths"] },
        { category: "Psychology", items: ["B.Sc Psychology"] },
        { category: "Catering Science & Hotel Management", items: ["B.Sc CS & HM"] },
        { category: "Life Science", items: ["B.Sc Biochemistry", "B.Sc Biotechnology", "B.Sc Microbiology", "B.Sc Nutrition and Dietetics", "M.Sc Biochemistry", "M.Sc Biotechnology", "M.Sc Microbiology", "M.Sc Foods & Nutrition"] },
        { category: "Electronics", items: ["B.Sc Internet of Things", "B.Sc Electronics & Communication System", "M.Sc Applied Electronics"] },
        { category: "Management", items: ["BBA", "BBA (CA)", "BBA (Logistics)", "MBA"] },
        { category: "English", items: ["B.A English Literature", "M.A English Literature"] },
        { category: "Social Service", items: ["MSW Programmes"] },
        {
            category: "Ph.D Programme",
            items: ["Tamil – PT", "English – PT", "Biochemistry – FT/PT", "Biotechnology – FT/PT", "Commerce – FT/PT", "Computer Science – FT/PT", "Electronics – FT/PT", "Foods and Nutrition – FT/PT", "Management – FT/PT", "Microbiology – FT/PT", "Mathematics – FT/PT"]
        }
    ];

    const requirements = [
        "SSLC / CBSE / ICSE Mark Sheet",
        "HSC Mark Sheet",
        "Transfer Certificate",
        "Conduct Certificate",
        "Aadhaar Card",
        "Community Certificate",
        "Migration Certificate (other than TN Board)",
        "Passport Size Photographs (4 Nos)",
        "Citizenship Card",
        "Income Certificate (for SC/ST)",
        "Ex-serviceman / Disability Certificate"
    ];

    const content = (
        <div className="flex-grow animate-fadeIn">
            {/* Title Section */}
            <div className="mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-gray-800 uppercase tracking-tighter border-b-4 border-[#8B0000] pb-2 inline-block">
                    Admission Cell
                </h1>
            </div>

            <div className="space-y-10">
                <div className="bg-[#8B0000] p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                        <FaGraduationCap size={300} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black italic mb-6 leading-tight uppercase">RVS Team Welcomes All,</h2>
                    <p className="text-md leading-relaxed text-red-100 font-medium">
                        We offer countless opportunities for you to pursue your dreams and develop the skills you'll need to succeed in the ever-changing global marketplace.
                        At RVS, you'll find a supportive environment for research, scholarly activities and other creative pursuits.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3 space-y-10">
                        <div className="bg-white p-5 sm:p-8 rounded-[30px] shadow-xl border border-gray-100">
                            <h2 className="text-2xl font-black italic text-gray-800 mb-8 border-l-8 border-[#8B0000] pl-6 uppercase tracking-tight">Programmes Offered</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {programmes.map((p, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all">
                                        <h4 className="font-black text-[#8B0000] uppercase text-[10px] tracking-widest mb-3">{p.category}</h4>
                                        <ul className="space-y-1">
                                            {p.items.slice(0, 5).map((item, idx) => (
                                                <li key={idx} className="text-[11px] font-bold text-gray-600 flex items-start">
                                                    <span className="text-[#8B0000] mr-2">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admission Procedure */}
                        <div className="bg-white p-5 sm:p-8 rounded-[30px] shadow-xl border border-gray-100">
                            <h2 className="text-2xl font-black italic text-gray-800 mb-8 border-l-8 border-[#8B0000] pl-6 uppercase tracking-tight">Admission Procedure</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-[#8B0000]/10 rounded-lg flex items-center justify-center text-[#8B0000] mr-4 shrink-0 mt-1 font-black text-xs">1</div>
                                    <p className="text-xs font-bold text-gray-600 leading-relaxed">Students are requested to fill the application form from the Admission Cell.</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-[#8B0000]/10 rounded-lg flex items-center justify-center text-[#8B0000] mr-4 shrink-0 mt-1 font-black text-xs">2</div>
                                    <p className="text-xs font-bold text-gray-600 leading-relaxed">
                                        The student’s seat will be confirmed after receiving the tuition fees in the form of <span className="text-[#8B0000] font-black italic uppercase">Demand Draft</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-[30px] shadow-xl border border-gray-100 flex flex-col group">
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6 border-b pb-2">Requirements</h3>
                            <div className="space-y-3">
                                {requirements.slice(0, 10).map((req, i) => (
                                    <div key={i} className="flex items-start">
                                        <FaCheckCircle className="text-green-500 mr-2 mt-1 shrink-0 text-[10px]" />
                                        <span className="text-[10px] font-bold text-gray-500">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isInternal) return content;

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                    <AdmissionSidebar />
                    {content}
                </div>
            </div>
        </div>
    );
};

export default AdmissionCell;
