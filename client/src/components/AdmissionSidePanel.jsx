import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaFileAlt, FaInfoCircle, FaChevronRight } from 'react-icons/fa';

const AdmissionSidePanel = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col group">
            {/* Panel Title */}
            <div className="bg-[#8B0000] text-white py-4 px-2 rounded-l-xl shadow-2xl flex items-center justify-center [writing-mode:vertical-lr] rotate-180 font-black tracking-[0.2em] uppercase text-[10px] transform transition-transform group-hover:translate-x-1">
                ADMISSION
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-1 mt-2">
                <button
                    onClick={() => navigate('/student-login')}
                    className="bg-white border-2 border-[#8B0000] text-[#8B0000] p-3 rounded-l-xl shadow-lg hover:bg-[#8B0000] hover:text-white transition-all transform hover:-translate-x-2 flex items-center justify-center group/item"
                    title="Apply Now"
                >
                    <FaInfoCircle size={18} />
                    <span className="hidden group-hover:block ml-2 text-[10px] font-black uppercase whitespace-nowrap">Apply Now</span>
                </button>

                <button
                    onClick={() => navigate('/brochure')}
                    className="bg-white border-2 border-[#8B0000] text-[#8B0000] p-3 rounded-l-xl shadow-lg hover:bg-[#8B0000] hover:text-white transition-all transform hover:-translate-x-2 flex items-center justify-center group/item"
                    title="Brochure"
                >
                    <FaFileAlt size={18} />
                    <span className="hidden group-hover:block ml-2 text-[10px] font-black uppercase whitespace-nowrap">Brochure</span>
                </button>

                <button
                    onClick={() => navigate('/enquiry')}
                    className="bg-white border-2 border-[#8B0000] text-[#8B0000] p-3 rounded-l-xl shadow-lg hover:bg-[#8B0000] hover:text-white transition-all transform hover:-translate-x-2 flex items-center justify-center group/item"
                    title="Enquiry"
                >
                    <FaPhoneAlt size={18} />
                    <span className="hidden group-hover:block ml-2 text-[10px] font-black uppercase whitespace-nowrap">Enquiry</span>
                </button>
            </div>
        </div>
    );
};

export default AdmissionSidePanel;
