const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const File = require('../models/File');
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
                content: ''
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
            content: ''
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
router.get('/:projectId/file/:fileId', async (req, res) => {
    try {
        const { projectId, fileId } = req.params;
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

        res.json(file);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ message: 'Error fetching file' });
    }
});

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

module.exports = router;
