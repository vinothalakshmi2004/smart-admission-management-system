import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

const AdmissionSideMenu = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'cell', label: 'Admission Cell' },
        { id: 'brochure', label: 'Brochure' },
        { id: 'enquiry', label: 'Enquiry' },
    ];

    return (
        <div className="w-full lg:w-[320px] shrink-0">
            <div className="mb-6">
                <h2 className="text-[28px] font-black text-[#8B0000] uppercase tracking-tight leading-none">
                    ADMISSION
                </h2>
                <div className="h-[2px] bg-gray-300 w-full mt-2"></div>
            </div>

            <div className="flex flex-col space-y-[4px]">
                {menuItems.map((item) => {
                    const active = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center justify-between w-full px-6 py-[18px] transition-none cursor-pointer text-left
                                ${active
                                    ? 'bg-[#8B0000] text-white hover:bg-[#8B0000] hover:text-white'
                                    : 'bg-[#d8d2c4] text-black hover:bg-[#d8d2c4] hover:text-black'
                                }`}
                            style={{
                                border: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                                transition: 'none',
                                transform: 'none'
                            }}
                        >
                            <span className="text-[17px] font-semibold">{item.label}</span>
                            <FaChevronRight
                                className={`text-sm ${active ? 'text-white' : 'text-black'}`}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AdmissionSideMenu;
