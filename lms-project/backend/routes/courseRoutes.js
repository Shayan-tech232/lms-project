const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  getInstructorCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/courses
router.get('/', getCourses);

// GET /api/courses/instructor-courses
router.get('/instructor-courses', protect, authorize('instructor'), getInstructorCourses);

// GET /api/courses/:id
router.get('/:id', getCourse);

// POST /api/courses
router.post('/', protect, authorize('instructor', 'admin'), createCourse);

// PUT /api/courses/:id
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);

// DELETE /api/courses/:id
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// POST /api/courses/:id/lessons
router.post('/:id/lessons', protect, authorize('instructor'), addLesson);

module.exports = router;
