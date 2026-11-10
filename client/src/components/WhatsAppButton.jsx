import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const phoneNumber = "918610257232";
    const message = "Hello, I want admission enquiry.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[9999] group"
            aria-label="Contact us on WhatsApp"
        >
            {/* Tooltip */}
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                WhatsApp Enquiry
                <span className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900"></span>
            </span>

            {/* Pulse Effect */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>

            {/* Main Button */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgb(37,211,102,0.6)] transition-all duration-300 transform group-hover:scale-110 active:scale-95 animate-bounce-subtle">
                <FaWhatsapp className="text-3xl md:text-4xl" />
            </div>
        </a>
    );
};

export default WhatsAppButton;
