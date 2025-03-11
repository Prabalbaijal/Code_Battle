
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { autocompletion } from '@codemirror/autocomplete';
import '../../../src/index.css';

const keywords = {
    cpp: [
        { label: 'int', type: 'keyword' },
        { label: 'float', type: 'keyword' },
        { label: 'double', type: 'keyword' },
        { label: 'char', type: 'keyword' },
        { label: 'string', type: 'keyword' },
        { label: 'for', type: 'keyword', apply: 'for (int i = 0; i < ; i++) {\n\n}' },
        { label: 'while', type: 'keyword', apply: 'while () {\n\n}' },
        { label: 'do', type: 'keyword', apply: 'do {\n\n} while ();' },
        { label: 'switch', type: 'keyword', apply: 'switch () {\n  case :\n    break;\n  default:\n    break;\n}' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' },
        { label: 'cout', type: 'function', apply: 'std::cout << ' },
        { label: 'cin', type: 'function', apply: 'std::cin >> ' },

    ],
    java: [
        { label: 'public', type: 'keyword' },
        { label: 'class', type: 'keyword' },
        { label: 'void', type: 'keyword' },
        { label: 'static', type: 'keyword' },
        { label: 'System.out.println', type: 'function', apply: 'System.out.println();' },
        { label: 'Scanner', type: 'class', apply: 'Scanner sc = new Scanner(System.in);' },
        { label: 'if', type: 'keyword', apply: 'if () {\n\n}' },
        { label: 'else', type: 'keyword', apply: 'else {\n\n}' },
        { label: 'for', type: 'keyword', apply: 'for (int i = 0; i < ; i++) {\n\n}' },
        { label: 'while', type: 'keyword', apply: 'while () {\n\n}' },
        { label: 'do', type: 'keyword', apply: 'do {\n\n} while ();' },
        { label: 'switch', type: 'keyword', apply: 'switch () {\n  case :\n    break;\n  default:\n    break;\n}' },
        { label: 'try', type: 'keyword', apply: 'try {\n\n} catch (Exception e) {\n\n}' },
        { label: 'catch', type: 'keyword', apply: 'catch (Exception e) {\n\n}' },
        { label: 'finally', type: 'keyword', apply: 'finally {\n\n}' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' }
    ],
    javascript: [
        { label: 'function', type: 'keyword' },
        { label: 'const', type: 'keyword' },
        { label: 'let', type: 'keyword' },
        { label: 'var', type: 'keyword' },
        { label: 'console.log', type: 'function', apply: 'console.log();' },
        { label: 'if', type: 'keyword', apply: 'if () {\n\n}' },
        { label: 'else', type: 'keyword', apply: 'else {\n\n}' },
        { label: 'for', type: 'keyword', apply: 'for (let i = 0; i < ; i++) {\n\n}' },
        { label: 'while', type: 'keyword', apply: 'while () {\n\n}' },
        { label: 'try', type: 'keyword', apply: 'try {\n\n} catch (error) {\n\n}' },
        { label: 'catch', type: 'keyword', apply: 'catch (error) {\n\n}' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' }
    ],
    python: [
        { label: 'def', type: 'keyword' },
        { label: 'import', type: 'keyword' },
        { label: 'print', type: 'function', apply: 'print()' },
        { label: 'if', type: 'keyword', apply: 'if :\n\n' },
        { label: 'else', type: 'keyword', apply: 'else:\n\n' },
        { label: 'for', type: 'keyword', apply: 'for i in range():\n\n' },
        { label: 'while', type: 'keyword', apply: 'while :\n\n' },
        { label: 'try', type: 'keyword', apply: 'try:\n\nexcept Exception as e:\n\n' },
        { label: 'except', type: 'keyword', apply: 'except Exception as e:\n\n' },
        { label: 'return', type: 'keyword' },
        { label: 'break', type: 'keyword' },
        { label: 'continue', type: 'keyword' },

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

const CodeEditor = ({ code, setCode, language, darkMode }) => (
    <CodeMirror
        value={code || defaultCode[language] || ""}
        extensions={[
            language === 'javascript' ? javascript() :
                language === 'python' ? python() :
                    language === 'cpp' ? [cpp(), autocompletion({ override: [autocompleteProvider('cpp')] })] :
                        [java(), autocompletion({ override: [autocompleteProvider('java')] })],
            autocompletion()
        ]}
        onChange={(value) => setCode(value)}
        theme={darkMode ? 'dark' : 'light'}
        className="flex-1 mb-4 overflow-y-auto border rounded custom-codemirror"
        height="100%"
    />
);

export default CodeEditor;