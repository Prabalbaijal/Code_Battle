// components/CodeEditor.js
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import '..//..//..//src/index.css'

const cppKeywords = [
    { label: 'int', type: 'keyword' },
    { label: 'float', type: 'keyword' },
    { label: 'double', type: 'keyword' },
    { label: 'char', type: 'keyword' },
    { label: 'string', type: 'keyword' },
    { label: 'for', type: 'keyword', apply: 'for (int i = 0; i < ; i++) {\n\n}' },
    { label: 'while', type: 'keyword', apply: 'while () {\n\n}' },
    { label: 'if', type: 'keyword', apply: 'if () {\n\n}' },
    { label: 'else', type: 'keyword', apply: 'else {\n\n}' },
    { label: 'else if', type: 'keyword', apply: 'else if () {\n\n}' },
    { label: 'cout', type: 'function', apply: 'std::cout << ' },
    { label: 'cin', type: 'function', apply: 'std::cin >> ' },
    { label: 'return', type: 'keyword' },
    { label: 'void', type: 'keyword' },
    { label: 'main', type: 'function', apply: 'int main() {\n\nreturn 0;\n}' }
    // Add more keywords and structures as needed
];

// Custom autocompletion function for C++
function cppAutocomplete(context) {
    let word = context.matchBefore(/\w*/);
    if (word.from === word.to && !context.explicit) return null;

    return {
        from: word.from,
        options: cppKeywords.map(keyword => ({
            label: keyword.label,
            type: keyword.type,
            apply: keyword.apply || keyword.label
        }))
    };
}

const CodeEditor = ({ code, setCode, language, darkMode }) => (
    <CodeMirror
        value={code}
        extensions={[
            language === 'javascript' ? javascript() : 
            language === 'python' ? python() : 
            language === 'cpp' ? [cpp(), autocompletion({ override: [cppAutocomplete] })] : 
            java(),
            autocompletion() // Enable autocompletion
        ]}
        onChange={(value) => setCode(value)}
        theme={darkMode ? 'dark' : 'light'}
        className="flex-1 mb-4 overflow-y-auto border rounded custom-codemirror"
        height="100%"
    />
);

export default CodeEditor;
