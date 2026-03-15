const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getAnalytics } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/users
router.get('/', protect, authorize('admin'), getUsers);

// GET /api/users/analytics
router.get('/analytics', protect, authorize('admin'), getAnalytics);

// DELETE /api/users/:id
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
