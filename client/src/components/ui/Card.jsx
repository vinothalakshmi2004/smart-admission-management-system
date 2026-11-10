import React from 'react';

const Card = ({ children, className = '', title, icon: Icon }) => {
    return (
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl border-t-4 border-primary p-6 transition-all duration-300 group ${className}`}>
            {title && (
                <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
                    {Icon && <Icon className="text-secondary text-2xl mr-3 group-hover:scale-110 transition-transform" />}
                    <h3 className="text-xl font-bold text-secondary font-serif">{title}</h3>
                </div>
            )}
            <div className="text-gray-600">
                {children}
            </div>
        </div>
    );
};

export default Card;
