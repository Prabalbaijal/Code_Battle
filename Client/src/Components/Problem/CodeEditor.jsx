
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { autocompletion } from '@codemirror/autocomplete';
import '../../../src/index.css';
import { useEffect } from 'react';

const keywords = {
    cpp: [
        { label: '#include<bits/stdc++.h>', type: 'preprocessor', apply: '#include<bits/stdc++.h>\nusing namespace std;\n' },
        { label: 'main', type: 'function', apply: 'int main() {\n    return 0;\n}' },
        { label: 'int', type: 'keyword' },
        { label: 'float', type: 'keyword' },
        { label: 'double', type: 'keyword' },
        { label: 'char', type: 'keyword' },
        { label: 'string', type: 'keyword' },
        { label: 'for', type: 'keyword', apply: 'for (int i = 0; i < ; i++) {\n    \n}' },
        { label: 'while', type: 'keyword', apply: 'while () {\n    \n}' },
        { label: 'do while', type: 'keyword', apply: 'do {\n    \n} while ();' },
        { label: 'switch', type: 'keyword', apply: 'switch () {\n    case :\n        break;\n    default:\n        break;\n}' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' },
        { label: 'cout', type: 'function', apply: 'std::cout << ;' },
        { label: 'cin', type: 'function', apply: 'std::cin >> ;' }
    ],
    java: [
        { label: 'public class', type: 'class', apply: 'public class ClassName {\n    public static void main(String[] args) {\n        \n    }\n}' },
        { label: 'public', type: 'keyword' },
        { label: 'class', type: 'keyword' },
        { label: 'void', type: 'keyword' },
        { label: 'static', type: 'keyword' },
        { label: 'System.out.println', type: 'function', apply: 'System.out.println();' },
        { label: 'Scanner', type: 'class', apply: 'Scanner sc = new Scanner(System.in);' },
        { label: 'for', type: 'keyword', apply: 'for (int i = 0; i < ; i++) {\n    \n}' },
        { label: 'while', type: 'keyword', apply: 'while () {\n    \n}' },
        { label: 'do while', type: 'keyword', apply: 'do {\n    \n} while ();' },
        { label: 'switch', type: 'keyword', apply: 'switch () {\n    case :\n        break;\n    default:\n        break;\n}' },
        { label: 'try-catch', type: 'keyword', apply: 'try {\n    \n} catch (Exception e) {\n    \n}' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' }
    ],
    javascript: [
        { label: 'function', type: 'keyword', apply: 'function functionName() {\n    \n}' },
        { label: 'const', type: 'keyword' },
        { label: 'let', type: 'keyword' },
        { label: 'var', type: 'keyword' },
        { label: 'console.log', type: 'function', apply: 'console.log();' },
        { label: 'for', type: 'keyword', apply: 'for (let i = 0; i < ; i++) {\n    \n}' },
        { label: 'while', type: 'keyword', apply: 'while () {\n    \n}' },
        { label: 'do while', type: 'keyword', apply: 'do {\n    \n} while ();' },
        { label: 'try-catch', type: 'keyword', apply: 'try {\n    \n} catch (error) {\n    \n}' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' }
    ],
    python: [
        { label: 'def', type: 'keyword', apply: 'def function_name():\n    pass' },
        { label: 'import', type: 'keyword', apply: 'import ' },
        { label: 'print', type: 'function', apply: 'print()' },
        { label: 'if', type: 'keyword', apply: 'if condition:\n    \n' },
        { label: 'else', type: 'keyword', apply: 'else:\n    \n' },
        { label: 'for', type: 'keyword', apply: 'for i in range():\n    \n' },
        { label: 'while', type: 'keyword', apply: 'while condition:\n    \n' },
        { label: 'try-except', type: 'keyword', apply: 'try:\n    \nexcept Exception as e:\n    \n' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' }
    ]
};

function autocompleteProvider(language) {
    return (context) => {
        let word = context.matchBefore(/\w*/);
        if (word.from === word.to && !context.explicit) return null;

        return {
            from: word.from,
            options: (keywords[language] || []).map(keyword => ({
                label: keyword.label,
                type: keyword.type,
                apply: keyword.apply || keyword.label
            }))
        };
    };
}

const defaultCode = {
    java: "public class Solution {\n\n  public static void main(String[] args) {\n\n\n  }\n}"
};

const CodeEditor = ({ code, setCode, language, darkMode }) => {
    // Load saved code from localStorage when the component mounts
    useEffect(() => {
        const savedCode = localStorage.getItem(`userCode-${language}`);
        if (savedCode) {
            setCode(savedCode);
        }
    }, [language, setCode]);

    // Save code to localStorage whenever it changes
    const handleCodeChange = (value) => {
        setCode(value);
        localStorage.setItem(`userCode-${language}`, value);
    };

    return (
        <CodeMirror
            value={code || localStorage.getItem(`userCode-${language}`) || defaultCode[language] || ""}
            extensions={[
                language === 'javascript' ? javascript() :
                    language === 'python' ? python() :
                        language === 'cpp' ? [cpp(), autocompletion({ override: [autocompleteProvider('cpp')] })] :
                            [java(), autocompletion({ override: [autocompleteProvider('java')] })],
                autocompletion()
            ]}
            onChange={handleCodeChange}
            theme={darkMode ? 'dark' : 'light'}
            className="flex-1 mb-4 overflow-y-auto border rounded custom-codemirror"
            height="100%"
        />
    );
};

export default CodeEditor;