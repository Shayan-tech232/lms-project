import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────
export const registerUser   = (data)    => API.post('/auth/register', data);
export const loginUser      = (data)    => API.post('/auth/login', data);
export const getProfile     = ()        => API.get('/auth/profile');
export const updateProfile  = (data)    => API.put('/auth/profile', data);

// ── Courses ───────────────────────────────────────────
export const getCourses             = (params) => API.get('/courses', { params });
export const getCourse              = (id)     => API.get(`/courses/${id}`);
export const createCourse           = (data)   => API.post('/courses', data);
export const updateCourse           = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse           = (id)     => API.delete(`/courses/${id}`);
export const addLesson              = (id, data) => API.post(`/courses/${id}/lessons`, data);
export const getInstructorCourses   = ()       => API.get('/courses/instructor-courses');

// ── Users (Admin) ─────────────────────────────────────
export const getUsers       = ()    => API.get('/users');
export const deleteUser     = (id)  => API.delete(`/users/${id}`);
export const getAnalytics   = ()    => API.get('/users/analytics');

// ── Enrollments ───────────────────────────────────────
export const enrollInCourse = (courseId) => API.post('/enrollments/enroll', { courseId });
export const getMyCourses   = ()         => API.get('/enrollments/my-courses');
export const updateProgress = (id, data) => API.put(`/enrollments/${id}/progress`, data);

export default API;
