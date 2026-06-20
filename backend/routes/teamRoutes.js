const express = require('express');
const router = express.Router();
const { getTeamMembers, inviteMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTeamMembers).post(protect, inviteMember);

module.exports = router;
