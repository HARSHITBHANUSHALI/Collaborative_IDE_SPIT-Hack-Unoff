const express = require('express');
//const { register, login } = require('../controllers/authControllers');
const { commit , getCommit} = require('../controllers/commitController');
const router = express.Router();

router.post('/save-commit', commit);
router.get('/getCommits', getCommit);

module.exports = router;

