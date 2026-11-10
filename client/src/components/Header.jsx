import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone } from 'react-icons/fa';

const OFFICIAL_SITE = 'https://rvscas.ac.in';
const PHONE_DISPLAY = '+91 80121 33444';
const PHONE_TEL = '+918012133444';

const Header = () => {
    const utilityLinks = [
        { name: 'Career', href: OFFICIAL_SITE },
        { name: 'IQAC', href: OFFICIAL_SITE },
        { name: 'NAAC', href: OFFICIAL_SITE },
        { name: 'NIRF', href: OFFICIAL_SITE },
        { name: 'Contact Us', path: '/contact' },
    ];
    const linkClass = "hover:text-yellow-400 decoration-yellow-400 transition-all";

    return (
        <div className="bg-gradient-to-r from-secondary to-primary text-white py-2 md:py-3 px-3 sm:px-4 md:px-8 shadow-md relative z-50">
            <div className="container mx-auto flex flex-row justify-between items-center gap-3">

                {/* Left Side: Logo & College Title */}
                <Link to="/" className="flex items-center gap-3 md:gap-4 min-w-0 text-white no-underline">
                    <div className="bg-white p-1 rounded-full shadow-lg h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 flex-shrink-0">
                        <img
                            src="https://www.rvscoe.ac.in/assets/img/abt-logo.png"
                            alt="RVS Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-base sm:text-xl md:text-3xl font-black italic font-serif leading-tight md:leading-none tracking-tight">
                            RVS College of Arts and Science
                        </h1>
                        <div className="mt-1 space-y-0.5">
                            <p className="hidden sm:block text-[10px] md:text-[11px] font-bold text-red-100/90 leading-tight uppercase tracking-wider">
                                Autonomous and Affiliated to Bharathiar University, Approved by AICTE
                            </p>
                            <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-red-100 uppercase tracking-wider md:tracking-widest">
                                Re Accredited with 'A+' Grade by NAAC
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Right Side: Utility Links & Phone */}
                <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                    <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                        {utilityLinks.map((link) => (
                            link.href ? (
                                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                    {link.name}
                                </a>
                            ) : (
                                <Link key={link.name} to={link.path} className={linkClass}>
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>

                    <a
                        href={`tel:${PHONE_TEL}`}
                        aria-label={`Call ${PHONE_DISPLAY}`}
                        className="flex items-center justify-center bg-red-900/40 h-10 w-10 md:h-auto md:w-auto md:px-4 md:py-1.5 rounded-full border border-red-700/30 text-[13px] font-black text-white no-underline whitespace-nowrap"
                    >
                        <FaPhone className="text-yellow-500 scale-90 md:mr-2" />
                        <span className="hidden md:inline font-mono">{PHONE_DISPLAY}</span>
                    </a>

                    {/* Far Right: Supporting Logo/Shield */}
                    <div className="hidden xl:block h-12 w-12 opacity-80">
                        <img
                            src="https://www.rvscoe.ac.in/assets/img/abt-logo.png"
                            alt=""
                            className="h-full w-full object-contain grayscale brightness-200"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
