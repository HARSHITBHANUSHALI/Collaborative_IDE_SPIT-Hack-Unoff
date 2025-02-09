import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "../../liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { MonacoEditorWrapper } from "./MonacoEditorWrapper";
import { MonacoBinding } from "y-monaco";
import { FileCode, User, X, Share2, Users } from 'lucide-react'; // Added FileCode to imports
import axios from "axios";
import { useParams } from "react-router-dom";

export function CollaborativeEditor() {
  const [editorRef, setEditorRef] = useState(null);
  const room = useRoom();
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });

  const { projectId, fileId } = useParams();
  const [file, setFile] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [error, setError] = useState(null);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [selectedRole, setSelectedRole] = useState('viewer'); // Add this new state

  // First useEffect for file and collaborator fetching
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(`/projects/${projectId}/file/${fileId}`);
        setFile(response.data);
      } catch (error) {
        console.error('Error fetching file:', error);
        setError(error.response?.data?.message || 'Error loading file');
      }
    };

    const fetchCollaborators = async () => {
      try {
        const response = await axios.get(`/projects/${projectId}/file/${fileId}/collaborators`);
        console.log('Raw collaborators data:', response.data);
        // Ensure we're setting the full collaborators array
        setCollaborators(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
        setCollaborators([]);
      }
    };

    if (projectId && fileId) {
      fetchFile();
      fetchCollaborators();
    }
  }, [projectId, fileId]);

  // Second useEffect for editor setup
  useEffect(() => {
    if (!editorRef || !room) return;

    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{"name": "Anonymous"}');
    const userColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;

    // Create cursor decoration for current user
    const decorations = new Map();

    const updateCursorDecoration = (position) => {
      const cursorDiv = document.createElement('div');
      cursorDiv.className = `
        absolute h-[18px] w-0.5 
        pointer-events-none 
        transition-all duration-100 ease-linear
        group
      `;

      // Create tooltip div
      const tooltipDiv = document.createElement('div');
      tooltipDiv.className = `
        absolute -top-6 left-0
        px-2 py-1 rounded
        bg-[${userColor}]
        text-white text-xs
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        z-50
      `;
      tooltipDiv.textContent = userInfo.name;
      cursorDiv.appendChild(tooltipDiv);

      // Set cursor color
      cursorDiv.style.backgroundColor = userColor;
      cursorDiv.setAttribute('data-name', userInfo.name);

      const newDecorations = [{
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: 'relative group',
          beforeContentClassName: `border-l-2 border-[${userColor}]`,
          beforeContent: {
            content: '',
            domNode: cursorDiv,
          },
          hoverMessage: { value: `${userInfo.name} (You)` },
          zIndex: 20,
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        }
      }];

      // Clear old decorations
      decorations.forEach((oldDec) => {
        editorRef.deltaDecorations([oldDec.id], []);
      });
      decorations.clear();

      // Add new decoration
      const decorationIds = editorRef.deltaDecorations([], newDecorations);
      decorations.set('self', {
        id: decorationIds[0],
        element: cursorDiv
      });
    };

    // Listen to cursor position changes
    const disposable = editorRef.onDidChangeCursorPosition((e) => {
      const position = e.position;
      setCursorPosition(position);
      updateCursorDecoration(position);
    });

    
    // Initialize with content if available
    if (yText.toString() === '' && file?.content) {
      yText.insert(0, file.content);
    }

    const binding = new MonacoBinding(
      yText,
      editorRef.getModel(),
      new Set([editorRef]),
      yProvider.awareness
    );

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
      decorations.clear();
      disposable?.dispose();
    };
  }, [editorRef, room, file]);

  const handleEditorMount = useCallback((editor) => {
    setEditorRef(editor);
  }, []);

  const handleAddCollaborator = useCallback(async () => {
    if (!newCollaborator) return;

    try {
      await axios.post(`/projects/${projectId}/file/${fileId}/add-collaborator`, {
        collaboratorEmail: newCollaborator,
        role: selectedRole // Include the selected role
      });
      const response = await axios.get(`/projects/${projectId}/file/${fileId}/collaborators`);
      setCollaborators(response.data || []);
      setNewCollaborator('');
      setSelectedRole('viewer'); // Reset role selection
      setShowCollaborators(false);
    } catch (error) {
      console.error('Error adding collaborator:', error);
      alert(error.response?.data?.message || 'Failed to add collaborator');
    }
  }, [newCollaborator, selectedRole, projectId, fileId]); // Add selectedRole to dependencies

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!file) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-[#1E1E1E] flex items-center justify-between px-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-gray-400" />
            <span className="text-gray-200">{file?.name || 'Untitled'}</span>
          </div>
          <button
            onClick={() => setShowCollaborators(!showCollaborators)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
          >
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">Collaborators ({collaborators.length})</span>
          </button>
        </div>
        <div className="flex-1">
          Current Position: Line {cursorPosition.lineNumber}, Column {cursorPosition.column}

          <MonacoEditorWrapper 
            fileId={fileId}
            projectId={projectId}
            initialValue={file.content}
            onSave={async (content) => {
              try {
                await axios.put(`/projects/${projectId}/file/${fileId}`, { content });
              } catch (error) {
                console.error('Error saving file:', error);
                alert('Error saving file');
              }
            }}
            onMount={handleEditorMount} 
          />
        </div>
      </div>

      {/* Collaborators Sidebar - Updated styles */}
      {showCollaborators && (
        <div className="w-80 bg-[#252526] border-l border-gray-700 flex flex-col h-screen fixed right-0 top-0 z-50">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white truncate">
              Collaborators ({collaborators.length})
            </h2>
            <button
              onClick={() => setShowCollaborators(false)}
              className="text-gray-400 hover:text-white flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex flex-col h-full overflow-hidden">
            {/* Add collaborator input */}
            <div className="mb-4 flex-shrink-0">
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Add by email..."
                  value={newCollaborator}
                  onChange={(e) => setNewCollaborator(e.target.value)}
                  className="w-full px-3 py-2 bg-[#3C3C3C] text-white rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#3C3C3C] text-white rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  onClick={handleAddCollaborator}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Add as {selectedRole}</span>
                </button>
              </div>
            </div>

            {/* Collaborators list - Added overflow handling */}
            <div className="overflow-y-auto flex-1 -mx-4 px-4">
              <div className="space-y-2">
                {collaborators && collaborators.map((collab, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-md bg-[#3C3C3C]"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0"> {/* Added min-width-0 for text truncation */}
                      <div className="text-sm text-gray-300 truncate">
                        {collab?.user?.email || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          collab?.role === 'editor' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></span>
                        {collab?.role || 'Viewer'}
                      </div>
                    </div>
                  </div>
                ))}
                {(!collaborators || collaborators.length === 0) && (
                  <div className="text-gray-400 text-c enter py-4">
                    No collaborators yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="flex flex-col h-full bg-[#1E1E1E]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#404040]">
        <div className="text-white text-sm font-mono">
          <span className="text-gray-400">Line </span>
          <span className="text-orange-400">{cursorPosition.lineNumber}</span>
          <span className="text-gray-400">, Column </span>
          <span className="text-orange-400">{cursorPosition.column}</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <MonacoEditorWrapper onMount={handleEditorMount} />
      </div>
    </div>
  );
}