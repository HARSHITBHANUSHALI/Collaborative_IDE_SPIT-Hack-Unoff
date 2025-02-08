import { Editor } from '@monaco-editor/react';
import { useRef, useState } from 'react';

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'json', name: 'JSON' },
];

export function MonacoEditorWrapper({ onMount }) {
  const monacoRef = useRef(null);
  const [language, setLanguage] = useState('javascript');

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center p-2 bg-gray-800">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <Editor
        height="calc(100vh - 3rem)"
        width="100%"
        language={language}
        defaultValue={`// Start coding in ${language}...`}
        onMount={(editor, monaco) => {
          monacoRef.current = monaco;
          if (onMount) onMount(editor);
        }}
        loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          fontSize: 14,
          scrollBeyondLastLine: false,
          roundedSelection: false,
          padding: { top: 10 },
        }}
        theme="vs-dark"
      />
    </div>
  );
}