import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '@/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon, GitBranch, Plus, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:4000/projects/list');
      const data = response.data;
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectName,
          isFolder
        }),
      });
      setNewProjectName('');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleNavigate = (projectId, event) => {
    event.stopPropagation();
    navigate(`/commit/${projectId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            opacity: [0.1, 0.2, 0.1], 
            rotate: 360 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme === 'dark' ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)'} 1px, transparent 1px),
              linear-gradient(to bottom, ${theme === 'dark' ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur-md ${theme === 'dark' ? 'bg-gray-900/80 text-white border-gray-800' : 'bg-white/80 text-gray-900 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold font-spaceGrotesk"
          >
            Project Manager
          </motion.h1>
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </motion.button>
        </div>
      </header>

      {/* Create Project Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mt-16 px-4"
      >
        <motion.form 
          onSubmit={handleSubmit}
          className={`rounded-xl shadow-lg p-8 backdrop-blur-md ${theme === 'dark' ? 'bg-gray-900/50 border border-gray-800' : 'bg-white/50 border border-gray-200'}`}
        >
          <h2 className={`text-2xl font-bold mb-6 text-center font-spaceGrotesk ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Create New Project
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
              className={`w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFolder"
                checked={isFolder}
                onChange={(e) => setIsFolder(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Create as folder
              </label>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium 
                hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              Create Project
            </motion.button>
          </div>
        </motion.form>
      </motion.div>

      {/* Projects List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`max-w-7xl mx-auto px-4 mt-16 mb-8`}
      >
        <h2 className={`text-2xl font-bold mb-6 font-spaceGrotesk ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Your Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/project/${project._id}`)}
              className={`rounded-xl p-6 cursor-pointer border backdrop-blur-md
                ${theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800 hover:bg-gray-800/50' 
                  : 'bg-white/50 border-gray-200 hover:bg-gray-50/50'
                } transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {project.isFolder ? <FolderPlus className="h-6 w-6" /> : <GitBranch className="h-6 w-6" />}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(event) => handleNavigate(project._id, event)}
                  className={`p-2 rounded-full ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <GitBranch className="h-5 w-5" />
                </motion.button>
              </div>
              <h3 className={`font-bold text-lg mb-2 font-outfit ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {project.name}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {project.isFolder ? 'Folder' : 'File'}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;