import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ children, to, onClick, variant = 'primary', className = '', type = 'button' }) => {
    const baseStyles = "px-6 py-2 rounded-lg font-bold shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 text-center cursor-pointer border-none inline-block no-underline";

    const variants = {
        primary: "bg-primary text-white hover:bg-red-700",
        secondary: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={combinedClasses}>
            {children}
        </button>
    );
};

export default Button;
