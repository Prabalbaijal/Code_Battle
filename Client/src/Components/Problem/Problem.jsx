// Problem.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from './Navbar.jsx';
import ProblemDescription from './ProblemDescription.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import CodeEditor from './CodeEditor.jsx';

const Problem = () => {
    const [question, setQuestion] = useState(null);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get('http://localhost:9000/api/users/question', {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });
                setQuestion(response.data);
                handleChange({ target: { value: language } });
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
              /* Your code here */ 
              }
       };`,
            python: `class Solution: def main(self): # Your code here`,
            cpp: `#include <iostream> class Solution { public: void main() { /* Your code here */ } };`,
            java: `public class Solution { public static void main(String[] args) { /* Your code here */ } }`
        };
        setCode(templates[selectedLanguage]);
    };

    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

    const runCode = async () => {
        const loadingToastId = toast.loading("Judging your code...");
        const submissionData = {
            source_code: code,
            language_id: getLanguageId(language),
            testCases: question.testCases,
        };

        try {
            const response = await axios.post('http://localhost:9000/api/users/submit', submissionData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response)
            toast.dismiss(loadingToastId);
            console.log()
            if (response.data.results[0].status.description === 'Accepted') {
                response.data.allPassed ? toast.success("Accepted") : toast.error("Wrong answer!! Try Again.");
            } else {
                toast.error(response.data.results[0].compile_output);
                toast.error(response.data.results[0].status.description);
            }
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error("Compilation error!!");
        }
    };

    const getLanguageId = (language) => {
        switch (language) {
            case 'javascript': return 63;
            case 'python': return 71;
            case 'cpp': return 54;
            case 'java': return 62;
            default: return 63;
        }
    };

    return (
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen flex flex-col`}>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <div className="flex flex-col w-full h-screen overflow-hidden lg:flex-row">
                <ProblemDescription question={question} darkMode={darkMode} />
                <div className={`w-full lg:w-2/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg flex flex-col h-full`}>
                    <LanguageSelector language={language} handleChange={handleChange} darkMode={darkMode} />
                    <CodeEditor code={code} setCode={setCode} language={language} darkMode={darkMode} />
                    <div className="flex justify-end space-x-4">
                        <button onClick={runCode} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem;
