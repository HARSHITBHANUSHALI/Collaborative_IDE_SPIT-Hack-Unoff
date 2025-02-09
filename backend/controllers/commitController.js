const express = require('express');
const router = express.Router();
const Commit = require('../models/Commit');

// Save new commit
const commit = async(req , res) => {
  try {
    const { content , fileId} = req.body;
    const userId = req.user.id;
    
    if (!fileId || !content || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields" 
      });
    }

    const commit = new Commit({
      file: fileId,
      content,
      committedBy: userId
    });

    await commit.save();
    
    res.status(201).json({ 
      success: true, 
      commit: commit 
    });
  } catch (error) {
    console.error('Error saving commit:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
const getCommit = async (req, res) => {
    try {
      const token = req.cookies.jwt;
      
      if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
  
      // Fetch all commits from MongoDB
      const commits = await Commit.find();
  
      // Transform commit data properly
      const formattedCommits = commits.map(commit => ({
        id: commit._id.toString(), // Convert ObjectId to string
        content: commit.content,
        date: commit.timestamp,
        committedBy: commit.committedBy
      }));
  
      res.json({
        success: true,
        commit: formattedCommits
      });
  
    } catch (error) {
      console.error("Error getting commit history:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  const deleteCommit = async (req, res) => {
    try {
      const { commitId } = req.body;
      const userId = req.user?.id;  // Add optional chaining
  
      if (!commitId || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields" 
        });
      }
  
      const commit = await Commit.findById(commitId);
      if (!commit) {
        return res.status(404).json({ success: false, error: 'Commit not found' });
      }
  
      // Use deleteOne instead of remove (which is deprecated)
      await Commit.deleteOne({ _id: commitId });
      
      res.json({ success: true, message: 'Commit deleted successfully' });
    } catch (error) {
      console.error('Error deleting commit:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  const getCommitFiles = async (req, res) => {
    try {
        const { fileId } = req.params;

        // Find all commits for this file
        const commits = await Commit.find({ file: fileId })
            .sort({ createdAt: -1 }) // Optional: to sort commits by most recent first
            .populate('committedBy'); // Populating 'committedBy' to include user information

        if (!commits || commits.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No commits found for this file'
            });
        }

        // Respond with all commits
        res.json({
            success: true,
            commits: commits.map(commit => ({
                id: commit._id,
                content: commit.content,
                createdAt: commit.createdAt,
                committedBy: commit.committedBy // You can add other fields you want to display
            }))
        });
    } catch (error) {
        console.error('Error fetching commits:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// Get commit history for a file
// router.get('/history/:fileId', async (req, res) => {
//   try {
//     const commits = await Commit.find({ file: req.params.fileId })
//       .sort({ createdAt: -1 })
//       .populate('committedBy', 'name email')
//       .exec();

//     res.json({
//       success: true,
//       commits
//     });
//   } catch (error) {
//     console.error('Error fetching commit history:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// // Get specific commit
// router.get('/:commitId', async (req, res) => {
//   try {
//     const commit = await Commit.findById(req.params.commitId)
//       .populate('committedBy', 'name email')
//       .populate('previousVersion')
//       .exec();

//     if (!commit) {
//       return res.status(404).json({
//         success: false,
//         error: 'Commit not found'
//       });
//     }

//     res.json({
//       success: true,
//       commit
//     });
//   } catch (error) {
//     console.error('Error fetching commit:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// module.exports = router;

module.exports = { commit , getCommit , deleteCommit , getCommitFiles}; 