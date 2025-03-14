// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Navbar from './Navbar.jsx';
// import ProblemDescription from './ProblemDescription.jsx';
// import LanguageSelector from './LanguageSelector.jsx';
// import CodeEditor from './CodeEditor.jsx';
// import { useSelector } from 'react-redux';
// import { useLocation, Navigate, useNavigate } from 'react-router-dom';

// const Problem = () => {
//     const [question, setQuestion] = useState(null);
//     const [language, setLanguage] = useState('javascript');
//     const [code, setCode] = useState('');
//     const [darkMode, setDarkMode] = useState(false);
//     const [contestStarted, setContestStarted] = useState(false);

//     const { socket } = useSelector((store) => store.socket);
//     const { loggedinUser } = useSelector((store) => store.user);
//     const location = useLocation();
//     const { roomName, endTime } = location.state || {};
//     const navigate = useNavigate()
//     const [isContestEndedModalOpen, setIsContestEndedModalOpen] = useState(false);
//     const [contestEndMessage, setContestEndMessage] = useState('');


//     if (!roomName) return <Navigate to="/match" replace />;

//     useEffect(() => {
//         if (!socket) return;
//         const fetchQuestion = async () => {
//             try {
//                 const response = await axios.get('http://localhost:9000/api/users/question', {
//                     headers: { 'Content-Type': 'application/json' },
//                     withCredentials: true,
//                 });
//                 setQuestion(response.data);
//                 handleChange({ target: { value: language } });
//             } catch (error) {
//                 console.error('Error fetching question:', error);
//             }
//         };
//         fetchQuestion();

//         const handleContestEnd = (data) => {
//             console.log("Contest Ended event received:", data);
//             setContestEndMessage(data.message);
//             setIsContestEndedModalOpen(true);
//         };

//         socket.on('contestEnded', handleContestEnd);

//         return () => {
//             socket.off('contestEnded');
//         };
//     }, [roomName, socket]);

//     useEffect(() => {
//         if (!socket) return;
//         const handleBeforeUnload = (event) => {
//             const confirmationMessage = "Are you sure? Your opponent will win if you leave!";
//             event.returnValue = confirmationMessage;
//             return confirmationMessage;
//         };

//         const handleUnload = () => {
//             socket.emit("leaveContest", { roomName, userName: loggedinUser.username });
//             navigate('/profile')
//         };

//         window.addEventListener("beforeunload", handleBeforeUnload);
//         window.addEventListener("unload", handleUnload);

//         return () => {
//             window.removeEventListener("beforeunload", handleBeforeUnload);
//             window.removeEventListener("unload", handleUnload);
//         };
//     }, [socket, roomName, loggedinUser.username]);

//     const handleChange = (event) => {
//         const selectedLanguage = event.target.value;
//         setLanguage(selectedLanguage);
//         const templates = {
//             javascript: `class Solution { main() { /* Your code here */ } };`,
//             python: `class Solution: def main(self): # Your code here`,
//             cpp: `#include <iostream> class Solution { public: void main() { /* Your code here */ } };`,
//             java: `public class Solution { public static void main(String[] args) { /* Your code here */ } }`,
//         };
//         setCode(templates[selectedLanguage]);
//     };

//     const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

//     const runCode = async () => {
//         const loadingToastId = toast.loading("Judging your code...");
//         const submissionData = {
//             source_code: code,
//             language_id: getLanguageId(language),
//             testCases: question?.testCases,
//         };

//         try {
//             const response = await axios.post('http://localhost:9000/api/users/submit', submissionData, {
//                 headers: { 'Content-Type': 'application/json' },
//             });
//             toast.dismiss(loadingToastId);

//             if (response.data.results[0].status.description === 'Accepted') {
//                 if (response.data.allPassed) {
//                     toast.success("Accepted");
//                     socket.emit('solveProblem', { roomName, userName: loggedinUser.username });
//                 } else {
//                     toast.error("Wrong answer!! Try Again.");
//                 }
//             } else {
//                 toast.error(response.data.results[0].compile_output);
//                 toast.error(response.data.results[0].status.description);
//             }
//         } catch (error) {
//             toast.dismiss(loadingToastId);
//             toast.error("Compilation error!!");
//         }
//     };

//     const getLanguageId = (language) => {
//         switch (language) {
//             case 'javascript': return 63;
//             case 'python': return 71;
//             case 'cpp': return 54;
//             case 'java': return 62;
//             default: return 63;
//         }
//     };

//     return (
//         <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen flex flex-col`}>
//             {isContestEndedModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="p-6 text-center bg-white rounded-lg shadow-lg">
//                         <h2 className="mb-4 text-xl font-semibold">Contest Ended</h2>
//                         <p className="text-gray-600">{contestEndMessage}</p>
//                         <button
//                             onClick={() => navigate('/profile')}
//                             className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
//                         >
//                             OK
//                         </button>
//                     </div>
//                 </div>
//             )}
//             <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} endTime={endTime} />
//             <div className="flex flex-col w-full h-screen overflow-hidden lg:flex-row">
//                 <ProblemDescription question={question} darkMode={darkMode} />
//                 <div className={`w-full lg:w-2/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg flex flex-col h-full`}>
//                     <LanguageSelector language={language} handleChange={handleChange} darkMode={darkMode} />
//                     <CodeEditor code={code} setCode={setCode} language={language} darkMode={darkMode} />
                
//                     <div className="fixed bottom-0 left-0 w-full lg:w-3/3 bg-gray-900 p-4 flex justify-end border-t border-gray-700">
//                         <button onClick={runCode} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
//                             Submit
//                         </button>
//                     </div>


//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Problem;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from './Navbar.jsx';
import ProblemDescription from './ProblemDescription.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import CodeEditor from './CodeEditor.jsx';
import { useSelector } from 'react-redux';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

const Problem = () => {
    const [question, setQuestion] = useState(null);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [isContestEndedModalOpen, setIsContestEndedModalOpen] = useState(false);
    const [contestEndMessage, setContestEndMessage] = useState('');
    const [messageColor, setMessageColor] = useState('text-gray-700'); // Default

    const { socket } = useSelector((store) => store.socket);
    const { loggedinUser } = useSelector((store) => store.user);
    const location = useLocation();
    const { roomName, endTime } = location.state || {};
    const navigate = useNavigate();

    if (!roomName) return <Navigate to="/match" replace />;

    useEffect(() => {
        if (!socket) return;

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

        const handleContestEnd = (data) => {
            console.log("Contest Ended event received:", data);

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
    }, [socket, roomName, loggedinUser.username]);

    useEffect(() => {
        if (!socket) return;

        const handleBeforeUnload = (event) => {
            const confirmationMessage = "Are you sure? Your opponent will win if you leave!";
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        const handleUnload = () => {
            socket.emit("leaveContest", { roomName, userName: loggedinUser.username });
            navigate('/profile');
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("unload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("unload", handleUnload);
        };
    }, [socket, roomName, loggedinUser.username]);

    const handleChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        const templates = {
            javascript: `class Solution {\n\tmain() {\n\t\t/* Your code here */\n\t}\n}`,  
            python: `class Solution:\n\tdef main(self):\n\t\t# Your code here`,  
            cpp: `#include <iostream>\nclass Solution {\n\tpublic:\n\t\int main() {\n\t\t\t/* Your code here */\n\n\t\treturn 0;\n\t\t}\n};`,  
            java: `public class Solution {\n\tpublic static void main(String[] args) {\n\t\t/* Your code here */\n\t}\n}`, 
        };
        setCode(templates[selectedLanguage]);
    };

    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

    const runCode = async () => {
        const loadingToastId = toast.loading("Judging your code...");
        const submissionData = {
            source_code: code,
            language_id: getLanguageId(language),
            testCases: question?.testCases,
        };

        try {
            const response = await axios.post('http://localhost:9000/api/users/submit', submissionData, {
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
            {/* Contest Ended Modal (ALWAYS ON TOP) */}
            {isContestEndedModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
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

            {/* Navbar and Main UI */}
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} endTime={endTime} />
            <div className="flex flex-col w-full h-screen overflow-hidden lg:flex-row">
                <ProblemDescription question={question} darkMode={darkMode} />
                <div className={`w-full lg:w-2/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg flex flex-col h-full`}>
                    <LanguageSelector language={language} handleChange={handleChange} darkMode={darkMode} />
                    <CodeEditor code={code} setCode={setCode} language={language} darkMode={darkMode} />

                    <div className="fixed bottom-0 left-0 w-full lg:w-3/3 bg-gray-900 p-4 flex justify-end border-t border-gray-700">
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
