import React, { useState, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);

  const handleAdmissionClick = (e) => {
    e.preventDefault();
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/student/dashboard');
    } else {
      navigate('/student-login');
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    {
      name: 'ACADEMICS',
      path: '/courses',
      dropdown: [
        { name: 'UG Programmes', path: '/courses' },
        { name: 'PG Programmes', path: '/courses' },
        { name: 'Research', path: '/research/ugc-projects' },
      ]
    },
    { name: 'ADMISSION', onClick: handleAdmissionClick },
    { name: 'RESEARCH', path: '/research/ugc-projects' },
    { name: 'CAMPUS', path: '/campus' },
    { name: 'TRAINING & PLACEMENTS', path: '/training-placement' },
    { name: 'EXAMINATION', path: '/examination' },
  ];

  // Extra links shown only in the mobile menu
  const mobileExtras = [
    { name: 'BROCHURE', path: '/brochure' },
    { name: 'ENQUIRY', path: '/enquiry' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  const activeStyle = "bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/20 backdrop-blur-md";
  const baseStyle = "px-2.5 xl:px-4 2xl:px-5 py-2 mx-0.5 xl:mx-1 text-[11px] xl:text-[12px] 2xl:text-[12.5px] font-black tracking-wider xl:tracking-widest whitespace-nowrap transition-all duration-300 flex items-center text-white/90 rounded-full hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95";

  return (
    <nav className="bg-gradient-to-r from-secondary to-primary shadow-lg sticky top-0 z-40 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-3 sm:px-4 lg:px-2 flex justify-between items-center py-1.5 lg:py-2">

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center flex-grow min-w-0">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative group h-full"
              onMouseEnter={() => item.dropdown && setIsAcademicsOpen(true)}
              onMouseLeave={() => item.dropdown && setIsAcademicsOpen(false)}
            >
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`${baseStyle} h-full cursor-pointer border-none bg-transparent uppercase`}
                >
                  {item.name}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${baseStyle} ${isActive ? activeStyle : ''} uppercase`
                  }
                >
                  {item.name}
                  {item.dropdown && <FaChevronDown className="ml-1.5 text-[10px]" />}
                </NavLink>
              )}

              {/* Dropdown Menu - Modernized */}
              {item.dropdown && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-secondary/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-2 border border-white/10 transition-all duration-300 transform origin-top ${isAcademicsOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 pointer-events-none -translate-y-2'}`}>
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className="block px-4 py-3 text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-white hover:shadow-inner rounded-xl transition-all duration-200 uppercase tracking-wider"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: college short name on the left */}
        <Link to="/" className="lg:hidden text-white font-black tracking-widest text-sm no-underline">
          RVSCAS
        </Link>

        {/* Right Side: Dashboard Link & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4 py-1 lg:py-2 flex-shrink-0">
          <Link
            to={user ? (user.role === 'student' ? '/student/dashboard' : `/${user.role}/dashboard`) : "/login"}
            className="bg-white text-primary px-4 xl:px-5 py-2 rounded-full text-[11px] font-black hover:bg-yellow-400 hover:text-primary transition-all shadow-lg flex items-center transform hover:scale-105 whitespace-nowrap"
          >
            <FaUserShield className="mr-2" />
            {user ? 'DASHBOARD' : 'LOGIN'}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden text-white text-2xl h-11 w-11 flex items-center justify-center bg-transparent border-none cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer - Modernized */}
      {isMenuOpen && (
        <div className="lg:hidden bg-secondary/98 backdrop-blur-2xl border-t border-white/5 animate-slideDown shadow-2xl rounded-b-3xl mx-3 sm:mx-4 mt-1 mb-2 max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain">
          <div className="flex flex-col p-3 sm:p-4 space-y-1">
            {[...navItems, ...mobileExtras].map((item) => (
              <div key={item.name}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="w-full text-left px-5 py-3 text-sm font-bold text-white/90 hover:bg-white/10 hover:text-white rounded-2xl flex justify-between items-center border-none bg-transparent cursor-pointer transition-all"
                  >
                    {item.name}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-5 py-3 text-sm font-bold rounded-2xl flex justify-between items-center transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}
            {user && (
              <button
                type="button"
                onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }}
                className="w-full text-left px-5 py-3 text-sm font-bold text-yellow-300 hover:bg-white/10 rounded-2xl border-none bg-transparent cursor-pointer transition-all"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
