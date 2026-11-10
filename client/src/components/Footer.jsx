import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-darkRed text-gray-200 font-sans py-10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Column 1: Institute Info */}
                <div className="space-y-4">
                    <h3 className="text-white text-xl font-bold uppercase border-b-2 border-accent inline-block pb-1">About RVSCAS</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                        Rathnavel Subramaniam College of Arts and Science is an autonomous institution affiliated to Bharathiar University.
                        We are committed to providing quality education and fostering holistic development since 1986.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-300 hover:text-yellow-400 transition transform hover:scale-110"><FaFacebook size={22} /></a>
                        <a href="#" className="text-gray-300 hover:text-yellow-400 transition transform hover:scale-110"><FaTwitter size={22} /></a>
                        <a href="#" className="text-gray-300 hover:text-yellow-400 transition transform hover:scale-110"><FaInstagram size={22} /></a>
                        <a href="#" className="text-gray-300 hover:text-yellow-400 transition transform hover:scale-110"><FaYoutube size={22} /></a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-4">
                    <h3 className="text-white text-xl font-bold uppercase border-b-2 border-accent inline-block pb-1">Quick Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <Link to="/courses" className="text-sm hover:text-yellow-400 transition flex items-center">Academic Programs</Link>
                        <Link to="/student-login" className="text-sm hover:text-yellow-400 transition flex items-center">Online Admission</Link>
                        <Link to="/status" className="text-sm hover:text-yellow-400 transition flex items-center">Exam Results</Link>
                        <Link to="/about" className="text-sm hover:text-yellow-400 transition flex items-center">Placement Cell</Link>
                        <Link to="/contact" className="text-sm hover:text-yellow-400 transition flex items-center">Alumni Association</Link>
                        <Link to="/iqac" className="text-sm hover:text-yellow-400 transition flex items-center">IQAC / NAAC</Link>
                    </div>
                </div>

                {/* Column 3: Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-white text-xl font-bold uppercase border-b-2 border-accent inline-block pb-1">Contact Us</h3>
                    <ul className="text-sm space-y-4">
                        <li className="flex items-start group">
                            <FaMapMarkerAlt className="mt-1 mr-4 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-300">242, Trichy Road, Sulur, Coimbatore - 641 402, Tamil Nadu, India.</span>
                        </li>
                        <li className="flex items-center group">
                            <FaPhone className="mr-4 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-300">+91 422 2687421</span>
                        </li>
                        <li className="flex items-center group">
                            <FaEnvelope className="mr-4 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-300">principal@rvscas.ac.in</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Privacy Links and Copyright */}
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-red-900/40 flex flex-col md:row justify-between items-center text-xs space-y-4 md:space-y-0 text-gray-400">
                <p>&copy; {new Date().getFullYear()} RVS College of Arts & Science. All Rights Reserved.</p>
                <div className="flex space-x-6">
                    <Link to="#" className="hover:text-yellow-400 transition">Privacy Policy</Link>
                    <Link to="#" className="hover:text-yellow-400 transition">Terms of Use</Link>
                    <Link to="#" className="hover:text-yellow-400 transition">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
