// components/LanguageSelector.js
import React from 'react';

const LanguageSelector = ({ language, handleChange, darkMode }) => (
    <div className="flex items-center mb-4">
        <label htmlFor="language-select" className="mr-3 text-lg font-semibold">Select Language:</label>
        <select
            id="language-select"
            value={language}
            onChange={handleChange}
            className={`w-48 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-black'} border-2 border-black rounded-md p-2`}
        >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
        </select>
    </div>
);

export default LanguageSelector;
