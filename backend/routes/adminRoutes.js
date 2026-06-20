const express = require('express');
const router = express.Router();
const { getSystemStats, getAllUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, getSystemStats);
router.route('/users').get(protect, getAllUsers);

module.exports = router;
