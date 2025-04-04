import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from './Navbar.jsx';
import ProblemDescription from './ProblemDescription.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import CodeEditor from './CodeEditor.jsx';
import { useSelector } from 'react-redux';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Problem = () => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [isContestEndedModalOpen, setIsContestEndedModalOpen] = useState(false);
    const [contestEndMessage, setContestEndMessage] = useState('');
    const [messageColor, setMessageColor] = useState('text-gray-700'); // Default
    const [quitConfirm, setQuitConfirm] = useState(false); // Quit confirmation modal

    const { socket } = useSelector((store) => store.socket);
    const { loggedinUser } = useSelector((store) => store.user);
    const location = useLocation();
    const navigate = useNavigate();
    const { roomName, endTime, problem } = location.state || {};

    if (!roomName || !problem) return <Navigate to="/match" replace />;

    useEffect(() => {
        if (!socket) return;

        const handleContestEnd = (data) => {
            console.log("Contest Ended event received:", data.winner);

            if (data.winner === loggedinUser.username) {
                setContestEndMessage("🎉 Congrats! You won the contest!");
                setMessageColor("text-green-600 font-bold");
            } else {
                setContestEndMessage(`🔥 ${data.winner} won the contest!`);
                setMessageColor("text-red-600 font-bold");
            }

            setIsContestEndedModalOpen(true);
        };

        socket.on('contestEnded', handleContestEnd);

        return () => {
            socket.off('contestEnded', handleContestEnd);
        };
    }, [roomName, socket]);

    const handleChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        const templates = {
            javascript: "class Solution {\n\tmain() {\n\t\t// Your code here\n\t}\n}",
            python: "class Solution:\n\tdef main(self):\n\t\t# Your code here",
            cpp: "#include <bits/stdc++.h>\nusing namespace std;\nusing ll=long long;\nint main() {\n\t// Your code here\n\n\treturn 0;\n}",
            java: "import java.util.*;\npublic class Solution {\n\tpublic static void main(String[] args) {\n\t\t// Your code here\n\t}\n}"
        };
        setCode(templates[selectedLanguage]);
    };

    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

    const runCode = async () => {
        const loadingToastId = toast.loading("Judging your code...");
        const submissionData = {
            source_code: code,
            language_id: getLanguageId(language),
            testCases: problem?.testCases,
            executionTimes: problem?.executionTimes
        };

        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(`${BACKEND_URL}/api/users/submit`, submissionData, {
                headers: { 'Content-Type': 'application/json' },
            });
            toast.dismiss(loadingToastId);

            if (response.data.results[0].status.description === 'Accepted') {
                if (response.data.allPassed) {
                    toast.success("Accepted");
                    socket.emit('solveProblem', { roomName, userName: loggedinUser.username });
                } else {
                    toast.error("Wrong answer!! Try Again.");
                }
            } else {
                toast.error(response.data.results[0].compile_output);
                toast.error(response.data.results[0].status.description);
            }
        } catch (error) {
            console.log(error)
            toast.dismiss(loadingToastId);
            toast.error("Compilation error!!");
        }
    };

    const quitContest = () => {
        socket.emit("leaveContest", { roomName, userName: loggedinUser.username });
        navigate('/profile');
    };

    const getLanguageId = (language) => {
        switch (language) {
            case 'javascript': return 63;
            case 'python': return 71;
            case 'cpp': return 52;
            case 'java': return 62;
            default: return 63;
        }
    };

    return (
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen flex flex-col`}>
            
            {/* Contest Ended Modal */}
            {isContestEndedModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                        <h2 className={`mb-4 text-xl ${messageColor}`}>{contestEndMessage}</h2>
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Quit Confirmation Modal */}
            {quitConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-lg font-bold text-red-600">
                            ⚠️ Your opponent will win if you quit. Do you want to quit?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={quitContest}
                                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                            >
                                Yes, Quit
                            </button>
                            <button
                                onClick={() => setQuitConfirm(false)}
                                className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                No, Stay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} endTime={endTime} />
            <div className="flex flex-col w-full h-[90vh] overflow-hidden lg:flex-row">
                <ProblemDescription question={problem} darkMode={darkMode} />
                <div className={`w-full lg:w-2/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg flex flex-col h-[90vh]`}>
                    <LanguageSelector language={language} handleChange={handleChange} darkMode={darkMode} />
                    <CodeEditor code={code} setCode={setCode} language={language} darkMode={darkMode} />
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setQuitConfirm(true)}
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            Quit
                        </button>
                        <button
                            onClick={runCode}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem;
