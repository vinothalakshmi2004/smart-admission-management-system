import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Nav Container - Fixed to Top */}
            <header className="fixed top-0 left-0 w-full z-50">
                <Header />
                <Navbar />
            </header>

            {/* Content Area - Add padding for fixed header, but remove for Home for full-screen hero */}
            <main className={`flex-grow ${isHome ? '' : 'pt-[160px] md:pt-[180px] lg:pt-[170px]'}`}>
                <Outlet />
            </main>

            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default MainLayout;
