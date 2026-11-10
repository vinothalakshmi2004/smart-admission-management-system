import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaUniversity, FaArrowRight, FaCalendarAlt, FaNewspaper, FaCheckCircle, FaUserGraduate } from 'react-icons/fa';
import HeroCarousel from '../components/HeroCarousel';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WelcomeModal from '../components/WelcomeModal';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleApplyClick = (e) => {
        if (e) e.preventDefault();
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            navigate("/student/dashboard");
        } else {
            navigate("/student-login");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <WelcomeModal />

            {/* 1. Hero / Slider Section */}
            <HeroCarousel />


            {/* 2. Quick Access Grid (News, Services, Links) */}
            <div className="container mx-auto px-4 mt-16 md:mt-28 relative z-30 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">

                    {/* News Box */}
                    <Card title="News & Events" icon={FaNewspaper} className="flex flex-col">
                        <div className="space-y-6 flex-grow py-2">
                            {[
                                { date: 'Jan 20', title: 'Start of Even Semester Classes' },
                                { date: 'Jan 15', title: 'Pongal Celebration 2026' },
                                { date: 'Jan 10', title: 'Placement Drive: TCS & Wipro' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group/item cursor-pointer">
                                    <div className="bg-neutralLight text-center rounded-lg p-2 min-w-[55px] h-fit border border-red-100 group-hover/item:border-primary transition-colors">
                                        <span className="block text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">{item.date.split(' ')[0]}</span>
                                        <span className="block text-lg font-black text-primary leading-none">{item.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm font-semibold text-gray-700 group-hover/item:text-primary transition line-clamp-2 leading-snug">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50">
                            <Link to="#" className="text-xs font-bold text-primary hover:text-red-700 tracking-wider uppercase flex items-center">
                                View Full Archive <FaArrowRight className="ml-2 text-[10px]" />
                            </Link>
                        </div>
                    </Card>

                    {/* Student Services Box */}
                    <Card title="Student Services" icon={FaGraduationCap} className="flex flex-col">
                        <div className="space-y-3 flex-grow py-2">
                            {[
                                { name: 'Online Admission 2026', link: '#', isApply: true },
                                { name: 'Pay Fees Online', link: user?.role === 'student' ? '/student/dashboard' : '/student-login' },
                                { name: 'Exam Results', link: '/status' },
                                { name: 'Download Prospectus', link: '/brochure' },
                            ].map((service, i) => (
                                <button
                                    key={i}
                                    onClick={service.isApply ? handleApplyClick : () => service.link.startsWith('/') ? navigate(service.link) : null}
                                    className="flex items-center justify-between w-full p-4 rounded-xl bg-neutralLight hover:bg-primary hover:text-white transition-all group/btn border-none cursor-pointer text-left"
                                >
                                    <span className="font-bold text-gray-700 group-hover/btn:text-white text-sm">{service.name}</span>
                                    <FaArrowRight className="text-primary group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all text-xs" />
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Links Box */}
                    <Card title="Quick Links" icon={FaCheckCircle} className="flex flex-col text-gray-500">
                        <div className="flex-grow py-2">
                            <ul className="space-y-4">
                                {['NIRF 2025 Ranking', 'NAAC Self Study Report', 'IQAC Minutes', 'Research Policy', 'Alumni Registration'].map((link, i) => (
                                    <li key={i} className="flex items-center group/link cursor-pointer">
                                        <span className="w-2 h-2 bg-primary rounded-full mr-4 group-hover/link:scale-125 transition-transform opacity-70 group-hover/link:opacity-100"></span>
                                        <span className="text-sm font-semibold text-gray-600 group-hover/link:text-primary transition-colors">{link}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                </div>
            </div>

            {/* 3. Stats / Highlights */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-gray-200">
                        <div className="p-4 transform hover:scale-105 transition duration-300">
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">4th</h4>
                            <p className="text-sm font-semibold text-gray-500 uppercase">Ranked in India Today</p>
                        </div>
                        <div className="p-4 transform hover:scale-105 transition duration-300">
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">A+</h4>
                            <p className="text-sm font-semibold text-gray-500 uppercase">NAAC Re-Accreditation</p>
                        </div>
                        <div className="p-4 transform hover:scale-105 transition duration-300">
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">35+</h4>
                            <p className="text-sm font-semibold text-gray-500 uppercase">Years of Excellence</p>
                        </div>
                        <div className="p-4 transform hover:scale-105 transition duration-300">
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">100%</h4>
                            <p className="text-sm font-semibold text-gray-500 uppercase">Placement Support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3.5 Admissions Information */}
            <div className="bg-neutralLight py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif">
                            Admissions 2026 – 2027
                        </h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
                            Applications are invited for Undergraduate and Postgraduate programmes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="admission-card">
                            <FaUserGraduate className="admission-icon" />
                            <h3 className="admission-title">Eligibility</h3>
                            <p className="admission-text">
                                UG: 10+2 passed <br />
                                PG: Relevant UG degree
                            </p>
                        </div>

                        <div className="admission-card">
                            <FaCalendarAlt className="admission-icon" />
                            <h3 className="admission-title">Important Dates</h3>
                            <p className="admission-text">
                                Application Start: March 2026 <br />
                                Last Date: June 2026
                            </p>
                        </div>

                        <div className="admission-card">
                            <FaChalkboardTeacher className="admission-icon" />
                            <h3 className="admission-title">Selection Process</h3>
                            <p className="admission-text">
                                Merit-based admission as per University & Government norms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. About Section */}
            <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <div className="md:w-1/2">
                    <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white group">
                        {/* Placeholder for Campus Image */}
                        <div className="bg-gray-200 h-[400px] w-full flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-secondary opacity-10 pattern-dots transform scale-125 group-hover:scale-100 transition duration-700"></div>
                            <FaUniversity className="text-6xl md:text-9xl text-gray-400 relative z-10" />
                        </div>
                        <div className="absolute bottom-0 left-0 bg-primary text-white p-4 sm:p-6 max-w-[85%] sm:max-w-xs shadow-lg">
                            <p className="text-base sm:text-lg font-bold leading-tight italic">"Education is the manifestation of perfection already in man."</p>
                            <p className="mt-2 text-sm text-accent">- Swami Vivekananda</p>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h4 className="text-primary font-bold uppercase tracking-widest mb-2 text-sm">About RVSCAS</h4>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight font-serif">A Legacy of Educational Excellence Since 1986</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Rathnavel Subramaniam College of Arts and Science, autonomous and affiliated to Bharathiar University,
                        is recognized by UGC and re-accredited with 'A+' Grade by NAAC. We strive to impart high-quality education,
                        fostering intellectual growth and character development in our students.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-700 font-medium"><FaCheckCircle className="text-secondary mr-2" /> State-of-the-art Infrastructure</li>
                            <li className="flex items-center text-gray-700 font-medium"><FaCheckCircle className="text-secondary mr-2" /> Experienced Faculty</li>
                        </ul>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-700 font-medium"><FaCheckCircle className="text-secondary mr-2" /> Industry-Integrated Curriculum</li>
                            <li className="flex items-center text-gray-700 font-medium"><FaCheckCircle className="text-secondary mr-2" /> Strong Alumni Network</li>
                        </ul>
                    </div>
                    <Link to="/about" className="inline-block bg-secondary text-white px-5 sm:px-8 py-3 rounded font-bold hover:bg-primary transition shadow-lg transform hover:-translate-y-1">
                        Read Our Story
                    </Link>
                </div>
            </div>

            {/* 5. Courses Grid */}
            <div className="bg-neutralLight py-20 relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#800000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-serif">Our Academic Programs</h2>
                        <div className="w-24 h-1 bg-accent mx-auto rounded"></div>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">Diverse undergraduate and postgraduate programs courses designed to meet the evolving needs of the industry.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Computer Science', icon: '💻', count: '5 Courses' },
                            { title: 'Commerce', icon: '📊', count: '4 Courses' },
                            { title: 'Management', icon: '📈', count: '3 Courses' },
                            { title: 'Life Sciences', icon: '🧬', count: '6 Courses' },
                            { title: 'Psychology', icon: '🧠', count: '2 Courses' },
                            { title: 'English Literature', icon: '📚', count: '2 Courses' }
                        ].map((dept, idx) => (
                            <div key={idx} className="bg-white p-5 sm:p-8 rounded-lg shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-secondary group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                                    <span className="text-6xl md:text-9xl">{dept.icon}</span>
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-2xl sm:text-3xl md:text-4xl mb-4 block group-hover:scale-110 transition duration-300">{dept.icon}</span>
                                    <span className="bg-red-50 text-secondary text-xs font-bold px-3 py-1 rounded-full">{dept.count}</span>
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition">{dept.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Comprehensive curriculum with practical exposure and research opportunities.</p>
                                <Link to="/courses" className="text-sm font-bold text-secondary hover:text-primary hover:underline flex items-center transition">
                                    View Programmes <FaArrowRight className="ml-2 text-xs" />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/courses" className="inline-block border-2 border-primary text-primary px-5 sm:px-8 md:px-10 py-3 rounded font-bold hover:bg-primary hover:text-white transition shadow-md">
                            View All Departments
                        </Link>
                    </div>
                </div>
            </div>

            {/* 6. Call to Action */}
            <div className="bg-secondary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Ready to Begin Your Journey?</h2>
                    <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Admissions open for the academic year 2026-2027. Apply now to secure your place at one of India's top ranking colleges.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button onClick={handleApplyClick} className="px-5 sm:px-8 md:px-12 py-5 text-xl">
                            Apply Online Now
                        </Button>
                        <Button to="/brochure" variant="secondary" className="px-5 sm:px-8 md:px-12 py-5 text-xl !text-white !border-white hover:!bg-white hover:!text-primary">
                            Download Prospectus
                        </Button>
                    </div>
                </div>
            </div>

            {/* 7. Why Choose Us */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif">
                        Why Choose Our College?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        "UGC & University Approved Programmes",
                        "NAAC A+ Accredited Institution",
                        "Experienced & Research-Oriented Faculty",
                        "Career Guidance & Placement Support"
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md border-t-2 border-primary/20 p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
                            <FaCheckCircle className="text-primary text-2xl md:text-3xl mb-4" />
                            <p className="font-bold text-gray-700 text-center leading-snug">{item}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Home;
