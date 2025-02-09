const express = require('express');
//const { register, login } = require('../controllers/authControllers');
const { commit , getCommit, deleteCommit, getCommitFiles} = require('../controllers/commitController');
const router = express.Router();

router.post('/save-commit', commit);
router.get('/getCommits', getCommit);
router.delete('/revert', deleteCommit);
router.get('/getCode/:fileId', getCommitFiles);



module.exports = router;

