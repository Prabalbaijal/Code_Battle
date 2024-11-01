import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';

const CodeEditor = ({ language, setLanguage, code, setCode, darkMode }) => {
    const languageOptions = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
    ];

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
                    # Write your code here
            `,
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

    const handleRunCode = () => {
        // Logic to run the code (you can implement this based on your needs)
        console.log('Running code...');
    };

    const handleSubmitCode = () => {
        // Logic to submit the code (implement based on your requirements)
        console.log('Submitting code...');
    };

    return (
        <div className={`w-full lg:w-2/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg flex flex-col`}>
            <div className="flex items-center mb-4">
                <label htmlFor="language-select" className="mr-3 text-lg font-semibold">Select Language:</label>
                <select
                    id="language-select"
                    value={language}
                    onChange={handleChange}
                    className={`w-48 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-black'} border-2 border-black rounded-md p-2`}
                >
                    {languageOptions.map((lang) => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
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
            <div className="flex justify-end space-x-4 mb-4">
                <button 
                    onClick={handleRunCode}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                    Run Code
                </button>
                <button 
                    onClick={handleSubmitCode}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Submit Code
                </button>
            </div>
        </div>
    );
};

export default CodeEditor;
