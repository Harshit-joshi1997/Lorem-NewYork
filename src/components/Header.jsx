import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            {/* Navigation Bar */}
            <nav className="bg-gray-900 border-b border-emerald-700 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition duration-300"
                            >
                                New York Lore
                            </Link>
                        </div>

                        {/* Nav Links */}
                        <div className="flex items-center space-x-4">
                            {[
                                { name: 'Home', to: '/' },
                                { name: 'Stories', to: '/stories' },
                                { name: 'Submit', to: '/submit' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-300 rounded-md transition duration-300 ease-in-out hover:text-white hover:bg-emerald-600/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <span
                                        className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-emerald-400 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"
                                    ></span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
