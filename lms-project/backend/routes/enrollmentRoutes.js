const express = require('express');
const router = express.Router();
const { enrollCourse, getMyCourses, updateProgress } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/enrollments/enroll
router.post('/enroll', protect, authorize('student'), enrollCourse);

// GET /api/enrollments/my-courses
router.get('/my-courses', protect, authorize('student'), getMyCourses);

// PUT /api/enrollments/:id/progress
router.put('/:id/progress', protect, authorize('student'), updateProgress);

module.exports = router;
