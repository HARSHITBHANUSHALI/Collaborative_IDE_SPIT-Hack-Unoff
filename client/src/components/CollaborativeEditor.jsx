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

  useEffect(() => {
    if (!editorRef || !room) return;

    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    
    const binding = new MonacoBinding(
      yText,
      editorRef.getModel(),
      new Set([editorRef]),
      yProvider.awareness
    );
    //console.log(editorRef);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
    };
  }, [editorRef, room]);

  const handleEditorMount = useCallback((editor) => {
    setEditorRef(editor);
  }, []);

  return <MonacoEditorWrapper onMount={handleEditorMount} />;
}