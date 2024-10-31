// ProblemStatement.jsx
import React, { useState } from 'react';
import { FaComment } from 'react-icons/fa';

const ProblemStatement = ({ darkMode }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            setComments((prevComments) => [newComment.trim(), ...prevComments]);
            setNewComment('');
        }
    };

    return (
        <div className={`w-full lg:w-1/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-lg flex flex-col`}>
            <div className="flex-1 mb-6">
                <h2 className="mb-4 text-2xl font-bold">Problem Description</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    Given an array of integers, return the indices of the two numbers such that they add up to a specific target.
                    You may assume that each input would have exactly one solution, and you may not use the same element twice.
                </p>
            </div>
            <div className="flex-1 mb-6">
                <h3 className="mb-2 text-xl font-semibold">Examples</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-2`}>
                    <strong>Input:</strong> <code>nums = [2, 7, 11, 15], target = 9</code><br />
                    <strong>Output:</strong> <code>[0, 1]</code><br />
                    Because <code>nums[0] + nums[1] = 2 + 7 = 9</code>, we return <code>[0, 1]</code>.
                </p>
            </div>
            <div className="flex-1 mb-6">
                <h3 className="mb-2 text-xl font-semibold">Constraints</h3>
                <ul className="list-disc list-inside">
                    <li className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>The input array has at least two elements.</li>
                    <li className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>You may not use the same element twice.</li>
                    <li className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>Assume inputs are valid and meet the specified conditions.</li>
                </ul>
            </div>

            {/* Discussion Section */}
            <div className="mt-6">
                <h3 className="flex items-center mb-2 text-xl font-semibold">
                    <FaComment className="mr-1" />
                    Discussion ({comments.length})
                </h3>
                <div className="p-4 bg-gray-100 border rounded-lg shadow-md">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-black'} mb-4`}
                    />
                    <button
                        onClick={handleCommentSubmit}
                        className={`w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600`}
                    >
                        Add Comment
                    </button>
                </div>
                <div className="mt-4">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} py-2`}>
                                <p className={`${darkMode ? 'text-green-300' : 'text-gray-700'} leading-relaxed`}>
                                    {comment}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                            No comments yet. Be the first to add a comment!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemStatement;
