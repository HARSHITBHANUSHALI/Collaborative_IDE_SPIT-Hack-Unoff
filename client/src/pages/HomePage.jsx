import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [isFolder, setIsFolder] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/projects/list');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/projects/create', {
                name: newProjectName,
                isFolder
            });
            setNewProjectName('');
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Projects</h1>
            
            {/* Create Project Form */}
            <form onSubmit={handleCreateProject} className="mb-6">
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="New Project Name"
                        className="p-2 border rounded"
                    />
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isFolder}
                            onChange={(e) => setIsFolder(e.target.checked)}
                            className="mr-2"
                        />
                        Is Folder
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create Project
                    </button>
                </div>
            </form>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/project/${project._id}`)}
                    >
                        <h3 className="font-bold">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                            {project.isFolder ? 'Folder' : 'File'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
