import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';

const Problem = () => {
    const [language, setLanguage] = useState('javascript'); // Default language
    const [code, setCode] = useState('// Write your code here');

    const languageOptions = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
    ];

    const handleChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <div className="flex h-screen text-gray-800 bg-gray-100">
            {/* Left Sidebar: Problem Description */}
            <div className="w-1/3 p-6 bg-white border-r border-gray-200 shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-purple-600">Problem Description</h2>
                <p className="mb-4">
                    Given an array of integers, return the indices of the two numbers such that they add up to a specific target.
                    You may assume that each input would have exactly one solution, and you may not use the same element twice.
                </p>
                <p className="mb-4">
                    <strong>Example:</strong><br />
                    Input: <code>nums = [2, 7, 11, 15], target = 9</code><br />
                    Output: <code>[0, 1]</code><br />
                    Because <code>nums[0] + nums[1] = 2 + 7 = 9</code>, we return <code>[0, 1]</code>.
                </p>
            </div>

            {/* Right Side: Code Editor */}
            <div className="w-2/3 p-6">
                <div className="flex items-center mb-4">
                    <label htmlFor="language-select" className="mr-3 text-lg font-semibold">Select Language:</label>
                    <select
                        id="language-select"
                        value={language}
                        onChange={handleChange}
                        className="w-48 text-purple-700 border-purple-600 select select-bordered"
                    >
                        {languageOptions.map((lang) => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>

                <div className="border border-purple-200 rounded-lg shadow-xl">
                    <CodeMirror
                        height="500px"
                        className="overflow-hidden rounded-lg"
                        extensions={[
                            language === 'javascript' ? javascript() :
                            language === 'python' ? python() :
                            language === 'cpp' ? cpp() :
                            language === 'java' ? java() :
                            null
                        ]}
                        value={code}
                        onChange={(value) => setCode(value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Problem;
