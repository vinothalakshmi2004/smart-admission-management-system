import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const menuItems = [
    { id: 'cell', label: 'Admission Cell' }, // Handled via onClick
    { id: 'brochure', label: 'Brochure', path: '/brochure' },
    { id: 'enquiry', label: 'Enquiry', path: '/enquiry' },
];

const AdmissionSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => path && location.pathname === path;

    const handleCellClick = (e) => {
        e.preventDefault();
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            navigate("/student/dashboard");
        } else {
            navigate("/student-login");
        }
    };
    return (
        <aside className="w-full">
            {/* Sidebar Header */}
            <div className="bg-[#e8e3d9] px-6 pt-8 pb-4 rounded-t-2xl lg:rounded-t-none lg:rounded-tl-2xl">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter leading-none">
                    Admission
                </h2>
                <div className="h-[3px] bg-[#8B0000] w-16 mt-3 rounded-full"></div>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col">
                {menuItems.map((item, index) => {
                    const active = isActive(item.path);
                    const baseClasses = `flex items-center justify-between w-full px-6 py-5 transition-all duration-200 border-b border-gray-200/50 group text-left border-none
                                ${active
                            ? 'bg-[#8B0000] text-white'
                            : 'bg-[#d8d2c4] text-gray-800 hover:bg-[#cfc8ba] hover:pl-8'
                        }`;

                    if (item.id === 'cell') {
                        return (
                            <button
                                key={item.id}
                                onClick={handleCellClick}
                                className={baseClasses}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="text-[15px] lg:text-[17px] font-semibold">
                                    {item.label}
                                </span>
                                <FaChevronRight
                                    className="text-sm transition-transform duration-200 text-gray-500 group-hover:translate-x-1"
                                />
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={baseClasses}
                            style={{ textDecoration: 'none' }}
                        >
                            <span className={`text-[15px] lg:text-[17px] font-semibold ${active ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                            <FaChevronRight
                                className={`text-sm transition-transform duration-200 ${active ? 'text-white' : 'text-gray-500 group-hover:translate-x-1'}`}
                            />
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Info Strip */}
            <div className="bg-[#e8e3d9] px-6 py-4 rounded-b-2xl lg:rounded-b-none lg:rounded-bl-2xl">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Academic Session 2026-27
                </p>
            </div>
        </aside>
    );
};

export default AdmissionSidebar;
