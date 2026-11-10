import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div data-layout-root className="flex flex-col min-h-screen bg-gray-50 overflow-x-clip">
            {/* College header scrolls away; the menu bar stays at the top */}
            <Header />
            <Navbar />

            <main className="flex-grow min-w-0">
                <Outlet />
            </main>

            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default MainLayout;
