import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie'; // Import js-cookie
import toast from 'react-hot-toast';

const Problem = () => {
    const [question, setQuestion] = useState(null);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get('http://localhost:9000/api/users/question', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                console.log(response);
                setQuestion(response.data);
                // Set initial code template based on the selected language
                handleChange({ target: { value: language } }); // Set initial code
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchQuestion();
    }, []);

    const handleChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);

        const templates = {
            javascript: `class Solution {
                main() {
                    // Write your code here
                }
            };`,
            python: `class Solution:
                def main(self):
                    # Write your code here`,
            cpp: `#include <iostream>
            using namespace std;

            class Solution {
            public:
                void main() {
                    // Write your code here
                }
            };`,
            java: `public class Solution {
                public static void main(String[] args) {
                    // Write your code here
                }
            }`
        };

        setCode(templates[selectedLanguage] || '// Write your code here');
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const runCode = async () => {
        const loadingToastId = toast.loading("Judging your code...");
        const submissionData = {
            source_code: code,
            language_id: getLanguageId(language),
            testCases: question.testCases
        };
    
        try {
            const response = await axios.post('http://localhost:9000/api/users/submit', submissionData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Judge0 response:', response.data);
            toast.dismiss(loadingToastId);
            if(response.data.allPassed==false && response.data.results[0].status.description=='Compilation Error')
                toast.error("Compilation Error")
            else if(response.data.allPassed==true) toast.success("Accepted");
            else if(response.data.allPassed==false) toast.error("Wrong answer!! Try Again.")
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error("Compilation or runtime error!!")
            console.error('Error running code:', error);
        }
    };

    const getLanguageId = (language) => {
        switch (language) {
            case 'javascript':
                return 63; // Example language ID for JavaScript
            case 'python':
                return 71; // Example language ID for Python
            case 'cpp':
                return 54; // Example language ID for C++
            case 'java':
                return 62; // Example language ID for Java
            default:
                return 63; // Default to JavaScript
        }
    };

    return (
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen flex flex-col`}>
            {/* Navbar */}
            <nav className={`sticky top-0 flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b-2 border-gray-300 shadow-md`}>
                <div className="text-lg font-bold">Code Battle</div>
                <button
                    onClick={toggleDarkMode}
                    className={`px-4 py-2 rounded focus:outline-none transition duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </nav>

            <div className="flex flex-col w-full h-screen overflow-hidden lg:flex-row">
                {/* Left Sidebar: Problem Description */}
                <div className={`w-full lg:w-1/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-lg flex flex-col`}>
                    {question ? (
                        <>
                            <div className="flex-1 mb-6">
                                <h2 className="mb-4 text-2xl font-bold">{question.title}</h2>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                    {question.description}
                                </p>
                            </div>
                            <div className="flex-1 mb-6">
                                <h3 className="mb-2 text-xl font-semibold">Examples</h3>
                                {question.examples.map((example, index) => (
                                    <div key={index} className="mb-4">
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                            <strong>Input:</strong> <code>{example.input}</code><br />
                                            <strong>Output:</strong> <code>{example.output}</code><br />
                                            <strong>Explanation:</strong> {example.explanation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-1 mb-6">
                                <h3 className="mb-2 text-xl font-semibold">Constraints</h3>
                                <ul className="list-disc list-inside">
                                    {question.constraints.map((constraint, index) => (
                                        <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                            {constraint}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p>Loading question...</p>
                    )}
                </div>

                {/* Right Side: Code Editor */}
                <div className={`w-full lg:w-2/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg flex flex-col`}>
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

                    <div className={`border rounded-lg shadow-xl mb-6 ${darkMode ? 'border-gray-700' : 'border-purple-200'} overflow-hidden`}>
                        <CodeMirror
                            height="600px"
                            className="overflow-hidden rounded-lg"
                            theme={darkMode ? 'dark' : 'light'}
                            extensions={[
                                language === 'javascript' ? javascript() :
                                language === 'python' ? python() :
                                language === 'cpp' ? cpp() :
                                language === 'java' ? java() :
                                null
                            ]}
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                styleActiveLine: true,
                                lineNumbers: true,
                                lineWrapping: true,
                                readOnly: false,
                            }}
                        />
                    </div>

                    {/* Buttons for Running and Submitting Code */}
                    <div className="flex justify-end space-x-4">
                        {/* <button  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                            Run
                        </button> */}
                        <button onClick={runCode} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem;
