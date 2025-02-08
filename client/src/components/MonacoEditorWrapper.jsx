import { useRef, useState, useEffect, useCallback } from "react";
import { Editor } from "@monaco-editor/react";
import { Play, Upload, RefreshCw, FileCode } from "lucide-react";
import { debounce } from 'lodash';
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
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  c: 50,
  go: 60,
  rust: 73,
};

export function MonacoEditorWrapper({ onMount }) {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("cpp");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [lastCode, setLastCode] = useState("");
  const [tabOverlay, setTabOverlay] = useState(null);

  const TEMPLATES = {
    cpp: `// Start coding in ${language}...`,
  };

  // Debounced function to send code changes to backend
  const sendCodeChanges = useCallback(
    debounce(async (code, position, lang) => {
      try {
        const response = await fetch("http://10.10.60.188:8000/api/autocomplete/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            cursor_line: position,
            language: lang
          }),
        });
        const data = await response.json();
        
        // Update tab overlay if provided in response
        if (data.tabCompletion) {
          setTabOverlay(data.tabCompletion);
        }
        
        setLastCode(code);
      } catch (error) {
        console.error("Error sending code changes:", error);
      }
    }, 500),
    [lastCode]
  );

  useEffect(() => {
    if (editorRef.current) {
      // Set initial template
      editorRef.current.setValue(TEMPLATES[language] || `// Start coding in ${language}...`);
      
      // Add change listener
      const disposable = editorRef.current.onDidChangeModelContent((event) => {
        const newCode = editorRef.current.getValue();
        if (newCode !== lastCode) {
          sendCodeChanges(
            newCode,
            editorRef.current.getPosition(),
            language
          );
        }
      });

      // Add cursor position listener
      const cursorDisposable = editorRef.current.onDidChangeCursorPosition((event) => {
        setCursorPosition(event.position);
      });

      // Add tab key listener
      editorRef.current.addCommand(
        monacoRef.current.KeyCode.Tab,
        () => {
          if (tabOverlay) {
            editorRef.current.trigger('keyboard', 'type', { text: tabOverlay });
            setTabOverlay(null);
          }
        }
      );

      return () => {
        disposable.dispose();
        cursorDisposable.dispose();
      };
    }
  }, [language, lastCode, tabOverlay]);

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const handleReset = () => {
    if (editorRef.current) {
      const defaultValue = TEMPLATES[language] || `// Start coding in ${language}...`;
      editorRef.current.setValue(defaultValue);
      setLastCode(defaultValue);
    }
  };

  const handleSubmit = async () => {
    if (editorRef.current) {
      const formattedData = {
        code: editorRef.current.getValue(),
        language_id: LANGUAGE_IDS[language],
        stdin: stdin,
      };
      try {
        const response = await fetch("http://localhost:4000/compile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });
        const result = await response.json();
        setOutput(result.output || "No output received");
      } catch (error) {
        console.error("Submission error:", error);
        setOutput("Error occurred while executing the code.");
      }
    }
  };

  // Create decorations for tab overlay
  useEffect(() => {
    if (editorRef.current && tabOverlay) {
      const decorations = [{
        range: new monacoRef.current.Range(
          cursorPosition.lineNumber,
          cursorPosition.column,
          cursorPosition.lineNumber,
          cursorPosition.column + tabOverlay.length
        ),
        options: {
          inlineClassName: 'tab-overlay',
          afterContentClassName: 'tab-overlay-text',
          after: {
            content: tabOverlay,
            opacity: '0.6'
          }
        }
      }];
      
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [tabOverlay, cursorPosition]);

  return (
    <div className="flex flex-col h-screen bg-[#1E1F22] text-white">
      {/* Rest of the JSX remains the same */}
      <div className="grid grid-cols-3 items-center p-3 bg-[#282C34] border-b border-gray-700">
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

        <div className="flex justify-center gap-3">
          <button className="flex items-center gap-2 px-4 py-1.5 text-blue-400 rounded-md transition hover:bg-blue-400 hover:bg-opacity-20">
            <Play size={16} />
            Run
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-1.5 text-white rounded-md transition hover:bg-white hover:bg-opacity-20"
          >
            <Upload size={16} />
            Submit
          </button>
        </div>

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

      <Editor
        height="60vh"
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

      <div className="flex justify-center space-x-6 bg-[#282C34] p-2">
        <button
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "input" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("input")}
        >
          Input
        </button>
        <button
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "output" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("output")}
        >
          Output
        </button>
      </div>

      <div className="p-4 bg-[#1E1F22] h-40 overflow-auto border-t border-gray-700">
        {activeTab === "input" && (
          <textarea
            className="w-full h-full p-2 bg-gray-800 text-white rounded-md resize-none"
            placeholder="Enter input..."
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />
        )}
        {activeTab === "output" && (
          <pre className="w-full h-full p-2 bg-gray-800 text-green-400 rounded-md overflow-auto">
            {output || "No output yet."}
          </pre>
        )}
      </div>
    </div>
  );
}

export default MonacoEditorWrapper;