// components/ProblemDescription.js
import React from 'react';

const ProblemDescription = ({ question, darkMode }) => (
    <div className={`w-full lg:w-1/3 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-lg flex flex-col h-[90vh]`}>
        {question ? (
            <>
                <div className="flex-1 mb-6">
                    <h2 className="mb-4 text-2xl font-bold">{question.title}</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {question.description}
                    </p>
                    <br/>
                    <p>
                        <strong>Input Format:</strong><br/>
                        {question.inputFormat}
                    </p>
                    <br/>
                    <p>
                        <strong>Output Format:</strong><br/>
                        {question.outputFormat}
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
);

export default ProblemDescription;
