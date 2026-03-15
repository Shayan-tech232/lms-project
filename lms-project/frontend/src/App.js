import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppNavbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Courses from './pages/public/Courses';
import CourseDetail from './pages/public/CourseDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Unauthorized from './pages/public/Unauthorized';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import Profile from './pages/student/Profile';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const Layout = ({ children }) => (
  <div className="d-flex flex-column min-vh-100">
    <AppNavbar />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/courses" element={<Layout><Courses /></Layout>} />
          <Route path="/courses/:id" element={<Layout><CourseDetail /></Layout>} />
          <Route path="/unauthorized" element={<Layout><Unauthorized /></Layout>} />

          {/* Auth Routes (no footer/navbar wrapper for cleaner look) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <Layout><StudentDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute roles={['student', 'instructor', 'admin']}>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute roles={['instructor']}>
                <Layout><InstructorDashboard /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin']}>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="text-center py-5">
                <div style={{ fontSize: '5rem' }}>404</div>
                <h2 className="fw-bold">Page Not Found</h2>
              </div>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
