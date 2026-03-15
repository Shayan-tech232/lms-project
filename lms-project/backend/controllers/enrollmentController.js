const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll
// @access  Private (Student)
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const alreadyEnrolled = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });

    res.status(201).json({ success: true, message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enrolled courses of logged-in student
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email' },
      })
      .sort('-enrolledAt');

    res.json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student)
const updateProgress = async (req, res) => {
  try {
    const { lessonId, progress } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    if (progress !== undefined) enrollment.progress = progress;

    await enrollment.save();
    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enrollCourse, getMyCourses, updateProgress };
