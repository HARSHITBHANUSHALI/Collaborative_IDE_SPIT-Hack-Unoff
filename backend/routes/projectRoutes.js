const express = require('express');
    const router = express.Router();
    const Project = require('../models/Project');
    const File = require('../models/File');
    const User = require('../models/user');
    const verifyJWT = require('../middleware/verifyJwt');

    // Create a new project or folder
    router.post('/create', async (req, res) => {
        try {
            const { name, isFolder, parentFolder } = req.body;
            const userId = req.user.id;

            const project = new Project({
                name,
                owner: userId,
                isFolder,
                parentFolder,
                collaborators: [{ user: userId, role: "owner" }]
            });

            await project.save();
            res.status(201).json(project);
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Error creating project' });
        }
    });

    // Get all root-level projects for a user
    router.get('/list', async (req, res) => {
        try {
            const userId = req.user.id;
            const projects = await Project.find({
                'collaborators.user': userId,
                parentFolder: null
            }).populate('owner', 'name email');

            res.json(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ message: 'Error fetching projects' });
        }
    });

    // Get project contents
    router.get('/:projectId/contents', async (req, res) => {
        try {
            const { projectId } = req.params;
            const { currentFolderId } = req.query;  // Changed from path to currentFolderId
            const userId = req.user.id;

            const project = await Project.findOne({
                _id: projectId,
                'collaborators.user': userId
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // If currentFolderId is not provided, we're at the root of the project
            const parentFolderId = currentFolderId || projectId;

            // Get subfolders and files for the current folder
            const contents = {
                folders: await Project.find({ 
                    parentFolder: parentFolderId,
                    isFolder: true 
                }),
                files: await File.find({ 
                    project: projectId,
                    folder: parentFolderId 
                })
            };

            res.json({
                project,
                contents,
                currentFolder: currentFolderId ? await Project.findById(currentFolderId) : project
            });
        } catch (error) {
            console.error('Error fetching project contents:', error);
            res.status(500).json({ message: 'Error fetching project contents' });
        }
    });

    // Create new item (folder or file) in a project
    router.post('/:projectId/create', async (req, res) => {
        try {
            const { projectId } = req.params;
            const { name, isFolder, currentFolderId } = req.body;  // Changed from path to currentFolderId
            const userId = req.user.id;

            const parentProject = await Project.findOne({
                _id: projectId,
                'collaborators.user': userId
            });

            if (!parentProject) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (isFolder) {
                const folder = new Project({
                    name,
                    owner: userId,
                    isFolder: true,
                    parentFolder: currentFolderId || projectId,  // Use currentFolderId if available
                    collaborators: [{ user: userId, role: "owner" }]
                });
                await folder.save();
                res.status(201).json(folder);
            } else {
                const file = new File({
                    name,
                    project: projectId,
                    folder: currentFolderId || projectId,  // Use currentFolderId if available
                    content: '',
                    collaborators: [{ user: userId, role: "owner" }] // Add creator as collaborator
                });
                await file.save();
                res.status(201).json(file);
            }
        } catch (error) {
            console.error('Error creating item:', error);
            res.status(500).json({ message: 'Error creating item' });
        }
    });

    // Create new file in a project
    router.post('/:projectId/create-file', async (req, res) => {
        try {
            const { projectId } = req.params;
            const { name } = req.body;
            const userId = req.user.id;

            const project = await Project.findOne({
                _id: projectId,
                'collaborators.user': userId
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const file = new File({
                name,
                project: projectId,
                content: '',
                collaborators: [{ user: userId, role: "owner" }] // Add creator as collaborator
            });

            await file.save();

            // Add file reference to project
            project.files.push(file._id);
            await project.save();

            res.status(201).json(file);
        } catch (error) {
            console.error('Error creating file:', error);
            res.status(500).json({ message: 'Error creating file' });
        }
    });


    // Get file content
    // router.get('/:projectId/file/:fileId', async (req, res) => {
    //     try {
    //         const { projectId, fileId } = req.params;
    //         const userId = req.user.id;

    //         // Check if the file exists and belongs to the project
    //         const file = await File.findOne({
    //             _id: fileId,
    //             project: projectId
    //         });

    //         if (!file) {
    //             return res.status(404).json({ message: 'File not found' });
    //         }

    //         // Ensure file has a collaborators array
    //         if (!file.collaborators) {
    //             file.collaborators = [];
    //         }

    //         // Check if user is a file collaborator
    //         const isCollaborator = file.collaborators.some(collab => collab.user.toString() === userId);
            
    //         if (!isCollaborator) {
    //             return res.status(403).json({ message: 'You do not have access to this file' });
    //         }

    //         res.json(file);
    //     } catch (error) {
    //         console.error('Error fetching file:', error);
    //         res.status(500).json({ message: 'Error fetching file' });
    //     }
    // });



    // Update file content
    router.put('/:projectId/file/:fileId', async (req, res) => {
        try {
            const { projectId, fileId } = req.params;
            const { content } = req.body;
            const userId = req.user.id;

            const project = await Project.findOne({
                _id: projectId,
                'collaborators.user': userId
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const file = await File.findOne({
                _id: fileId,
                project: projectId
            });

            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            file.content = content;
            await file.save();

            res.json(file);
        } catch (error) {
            console.error('Error updating file:', error);
            res.status(500).json({ message: 'Error updating file' });
        }
    });

    // Add a collaborator to a file (only file owner or project owner can add)
    router.post('/:projectId/file/:fileId/add-collaborator', async (req, res) => {
        const { projectId, fileId } = req.params;
        const { collaboratorEmail, role } = req.body; // Add role to destructuring

        try {
            const project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ message: 'Project not found' });

            const file = await File.findById(fileId);
            if (!file) return res.status(404).json({ message: 'File not found' });

            // Find the user by email
            const user = await User.findOne({ email: collaboratorEmail });
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Ensure user is not already a collaborator
            const alreadyCollaborator = file.collaborators.some(collab => 
                collab.user.toString() === user._id.toString()
            );
            if (alreadyCollaborator) {
                return res.status(400).json({ message: 'User is already a collaborator' });
            }

            // Validate role
            const validRoles = ['viewer', 'editor'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Invalid role specified' });
            }

            // Add collaborator with specified role
            file.collaborators.push({ user: user._id, role });
            await file.save();

            res.json({ message: 'Collaborator added successfully' });
        } catch (error) {
            console.error('Error adding collaborator:', error);
            res.status(500).json({ message: 'Error adding collaborator' });
        }
    });


    router.get('/:projectId/file/:fileId', async (req, res) => {
        try {
            const { projectId, fileId } = req.params;
            const userId = req.user.id;

            // Find the project and check if user is an owner or collaborator
            const project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ message: 'Project not found' });

            const file = await File.findById(fileId);
            if (!file) return res.status(404).json({ message: 'File not found' });

            const isProjectOwner = project.owner.toString() === userId;
            const isCollaborator = file.collaborators.some(collab => collab.user.toString() === userId);

            if (!isProjectOwner && !isCollaborator) {
                return res.status(403).json({ message: 'You do not have access to this file' });
            }

            res.json(file);
        } catch (error) {
            console.error('Error fetching file:', error);
            res.status(500).json({ message: 'Error fetching file' });
        }
    });
        
    router.get('/:projectId/file/:fileId/collaborators', async (req, res) => {
        try {
            const { fileId } = req.params;

            const file = await File.findById(fileId).populate('collaborators.user', 'name email');

            if (!file) {
                console.log("File not found for ID:", fileId);
                return res.status(404).json({ message: 'File not found' });
            }

            console.log("User ID:", req.user?.id || "No user found"); 
            console.log("File Collaborators:", file.collaborators?.map(c => c.user?.toString()) || "No collaborators");

            res.json(file.collaborators);
        } catch (error) {
            console.error('Error fetching collaborators:', error);
            res.status(500).json({ message: 'Error fetching collaborators' });
        }
    });



    module.exports = router;
