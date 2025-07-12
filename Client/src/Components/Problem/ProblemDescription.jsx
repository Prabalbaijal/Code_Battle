// components/ProblemDescription.js
import React from 'react';

const ProblemDescription = ({ question, darkMode }) => (
    <div className={`w-full lg:w-1/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-lg flex flex-col h-[90vh]`}>
        {question ? (
            <>
                <div className="flex-1 mb-6">
                    <h2 className="mb-4 text-2xl font-bold">{question.title}</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line`}>
                        {question.description}
                    </p>
                    <br />
                    <p className='whitespace-pre-line'>
                        <strong>Input Format:</strong><br />
                        {question.inputFormat}
                    </p>
                    <br />
                    <p className='whitespace-pre-line'>
                        <strong>Output Format:</strong><br />
                        {question.outputFormat}
                    </p>
                </div>
                <div className="flex-1 mb-6">
                    <h3 className="mb-2 text-xl font-semibold">Examples</h3>
                    {question.examples.map((example, index) => (
                        <div key={index} className="mb-4">
                            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                <div className="mb-4">
                                    <p className="font-semibold">Input:</p>
                                    <pre className="p-2 text-white whitespace-pre-wrap bg-gray-900 rounded">{example.input}</pre>

                                    <p className="mt-2 font-semibold">Output:</p>
                                    <pre className="p-2 text-white whitespace-pre-wrap bg-gray-900 rounded">{example.output}</pre>

                                    <p className="mt-2 font-semibold">Explanation:</p>
                                    <p className="whitespace-pre-line">{example.explanation}</p>
                                </div>

                            </div>

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
);

export default ProblemDescription;
