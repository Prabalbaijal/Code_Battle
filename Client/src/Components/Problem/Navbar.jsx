// components/Navbar.js
import React from 'react';
import Timer from '../Timer/Timer';

const Navbar = ({ darkMode, toggleDarkMode }) => (
    <nav className={`sticky top-0 z-50 flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b-2 border-gray-300 shadow-md`}>
        <div className="text-lg font-bold">Code Battle</div>
        <span className="flex items-center text-lg font-bold">
            <span className={`${darkMode ? 'text-white' : 'text-black'} mr-1`}></span>
            <Timer />
        </span>
        <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded focus:outline-none transition duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    </nav>
);

export default Navbar;
