
// import React, { useState } from 'react';
// import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python';
// import { cpp } from '@codemirror/lang-cpp';
// import { java } from '@codemirror/lang-java';
// import { FaComment } from 'react-icons/fa';
// import Timer from '../Timer/Timer';

// const Problem = () => {
//     const [language, setLanguage] = useState('javascript');
//     const [code, setCode] = useState(`
//     class Solution {
//         main() {
//             // Write your code here
//         }
//     };
// `);

//     const [darkMode, setDarkMode] = useState(false);
//     const [comments, setComments] = useState([]);
//     const [newComment, setNewComment] = useState('');

//     const languageOptions = [
//         { value: 'javascript', label: 'JavaScript' },
//         { value: 'python', label: 'Python' },
//         { value: 'cpp', label: 'C++' },
//         { value: 'java', label: 'Java' },
//     ];

//     const handleChange = (event) => {
//         const selectedLanguage = event.target.value;
//         setLanguage(selectedLanguage);

//         const templates = {
//             javascript: `class Solution {
//         main() {
//             // Write your code here
//         }
//     };`,
//             python: `class Solution:
//         def main(self):
//             # Write your code here
//    `,
//             cpp: `#include <iostream>
//     using namespace std;
    
//     class Solution {
//     public:
//         void main() {
//             // Write your code here
//         }
//     };`,
//             java: `public class Solution {
//         public static void main(String[] args) {
//             // Write your code here
//         }
//     }`
//         };

//         // Set default code for JavaScript
//         if (selectedLanguage === 'javascript') {
//             setCode(templates.javascript);
//         } else {
//             setCode(templates[selectedLanguage] || '// Write your code here');
//         }
//     };

//     const toggleDarkMode = () => {
//         setDarkMode((prevMode) => !prevMode);
//     };

//     const handleCommentSubmit = () => {
//         if (newComment.trim()) {
//             setComments((prevComments) => [newComment.trim(), ...prevComments]);
//             setNewComment('');
//         }
//     };

//     return (
//         <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen flex flex-col`}>
//             {/* Navbar */}
//             <nav className={`sticky top-0 flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b-2 border-gray-300 shadow-md`}>
//                 <div className="text-lg font-bold">Code Battle</div>
//                 <div className="flex items-center">
//                     <span className="mr-2">Timer:</span>
//                     <Timer /> {/* Timer component here */}
//                 </div>
//                 <button
//                     onClick={toggleDarkMode}
//                     className={`px-4 py-2 rounded focus:outline-none transition duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
//                 >
//                     {darkMode ? 'Light Mode' : 'Dark Mode'}
//                 </button>
//             </nav>


//             <div className="flex flex-col w-full h-screen overflow-hidden lg:flex-row">
//                 {/* Left Sidebar: Problem Description */}
//                 <div className={`w-full lg:w-1/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-lg flex flex-col`}>
//                     <div className="flex-1 mb-6">
//                         <h2 className="mb-4 text-2xl font-bold">Problem Description</h2>
//                         <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
//                             Given an array of integers, return the indices of the two numbers such that they add up to a specific target.
//                             You may assume that each input would have exactly one solution, and you may not use the same element twice.
//                         </p>
//                     </div>
//                     <div className="flex-1 mb-6">
//                         <h3 className="mb-2 text-xl font-semibold">Examples</h3>
//                         <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-2`}>
//                             <strong>Input:</strong> <code>nums = [2, 7, 11, 15], target = 9</code><br />
//                             <strong>Output:</strong> <code>[0, 1]</code><br />
//                             Because <code>nums[0] + nums[1] = 2 + 7 = 9</code>, we return <code>[0, 1]</code>.
//                         </p>
//                     </div>
//                     <div className="flex-1 mb-6">
//                         <h3 className="mb-2 text-xl font-semibold">Constraints</h3>
//                         <ul className="list-disc list-inside">
//                             <li className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>The input array has at least two elements.</li>
//                             <li className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>You may not use the same element twice.</li>
//                             <li className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>Assume inputs are valid and meet the specified conditions.</li>
//                         </ul>
//                     </div>

//                     {/* Discussion Section */}
//                     <div className="mt-6">
//                         <h3 className="flex items-center mb-2 text-xl font-semibold">
//                             <FaComment className="mr-1" />
//                             Discussion ({comments.length})
//                         </h3>
//                         <div className="p-4 bg-gray-100 border rounded-lg shadow-md">
//                             <textarea
//                                 value={newComment}
//                                 onChange={(e) => setNewComment(e.target.value)}
//                                 placeholder="Add a comment..."
//                                 className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-black'} mb-4`}
//                             />
//                             <button
//                                 onClick={handleCommentSubmit}
//                                 className={`w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600`}
//                             >
//                                 Add Comment
//                             </button>
//                         </div>
//                         <div className="mt-4">
//                             {comments.length > 0 ? (
//                                 comments.map((comment, index) => (
//                                     <div key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-2`}>
//                                         <p className={`${darkMode ? 'text-green-300' : 'text-gray-700'} leading-relaxed`}>
//                                             {comment}
//                                         </p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
//                                     No comments yet. Be the first to add a comment!
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side: Code Editor */}
//                 <div className={`w-full lg:w-2/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg flex flex-col`}>
//                     <div className="flex items-center mb-4">
//                         <label htmlFor="language-select" className="mr-3 text-lg font-semibold">Select Language:</label>
//                         <select
//                             id="language-select"
//                             value={language}
//                             onChange={handleChange}
//                             className={`w-48 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-black'} border-2 border-black rounded-md p-2`}
//                         >
//                             {languageOptions.map((lang) => (
//                                 <option key={lang.value} value={lang.value}>{lang.label}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className={`border rounded-lg shadow-xl mb-6 ${darkMode ? 'border-gray-700' : 'border-purple-200'} overflow-hidden`}>
//                         <CodeMirror
//                             height="600px" // Increased height of the CodeMirror editor
//                             className="overflow-hidden rounded-lg"
//                             theme={darkMode ? 'dark' : 'light'} // Set appropriate theme based on dark mode
//                             extensions={[
//                                 language === 'javascript' ? javascript() :
//                                     language === 'python' ? python() :
//                                         language === 'cpp' ? cpp() :
//                                             language === 'java' ? java() :
//                                                 null
//                             ]}
//                             value={code}
//                             onChange={(value) => setCode(value)}
//                             options={{
//                                 styleActiveLine: true,
//                                 lineNumbers: true,
//                                 lineWrapping: true,
//                                 readOnly: false,
//                             }}
//                         />
//                     </div>

//                     {/* Buttons for Running and Submitting Code */}
//                     <div className="flex justify-end space-x-4">
//                         <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
//                             Run
//                         </button>
//                         <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
//                             Submit
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Problem;








import React, { useState } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor';
import ProblemStatement from '../ProblemStatement/ProblemStatement';
import Timer from '../Timer/Timer';


const Problem = () => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(`
    class Solution {
        main() {
            // Write your code here
        }
    };
`);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    return (
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen flex flex-col`}>
            {/* Navbar */}
            <nav className={`sticky top-0 flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b-2 border-gray-300 shadow-md`}>
                <div className="text-lg font-bold">Code Battle</div>
                <div className="flex items-center">
                    <span className="mr-2">Timer:</span>
                    <Timer /> {/* Timer component here */}
                </div>
                <button
                    onClick={toggleDarkMode}
                    className={`px-4 py-2 rounded focus:outline-none transition duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </nav>

            <div className="flex flex-col w-full h-screen overflow-hidden lg:flex-row">
                {/* Left Sidebar: Problem Statement */}
                <ProblemStatement darkMode={darkMode} />

                {/* Right Side: Code Editor */}
                <CodeEditor language={language} setLanguage={setLanguage} code={code} setCode={setCode} darkMode={darkMode} />
            </div>
        </div>
    );
};

export default Problem;