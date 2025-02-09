import { useRef, useState, useEffect, useCallback } from "react";
import { Editor } from "@monaco-editor/react";
import { Play, Upload, RefreshCw, FileCode, Save, History } from "lucide-react";
import { debounce } from 'lodash';
import axios from "axios";

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

export function MonacoEditorWrapper({ onMount, projectId, fileId }) {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("cpp");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [lastCode, setLastCode] = useState("");
  const [tabOverlay, setTabOverlay] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [commits, setCommits] = useState([]);
  const [showCommits, setShowCommits] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const decorationsRef = useRef([]);

//   const TEMPLATES = {
//     cpp: `// Start coding in ${language}...`,
//   };

const showSuggestion = (suggestionText, position) => {
    if (!editorRef.current || !monacoRef.current) return;

    // Clear previous decorations
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      []
    );

    // Calculate the start position for the suggestion
    // We want it to appear right after the current text on the line
    const model = editorRef.current.getModel();
    const lineContent = model.getLineContent(position.lineNumber);
    const startColumn = lineContent.length + 1;

    // Create new decoration
    const decorations = [{
      range: new monacoRef.current.Range(
        position.lineNumber,
        startColumn,
        position.lineNumber,
        startColumn + suggestionText.length
      ),
      options: {
        after: {
          content: suggestionText,
          inlineClassName: 'suggestion-overlay'
        }
      }
    }];

    // Add the decoration to the editor
    decorationsRef.current = editorRef.current.deltaDecorations(
      [],
      decorations
    );

    // Store the suggestion for later use
    setSuggestion(suggestionText);
  };
  const loadCommitContent = async (commitId) => {
    try {
      if (editorRef.current) {
        const commit = commits.find(c => c._id === commitId);
        if (commit) {
          editorRef.current.setValue(commit.content);
          setLastCode(commit.content);
          setOutput(`Loaded commit from ${new Date(commit.createdAt).toLocaleString()}`);
        }
      }
    } catch (error) {
      console.error("Error loading commit:", error);
      setOutput("Error loading commit: " + error.message);
    }
  };

  const fetchInitialCode = async () => {
    try {
      const response = await axios.get(`/api/commit/getCode/${fileId}`);
      if (response.data && response.data.commits) {
        if (editorRef.current) {
          // Combine all commit contents into a single string or use a specific logic to display
          const commits = response.data.commits.map(c => c.content).join('\n\n'); // Joins all commit contents with a new line
          editorRef.current.setValue(commits); // Set the value in the editor
          setLastCode(commits); // Update the state with the combined code
        }
      }
    } catch (error) {
      console.error("Error fetching initial code:", error);
    }
};

  useEffect(() => {
    if (editorRef.current && fileId) {
      fetchInitialCode();
    }
  }, [fileId, editorRef.current]);

  const handleSaveCode = async () => {
    if (!editorRef.current) return;
    
    setIsSaving(true);
    try {
      const response = await axios.post('/api/commit/save-commit', {
        content: editorRef.current.getValue(),
        fileId
      });
      
      if (response.data) {
        setOutput("Code saved successfully!");
        // Refresh commit history after saving
        fetchCommitHistory();
      } else {
        throw new Error("Failed to save code");
      }
    } catch (error) {
      console.error("Error saving code:", error);
      setOutput(`Error saving code: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const sendCodeChanges = useCallback(
    debounce(async (code, position, lang) => {
      try {
        const response = await fetch("/api/autocomplete/", {
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
      //editorRef.current.setValue(TEMPLATES[language] || `// Start coding in ${language}...`);
      
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

      const cursorDisposable = editorRef.current.onDidChangeCursorPosition((event) => {
        setCursorPosition(event.position);
      });

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
      //const defaultValue = TEMPLATES[language] || `// Start coding in ${language}...`;
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
        const response = await fetch("/compile", {
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
        setOutput("Error submitting code: " + error.message);
      }
    }
  };

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
    <div className="flex h-screen bg-[#1E1F22] text-white">
      {/* Commit History Sidebar */}
      <div className={`${showCommits ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#282C34] border-r border-gray-700 overflow-hidden`}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Commit History</h2>
          <div className="space-y-2">
            {commits.map((commit) => (
              <button
                key={commit._id}
                onClick={() => loadCommitContent(commit._id)}
                className="w-full p-2 text-left text-sm bg-[#3B3F45] hover:bg-[#4B4F55] rounded transition"
              >
                <div className="font-medium truncate">
                  {commit.committedBy?.name || 'Unknown User'}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(commit.createdAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-3 items-center p-3 bg-[#282C34] border-b border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCommits(!showCommits)}
              className="p-1.5 text-gray-400 hover:text-white transition"
              title="Toggle Commit History"
            >
              <History size={20} />
            </button>
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
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-1.5 text-green-400 border border-green-400 rounded-md transition duration-200 hover:bg-green-500 hover:text-white"
            >
              <Play size={16} />
              Run
            </button>
            <button 
              onClick={handleSubmit} 
              className="flex items-center gap-2 px-4 py-1.5 text-orange-400 border border-orange-400 rounded-md transition duration-200 hover:bg-orange-500 hover:text-white"
            >
              <Upload size={16} />
              Submit
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleSaveCode}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 text-white bg-green-600 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              title="Save Code"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
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
          //defaultValue={TEMPLATES[language] || `// Start coding in ${language}...`}
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
    </div>
  );
}

export default MonacoEditorWrapper;