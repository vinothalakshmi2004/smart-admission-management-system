import React from 'react';
import {
    FaTree, FaWifi, FaCoffee, FaMicrophone, FaVideo,
    FaFireExtinguisher, FaBolt, FaDumbbell, FaTint, FaSolarPanel,
    FaOm, FaPrint, FaRecycle, FaWater, FaTrashAlt, FaNetworkWired
} from 'react-icons/fa';

const Campus = () => {
    const facilities = [
        {
            icon: <FaTree />,
            title: "Getting Around",
            description: "Step into our eco-friendly campus, a sprawling green oasis dedicated to holistic excellence. We provide a vibrant campus ambience with a research hub, CBCS system, and industrial-oriented learning environments that nurture intellectual and personal growth."
        },
        {
            icon: <FaNetworkWired />,
            title: "Internet & Intranet Facilities",
            description: "Stay connected with our 200 Mbps leased line which provides 24-hour internet access. Our E-portal offers seamless access to lecture notes and comprehensive support for seminar and symposium preparations."
        },
        {
            icon: <FaWifi />,
            title: "Wi-Fi Campus",
            description: "Experience a fully Wi-Fi enabled campus covering classrooms, library, hostels, and cafeteria. Powered by a 200 Mbps (1:1) Airtel connection and secured with a high-end CISCO ASA 5505 firewall."
        },
        {
            icon: <FaCoffee />,
            title: "Cafeteria",
            description: "Our 'Yummy Tummy' cafeteria seats 450 students and serves multi-cuisine food at subsidized rates. It features an in-house bakery unit ensuring fresh and hygienic snacks daily."
        },
        {
            icon: <FaMicrophone />,
            title: "Conference Halls & Auditorium",
            description: "The campus houses 5 state-of-the-art conference halls and the grand 1000-seater 'Kalam Hall' auditorium, serving as the cultural and academic hub for seminars and events."
        },
        {
            icon: <FaVideo />,
            title: "Surveillance System",
            description: "Student safety is our priority. High-definition CCTV cameras are installed across the campus, providing 24/7 monitoring of all security activities and corridors."
        },
        {
            icon: <FaFireExtinguisher />,
            title: "Fire Extinguisher",
            description: "Safety first. Modern fire extinguishing systems are installed at strategic locations throughout the college buildings as part of our emergency fire safety protocol."
        },
        {
            icon: <FaBolt />,
            title: "Generators",
            description: "Uninterrupted learning is ensured with our heavy-duty power backup system, featuring 250 kVA and 82.5 kVA generators to handle any power contingencies."
        },
        {
            icon: <FaDumbbell />,
            title: "Gymnasium",
            description: "Build a healthy body alongside a healthy mind. Our fully equipped fitness center is available inside the campus for students and staff to maintain physical wellness."
        },
        {
            icon: <FaTint />,
            title: "Rain Water Harvesting",
            description: "We are committed to sustainability. Our sophisticated groundwater improvement system collects and filters rainwater, promoting eco-friendly water conservation."
        },
        {
            icon: <FaSolarPanel />,
            title: "Solar Panels",
            description: "Harnessing the power of the sun. We utilize alternative energy sources through our campus-wide solar panel installation for sustainable power generation."
        },
        {
            icon: <FaOm />,
            title: "Temple",
            description: "Located at the main entrance, our temple houses beautiful statues of Ganapathy, Lakshmi, Saraswathi, Shiva, and Muruga, providing spiritual and emotional support to the campus community."
        },
        {
            icon: <FaPrint />,
            title: "Amenities Centre (Pragathi)",
            description: "Our 'Pragathi' centre provides essential student services including high-speed photocopying and scanning at highly subsidized low-cost rates."
        },
        {
            icon: <FaRecycle />,
            title: "Bio Gas Plant",
            description: "Innovation in waste management. Our on-site Bio Gas plant produces one cylinder of biogas daily by processing organic bio-waste from the campus."
        },
        {
            icon: <FaWater />,
            title: "Reverse Osmosis Plant",
            description: "Health is wealth. We ensure 24/7 supply of purified drinking water to every corner of the campus through our high-capacity Reverse Osmosis (RO) water treatment plant."
        },
        {
            icon: <FaTrashAlt />,
            title: "Solid Waste Management",
            description: "Our eco-safe waste processing involves an advanced incinerator for safe waste disposal, ensuring a clean and hygienic environment for all."
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Header */}
            <div className="bg-[#8B0000] text-white py-16 px-4 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>
                <div className="container mx-auto relative z-10 animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-black italic font-serif mb-4">Our Campus Facilities</h1>
                    <p className="text-xl md:text-2xl text-red-100 font-light max-w-3xl mx-auto italic">
                        Creating a Vibrant and Eco-Friendly Learning Environment
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {facilities.map((fac, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-md p-5 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group animate-slideDown"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="text-[#8B0000] text-2xl sm:text-3xl md:text-4xl mb-6 bg-red-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-[#8B0000] group-hover:text-white transition-colors duration-300 shadow-inner">
                                {fac.icon}
                            </div>
                            <h3 className="text-xl font-black text-gray-800 mb-4 font-serif border-l-4 border-[#8B0000] pl-3 leading-tight uppercase tracking-tight">
                                {fac.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm font-medium italic">
                                {fac.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="mt-20 text-center">
                <div className="h-1 w-24 bg-[#8B0000] mx-auto rounded-full mb-6"></div>
                <p className="text-[#8B0000] font-black tracking-widest uppercase text-sm">
                    Excellence in infrastructure, Excellence in Education
                </p>
            </div>
        </div>
    );
};

export default Campus;
