import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaFile, FaChevronRight, FaPlus } from "react-icons/fa";

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]); // Store folder hierarchy
  const [currentFolderId, setCurrentFolderId] = useState(null); // Track current folder
  const [items, setItems] = useState({ folders: [], files: [] });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [isFolder, setIsFolder] = useState(false);

  useEffect(() => {
    fetchProjectContents();
  }, [projectId, currentFolderId]);

  const fetchProjectContents = async () => {
    try {
      const response = await axios.get(`/projects/${projectId}/contents`, {
        params: { currentFolderId },
      });
      setProject(response.data.project);
      setItems(response.data.contents);

      // If we're in a subfolder, update the breadcrumb
      if (response.data.currentFolder && currentFolderId) {
        const folder = response.data.currentFolder;
        if (!breadcrumb.find((b) => b.id === folder._id)) {
          setBreadcrumb([...breadcrumb, { id: folder._id, name: folder.name }]);
        }
      }
    } catch (error) {
      console.error("Error fetching project contents:", error);
    }
  };

  const handleCreateItem = async () => {
    try {
      const response = await axios.post(`/projects/${projectId}/create`, {
        name: newItemName,
        isFolder,
        currentFolderId,
      });
      setShowCreateModal(false);
      setNewItemName("");
      fetchProjectContents();
    } catch (error) {
      console.error("Error creating item:", error);
      alert(error.response?.data?.message || "Error creating item");
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
      {/* Header with Breadcrumb */}
      <div className="mb-8 bg-white shadow-sm rounded-lg p-6">
  <div className="container mx-auto">
    <div className="flex items-center gap-3 text-xl">
      <span
        className="flex items-center gap-2 text-gray-900 text-3xl font-bold hover:text-blue-800 cursor-pointer transition-colors"
        onClick={() => navigateToBreadcrumb(-1)}
      >
        <FaFolder className="w-6 h-6 text-yellow-500" />
        {project?.name}
      </span>
      {breadcrumb.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <FaChevronRight className="w-5 h-5 text-gray-400" />
          <span
            className="flex items-center gap-2 text-gray-900 text-xl font-semibold hover:text-blue-800 cursor-pointer transition-colors"
            onClick={() => navigateToBreadcrumb(index)}
          >
            <FaFolder className="w-5 h-5 text-yellow-500" />
            {folder.name}
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
</div>

      {/* Create New Button - Centered */}
      <div className="flex justify-center mb-8">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Create New Button
      <button
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
        onClick={() => setShowCreateModal(true)}
      >
        <FaPlus className="w-4 h-4" />
        Create New
      </button> */}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.folders.map((folder) => (
          <div
            key={folder._id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => handleItemClick(folder)}
          >
            <div className="flex items-center gap-3">
              <FaFolder className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold">{folder.name}</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Folder</p>
          </div>
        ))}
        {items.files.map((file) => (
          <div
            key={file._id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => handleItemClick(file)}
          >
            <div className="flex items-center gap-3">
              <FaFile className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold">{file.name}</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">File</p>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create New Item</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter name..."
                className="p-2 border rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFolder}
                  onChange={(e) => setIsFolder(e.target.checked)}
                  className="mr-2"
                />
                Create as folder
              </label>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
