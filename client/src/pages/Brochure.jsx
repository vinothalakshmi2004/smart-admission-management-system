import React from 'react';
import { FaFilePdf, FaDownload, FaChevronLeft, FaGraduationCap, FaScroll, FaUniversity } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdmissionSidebar from '../components/AdmissionSidebar';

const Brochure = ({ isInternal = false }) => {
    const navigate = useNavigate();

    const brochures = [
        {
            title: "UG Brochure",
            description: "Explore our undergraduate programs and campus life.",
            link: "https://rvscas.ac.in/static/media/UG%20Brochure.6544f56b.pdf",
            color: "bg-[#8B0000]",
            icon: <FaGraduationCap size={40} />
        },
        {
            title: "PG Brochure",
            description: "Detailed information on postgraduate research and courses.",
            link: "https://rvscas.ac.in/static/media/PG%20Brochure.d338b39e.pdf",
            color: "bg-black",
            icon: <FaScroll size={40} />
        },
        {
            title: "Admission Flyer 2025",
            description: "Essential highlights for the upcoming academic year.",
            link: "https://rvscas.ac.in/static/media/Admission%20Flyer%202025.5b215fa2.pdf",
            color: "bg-gray-800",
            icon: <FaUniversity size={40} />
        }
    ];

    const content = (
        <div className="flex-grow animate-fadeIn">
            <div className="mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-gray-800 uppercase tracking-tighter border-b-4 border-[#8B0000] pb-2 inline-block">
                    Brochures
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {brochures.map((b, i) => (
                    <div key={i} className="bg-white rounded-3xl md:rounded-[40px] shadow-2xl p-5 sm:p-8 md:p-10 border border-gray-100 flex flex-col items-center text-center group transition-all transform animate-fadeIn">
                        <div className={`${b.color} w-20 h-20 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl`}>
                            {b.icon}
                        </div>
                        <h3 className="text-xl font-black italic text-gray-800 uppercase mb-4">{b.title}</h3>
                        <p className="text-xs font-bold text-gray-400 mb-8 leading-relaxed px-4">{b.description}</p>

                        <button
                            onClick={() => window.open(b.link, '_blank')}
                            className={`${b.color} text-white w-full py-4 rounded-full flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all transform active:scale-95`}
                        >
                            <FaDownload className="mr-3" /> Download PDF Brochure
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border-4 border-[#8B0000]/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                <div className="max-w-xl">
                    <h4 className="text-xl font-black italic text-[#8B0000] uppercase mb-4">Need a Printed copy?</h4>
                    <p className="text-xs font-bold text-gray-400 leading-relaxed">
                        Visit our Admission Cell at the Sulur Campus to collect high-quality printed brochures and the complete Prospectus kit.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/enquiry')}
                    className="bg-black text-white px-5 sm:px-8 md:px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#8B0000] transition-all transform shrink-0"
                >
                    Contact Admission Office
                </button>
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

export default Brochure;
