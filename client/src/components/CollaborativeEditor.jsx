import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "../../liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { MonacoEditorWrapper } from "./MonacoEditorWrapper";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";

export function CollaborativeEditor() {
  const [editorRef, setEditorRef] = useState(null);
  const room = useRoom();
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });

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
  }, [editorRef, room]);

  const handleEditorMount = useCallback((editor) => {
    setEditorRef(editor);
  }, []);

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