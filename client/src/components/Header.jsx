import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone } from 'react-icons/fa';

const Header = () => {
    const utilityLinks = [
        { name: 'Career', path: '/career' },
        { name: 'IQAC', path: '/iqac' },
        { name: 'NAAC', path: '/naac' },
        { name: 'NIRF', path: '/nirf' },
        { name: 'Contact Us', path: '/contact' },
    ];

    return (
        <div className="bg-gradient-to-r from-secondary to-primary text-white py-3 px-4 md:px-8 shadow-md relative z-50">
            <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">

                {/* Left Side: Logo & College Title */}
                <div className="flex items-center space-x-4">
                    <div className="bg-white p-1 rounded-full shadow-lg h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
                        <img
                            src="https://www.rvscoe.ac.in/assets/img/abt-logo.png"
                            alt="RVS Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-3xl font-black italic font-serif leading-none tracking-tight">
                            RVS College of Arts and Science
                        </h1>
                        <div className="mt-1 space-y-0.5">
                            <p className="text-[10px] md:text-[11px] font-bold text-red-100/90 leading-tight uppercase tracking-wider">
                                Autonomous and Affiliated to Bharathiar University, Approved by AICTE
                            </p>
                            <p className="text-[10px] md:text-[11px] font-bold text-red-100 uppercase tracking-widest">
                                Re Accredited with 'A+' Grade by NAAC
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Utility Links & Phone */}
                <div className="flex items-center space-x-3 md:space-x-6">
                    <div className="hidden lg:flex items-center space-x-4 text-[11px] font-bold uppercase tracking-widest">
                        {utilityLinks.map((link) => (
                            <Link key={link.name} to={link.path} className="hover:text-yellow-400 decoration-yellow-400 transition-all">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center bg-red-900/40 px-3 md:px-4 py-1.5 rounded-full border border-red-700/30 text-[12px] md:text-[13px] font-black">
                        <FaPhone className="mr-2 text-yellow-500 scale-90" />
                        <span className="font-mono">+91 80121 33444</span>
                    </div>

                    {/* Far Right: Supporting Logo/Shield */}
                    <div className="hidden xl:block h-12 w-12 opacity-80">
                        <img
                            src="https://www.rvscoe.ac.in/assets/img/abt-logo.png"
                            alt="College Shield"
                            className="h-full w-full object-contain grayscale brightness-200"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
