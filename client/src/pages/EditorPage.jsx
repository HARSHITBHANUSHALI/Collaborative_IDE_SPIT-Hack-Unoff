import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MonacoEditorWrapper from '../components/MonacoEditorWrapper';

const EditorPage = () => {
  const { projectId, fileId } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(`/projects/${projectId}/file/${fileId}`);
        setFile(response.data);
      } catch (error) {
        console.error('Error fetching file:', error);
        setError('Error loading file');
      }
    };

    fetchFile();
  }, [projectId, fileId]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!file) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="h-screen">
      <MonacoEditorWrapper
        initialValue={file.content}
        onSave={async (content) => {
          try {
            await axios.put(`/projects/${projectId}/file/${fileId}`, { content });
          } catch (error) {
            console.error('Error saving file:', error);
            alert('Error saving file');
          }
        }}
      />
    </div>
  );
};

export default EditorPage;
