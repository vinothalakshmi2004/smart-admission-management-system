import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="bg-neutralLight min-h-[60vh] py-16 px-4 flex items-center justify-center">
            <div className="max-w-lg w-full bg-white rounded-3xl md:rounded-[40px] shadow-2xl border-t-8 border-primary p-5 sm:p-8 md:p-12 text-center animate-fadeIn">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic text-primary font-serif leading-none">404</h1>
                <div className="h-1.5 w-16 bg-accent mx-auto mt-4 mb-6 rounded-full"></div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-3">Page not found</h2>
                <p className="text-sm font-bold text-gray-400 mb-10">
                    The page you are looking for does not exist or may have been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="bg-primary text-white px-5 sm:px-8 py-3 rounded-full font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-secondary transition-all"
                    >
                        Back to Home
                    </Link>
                    <Link
                        to="/courses"
                        className="border-2 border-primary text-primary px-5 sm:px-8 py-3 rounded-full font-black uppercase text-[11px] tracking-widest hover:bg-primary hover:text-white transition-all"
                    >
                        View Courses
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
