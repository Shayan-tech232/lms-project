/**
 * Seed Script — run with: node seed.js
 * Creates demo admin, instructor, student, and sample courses.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('Cleared existing data');

    // Create Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
    });

    const instructorUser = await User.create({
      name: 'Jane Instructor',
      email: 'instructor@lms.com',
      password: 'inst123',
      role: 'instructor',
    });

    const studentUser = await User.create({
      name: 'John Student',
      email: 'student@lms.com',
      password: 'student123',
      role: 'student',
    });

    console.log('Users created');

    // Create Courses
    const courses = await Course.insertMany([
      {
        title: 'Complete React JS Bootcamp',
        description: 'Master React from scratch — hooks, context, routing, and real-world projects.',
        instructor: instructorUser._id,
        category: 'Web Development',
        price: 49,
        isPublished: true,
        lessons: [
          { title: 'Introduction to React', content: 'What is React and why use it?', duration: '10 min', order: 1 },
          { title: 'JSX & Components', content: 'Understanding JSX syntax and functional components.', duration: '20 min', order: 2 },
          { title: 'State & Props', content: 'Managing state and passing data with props.', duration: '25 min', order: 3 },
          { title: 'React Hooks (useState, useEffect)', content: 'Using built-in hooks effectively.', duration: '30 min', order: 4 },
          { title: 'React Router', content: 'Client-side routing with react-router-dom v6.', duration: '20 min', order: 5 },
        ],
      },
      {
        title: 'Node.js & Express API Development',
        description: 'Build RESTful APIs with Node.js, Express, and MongoDB from the ground up.',
        instructor: instructorUser._id,
        category: 'Web Development',
        price: 39,
        isPublished: true,
        lessons: [
          { title: 'Node.js Fundamentals', content: 'Introduction to Node.js runtime environment.', duration: '15 min', order: 1 },
          { title: 'Express Setup & Routing', content: 'Creating an Express server and defining routes.', duration: '20 min', order: 2 },
          { title: 'MongoDB & Mongoose', content: 'Connecting to MongoDB using Mongoose ODM.', duration: '25 min', order: 3 },
          { title: 'JWT Authentication', content: 'Implementing JWT-based authentication.', duration: '30 min', order: 4 },
        ],
      },
      {
        title: 'Python for Data Science',
        description: 'Learn Python fundamentals and data analysis with Pandas, NumPy, and Matplotlib.',
        instructor: instructorUser._id,
        category: 'Data Science',
        price: 0,
        isPublished: true,
        lessons: [
          { title: 'Python Basics', content: 'Variables, loops, and functions in Python.', duration: '20 min', order: 1 },
          { title: 'NumPy Arrays', content: 'Working with numerical data using NumPy.', duration: '25 min', order: 2 },
          { title: 'Pandas DataFrames', content: 'Data manipulation and analysis with Pandas.', duration: '35 min', order: 3 },
        ],
      },
      {
        title: 'UI/UX Design Principles',
        description: 'Learn the fundamentals of good design: typography, color theory, and user research.',
        instructor: instructorUser._id,
        category: 'Design',
        price: 29,
        isPublished: true,
        lessons: [
          { title: 'Design Thinking', content: 'User-centred design methodology.', duration: '15 min', order: 1 },
          { title: 'Typography & Color', content: 'Choosing fonts and building a color palette.', duration: '20 min', order: 2 },
          { title: 'Wireframing', content: 'Creating low-fidelity wireframes with Figma.', duration: '30 min', order: 3 },
        ],
      },
      {
        title: 'Full Stack MERN Development',
        description: 'Build complete web applications using MongoDB, Express, React, and Node.js.',
        instructor: instructorUser._id,
        category: 'Web Development',
        price: 59,
        isPublished: true,
        lessons: [
          { title: 'MERN Stack Overview', content: 'Architecture and workflow of a MERN application.', duration: '15 min', order: 1 },
          { title: 'Setting Up the Project', content: 'Backend and frontend project structure.', duration: '20 min', order: 2 },
          { title: 'Building the REST API', content: 'Express routes, controllers, and middleware.', duration: '40 min', order: 3 },
          { title: 'Connecting React to API', content: 'Axios calls, state management, and auth flow.', duration: '45 min', order: 4 },
          { title: 'Deployment', content: 'Deploying to Render (backend) and Vercel (frontend).', duration: '20 min', order: 5 },
        ],
      },
    ]);

    console.log(`${courses.length} courses created`);

    // Enroll student in first two courses
    await Enrollment.insertMany([
      { student: studentUser._id, course: courses[0]._id, progress: 60 },
      { student: studentUser._id, course: courses[4]._id, progress: 20 },
    ]);

    console.log('Enrollments created');

    console.log('\n✅ Seed complete! Demo credentials:');
    console.log('   👑 Admin     — admin@lms.com      / admin123');
    console.log('   👨‍🏫 Instructor — instructor@lms.com / inst123');
    console.log('   👨‍🎓 Student   — student@lms.com   / student123\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
