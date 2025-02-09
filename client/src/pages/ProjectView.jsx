import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaFile, FaChevronRight, FaPlus } from "react-icons/fa";
import { ThemeContext } from '@/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [items, setItems] = useState({ folders: [], files: [] });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [isFolder, setIsFolder] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetchProjectContents();
  }, [projectId, currentFolderId]);

  const fetchProjectContents = async () => {
    try {
      const response = await axios.get(`/projects/${projectId}/contents`, {
        params: { currentFolderId }
      });
      setProject(response.data.project);
      setItems(response.data.contents);
      
      if (response.data.currentFolder && currentFolderId) {
        const folder = response.data.currentFolder;
        if (!breadcrumb.find(b => b.id === folder._id)) {
          setBreadcrumb([...breadcrumb, { id: folder._id, name: folder.name }]);
        }
      }
    } catch (error) {
      console.error('Error fetching project contents:', error);
    }
  };

  const handleCreateItem = async () => {
    try {
      await axios.post(`/projects/${projectId}/create`, {
        name: newItemName,
        isFolder,
        currentFolderId
      });
      setShowCreateModal(false);
      setNewItemName('');
      fetchProjectContents();
    } catch (error) {
      console.error('Error creating item:', error);
      alert(error.response?.data?.message || 'Error creating item');
    }
  };

  const handleItemClick = (item) => {
    if (item.isFolder) {
      setCurrentFolderId(item._id);
    } else {
      navigate(`/editor/${projectId}/${item._id}`);
    }
  };

  const navigateToBreadcrumb = (index) => {
    if (index === -1) {
      setCurrentFolderId(null);
      setBreadcrumb([]);
    } else {
      setCurrentFolderId(breadcrumb[index].id);
      setBreadcrumb(breadcrumb.slice(0, index + 1));
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 w-full border-b shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-xl">
            <span
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-800'} text-3xl font-bold cursor-pointer transition-colors`}
              onClick={() => navigateToBreadcrumb(-1)}
            >
              <FaFolder className="w-6 h-6 text-yellow-500" />
              {project?.name}
            </span>
            {breadcrumb.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <FaChevronRight className="w-5 h-5 text-gray-400" />
                <span
                  className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-800'} text-xl font-semibold cursor-pointer transition-colors`}
                  onClick={() => navigateToBreadcrumb(index)}
                >
                  <FaFolder className="w-5 h-5 text-yellow-500" />
                  {folder.name}
                </span>
              </React.Fragment>
            ))}
          </div>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            {theme === 'dark' ? 
              <Sun className="h-6 w-6" /> : 
              <Moon className="h-6 w-6" />
            }
          </button>
        </div>
      </header>

      <div className="flex justify-center mb-8 mt-8">
        <button
          className="mb-4 flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Create New
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.folders.map((folder) => (
            <div
              key={folder._id}
              className={`border p-4 rounded cursor-pointer transition-all duration-200 
                ${theme === 'dark' ? 
                  'text-white border-gray-700 hover:border-blue-500 hover:bg-gray-800' : 
                  'text-gray-900 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              onClick={() => handleItemClick(folder)}
            >
              <div className="flex items-center gap-3">
                <FaFolder className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold">{folder.name}</h3>
              </div>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Folder</p>
            </div>
          ))}
          {items.files.map((file) => (
            <div
              key={file._id}
              className={`border p-4 rounded cursor-pointer transition-all duration-200 
                ${theme === 'dark' ? 
                  'text-white border-gray-700 hover:border-blue-500 hover:bg-gray-800' : 
                  'text-gray-900 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              onClick={() => handleItemClick(file)}
            >
              <div className="flex items-center gap-3">
                <FaFile className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold">{file.name}</h3>
              </div>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>File</p>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-96`}>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Create New Item
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Name"
                className={`w-full p-2 border rounded mb-4 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <label className={`flex items-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <input
                  type="checkbox"
                  checked={isFolder}
                  onChange={(e) => setIsFolder(e.target.checked)}
                  className="mr-2"
                />
                Is Folder
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  className={`px-4 py-2 ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  onClick={handleCreateItem}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;