  import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { FaFolder, FaFile, FaChevronRight, FaPlus } from 'react-icons/fa';

  const ProjectView = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState([]);  // Store folder hierarchy
    const [currentFolderId, setCurrentFolderId] = useState(null);  // Track current folder
    const [items, setItems] = useState({ folders: [], files: [] });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [isFolder, setIsFolder] = useState(false);

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
        
        // If we're in a subfolder, update the breadcrumb
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
        const response = await axios.post(`/projects/${projectId}/create`, {
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
        // Navigate to root
        setCurrentFolderId(null);
        setBreadcrumb([]);
      } else {
        // Navigate to specific folder
        setCurrentFolderId(breadcrumb[index].id);
        setBreadcrumb(breadcrumb.slice(0, index + 1));
      }
    };

    return (
      <div className="p-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center mb-6 space-x-2">
          <span
            className="cursor-pointer hover:text-blue-500"
            onClick={() => navigateToBreadcrumb(-1)}
          >
            {project?.name}
          </span>
          {breadcrumb.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <FaChevronRight className="w-4 h-4" />
              <span
                className="cursor-pointer hover:text-blue-500"
                onClick={() => navigateToBreadcrumb(index)}
              >
                {folder.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Create New Item Button */}
        <button
          className="mb-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Create New
        </button>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {items.folders.map((folder) => (
            <div
              key={folder._id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleItemClick(folder)}
            >
              <FaFolder className="w-8 h-8 text-yellow-500 mb-2" />
              <span>{folder.name}</span>
            </div>
          ))}
          {items.files.map((file) => (
            <div
              key={file._id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleItemClick(file)}
            >
              <FaFile className="w-8 h-8 text-blue-500 mb-2" />
              <span>{file.name}</span>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Create New Item</h2>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Name"
                className="w-full p-2 border rounded mb-4"
              />
              <label className="flex items-center mb-4">
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
                  className="px-4 py-2 text-gray-600"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleCreateItem}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default ProjectView;
