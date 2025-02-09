import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MonacoEditorWrapper from '../components/MonacoEditorWrapper';
import { RoomProvider } from "../../liveblocks.config";

const EditorPage = () => {
  const { projectId, fileId } = useParams();
  const [file, setFile] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [error, setError] = useState(null);

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
        setCollaborators(response.data || []);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
        setCollaborators([]);
      }
    };

    fetchFile();
    fetchCollaborators();
  }, [projectId, fileId]);

  const handleAddCollaborator = async () => {
    if (!newCollaborator) return;

    try {
      await axios.post(`/projects/${projectId}/file/${fileId}/add-collaborator`, {
        collaboratorEmail: newCollaborator,
      });
      setCollaborators([...collaborators, newCollaborator]);
      setNewCollaborator('');
    } catch (error) {
      console.error('Error adding collaborator:', error);
      alert(error.response?.data?.message || 'Failed to add collaborator');
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!file) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <RoomProvider id={`${projectId}-${fileId}`} initialPresence={{}}>
      <div className="h-screen">
        <div className="p-4 bg-gray-800 text-white">
          <h2 className="text-lg font-semibold">Manage Collaborators</h2>
          <ul>
            {collaborators && collaborators.length > 0 ? (
              collaborators.map((collab, index) => (
                <li key={index} className="text-gray-300">
                  {collab.user?.email || collab.user?.name || 'Unknown User'}
                </li>
              ))
            ) : (
              <li className="text-gray-300">No collaborators yet</li>
            )}
          </ul>
          <div className="flex gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter email"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <button onClick={handleAddCollaborator} className="p-2 bg-blue-600 rounded hover:bg-blue-700">
              Add Collaborator
            </button>
          </div>
        </div>
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
        />
      </div>
    </RoomProvider>
  );
};

export default EditorPage;
