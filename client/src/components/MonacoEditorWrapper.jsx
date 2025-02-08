import { Editor } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { Play, Upload, RefreshCw, FileCode } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "csharp", name: "C#" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
];

const LANGUAGE_IDS = {
  'python': 71,
  'javascript': 63,
  'java': 62,
  'cpp': 54,
  'c': 50,
  'go': 60,
  'rust': 73
};


export function MonacoEditorWrapper({ onMount }) {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("cpp");
  const [stdin, setStdin] = useState("");

  const TEMPLATES = {
    cpp: `//Start coding in ${language}...`
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(TEMPLATES[language] || `// Start coding in ${language}...`);
    }
  }, [language]);

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const handleReset = () => {
    if (editorRef.current) {
      editorRef.current.setValue(TEMPLATES[language] || `// Start coding in ${language}...`);
    }
  };

  const handleSubmit = async () => {
    if (editorRef.current) {
      const formattedData = {
        code: editorRef.current.getValue(),
        language_id: LANGUAGE_IDS[language],
        stdin: stdin
      };
      try {
        const response = await fetch('http://localhost:4000/compile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData)
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Submission error:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1E1F22] text-white">
      {/* Top Navigation Bar */}
      <div className="grid grid-cols-3 items-center p-3 bg-[#282C34] border-b border-gray-700">
        {/* Language Selector (Left Side) */}
        <div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 bg-[#3B3F45] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons (Center) */}
        <div className="flex justify-center gap-3">
          <button className="flex items-center gap-2 px-4 py-1.5 text-blue-400 rounded-md transition hover:bg-blue-400 hover:bg-opacity-20">
            <Play size={16} />
            Run
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-1.5 text-white rounded-md transition hover:bg-white hover:bg-opacity-20">
            <Upload size={16} />
            Submit
          </button>
        </div>

        {/* Right Side Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleFormatCode}
            className="flex items-center gap-2 px-3 py-1.5 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition"
            title="Format Code"
          >
            <FileCode size={16} />
            Format
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition"
            title="Reset to Default"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="calc(100vh - 3rem)"
        width="100%"
        language={language}
        defaultValue={TEMPLATES[language] || `// Start coding in ${language}...`}
        onMount={(editor, monaco) => {
          monacoRef.current = monaco;
          editorRef.current = editor;
          if (onMount) onMount(editor);
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            Loading editor...
          </div>
        }
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          fontSize: 14,
          scrollBeyondLastLine: false,
          roundedSelection: false,
          padding: { top: 10 },
          formatOnPaste: true,
          formatOnType: true,
        }}
        theme="vs-dark"
      />
    </div>
  );
}

export default MonacoEditorWrapper;
