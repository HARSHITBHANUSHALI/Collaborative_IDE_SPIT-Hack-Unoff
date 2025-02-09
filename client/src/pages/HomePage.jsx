import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '@/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { VscGitCommit } from "react-icons/vsc";


const HomePage = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [isFolder, setIsFolder] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:4000/projects/list');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleSubmit = async (e) => {
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
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-50 w-full border-b shadow-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} `}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Project Manager</h1>
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === 'dark' ? 
                            <Sun className="h-6 w-6" /> : 
                            <Moon className="h-6 w-6" />
                        }
                    </button>
                </div>
            </header>

            {/* Create Project Form */}
            <div className={`max-w-2xl rounded-xl mx-auto mt-16 px-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <form onSubmit={handleSubmit} className=" rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Create New Project</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Project Name"
                            className="w-full text-black p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isFolder"
                                checked={isFolder}
                                onChange={(e) => setIsFolder(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="isFolder">Create as folder</label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>

            {/* Projects List */}
            <div className={`max-w-7xl mx-auto px-4 mt-16 mb-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <h2 className="text-xl font-bold mb-6">Your Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className= {`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} rounded-lg shadow-md p-6 cursor-pointer 
                                hover:shadow-lg transition-shadow relative`}
                        onClick={() => navigate(`/project/${project._id}`)}
                    >
                        <button className='border-gray-400' onClick={() => navigate("/commit")}>
                            <VscGitCommit className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 w-5 h-5" />
                        </button>
                        <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.isFolder ? 'Folder' : 'File'}
                        </p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;