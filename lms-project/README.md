# 🎓 EduLearn LMS — Full Stack MERN Application

## 📋 Project Overview

EduLearn LMS is a full-featured web application that supports three user roles — **Student**, **Instructor**, and **Admin** — each with dedicated dashboards and role-based access control. The system allows students to browse and enroll in courses, instructors to create and manage course content, and admins to oversee the entire platform.

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|---|---|
| React JS 18 | UI library |
| React Router v6 | Client-side routing |
| Axios | HTTP requests / API calls |
| React Bootstrap + Bootstrap 5 | UI components & styling |
| React Icons | Icon library |
| Context API | Global state management (Auth) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JSON Web Tokens (JWT) | Authentication |
| Bcrypt.js | Password hashing |
| Dotenv | Environment variable management |
| Morgan | HTTP request logger |
| CORS | Cross-origin resource sharing |

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Student** | Register, login, browse courses, enroll, track progress, manage profile |
| **Instructor** | Create/edit/delete courses, upload lessons, manage course content |
| **Admin** | View all users, delete users, manage all courses, view platform analytics |

---

## 📄 Pages

### Public Pages
- `/` — Home page with hero section and featured courses
- `/about` — Project info, tech stack, and marking scheme
- `/courses` — Course listing with search and category filters
- `/courses/:id` — Course detail page with lessons and enrollment
- `/login` — User login
- `/register` — User registration

### Protected Dashboard Pages
- `/student/dashboard` — Enrolled courses with progress tracking
- `/student/profile` — Profile management
- `/instructor/dashboard` — Course management with create/edit/delete/add lesson
- `/admin/dashboard` — Users, courses, and analytics tabs

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    Register a new user
POST   /api/auth/login       Login user, returns JWT
GET    /api/auth/profile     Get logged-in user profile  [Protected]
PUT    /api/auth/profile     Update profile              [Protected]
```

### Courses
```
GET    /api/courses                      Get all published courses
GET    /api/courses/:id                  Get single course
GET    /api/courses/instructor-courses   Get instructor's own courses [Instructor]
POST   /api/courses                      Create course               [Instructor/Admin]
PUT    /api/courses/:id                  Update course               [Instructor/Admin]
DELETE /api/courses/:id                  Delete course               [Instructor/Admin]
POST   /api/courses/:id/lessons          Add lesson to course        [Instructor]
```

### Users (Admin)
```
GET    /api/users            Get all users   [Admin]
GET    /api/users/analytics  Get analytics   [Admin]
DELETE /api/users/:id        Delete user     [Admin]
```

### Enrollments
```
POST   /api/enrollments/enroll       Enroll in a course          [Student]
GET    /api/enrollments/my-courses   Get student's enrollments   [Student]
PUT    /api/enrollments/:id/progress Update lesson progress      [Student]
```

---

## 🗄️ Database Models

### User
```js
{ name, email, password (hashed), role: ['student','instructor','admin'], timestamps }
```

### Course
```js
{ title, description, instructor (ref: User), category, price, lessons[], isPublished, timestamps }
```

### Enrollment
```js
{ student (ref: User), course (ref: Course), progress, completedLessons[], enrolledAt, timestamps }
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas URI
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/Shaytech232/lms-project.git
cd lms-project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms_db
JWT_SECRET=ShayanMERN_LMS_2024_JWT_Secret_Key_!@#$
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `/frontend`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## 🔐 Authentication

- Passwords are hashed using **Bcrypt** (salt rounds: 10) before saving to the database.
- **JWT tokens** are issued on login/register and stored in `localStorage`.
- Every protected API route validates the token via the `protect` middleware.
- Role-based access is enforced by the `authorize(...roles)` middleware.
---

## 🔐 Demo Credentials

After running `node seed.js`:

| Role | Email | Password |
|---|---|---|
| 👑 Admin | admin@lms.com | admin123 |
| 👨‍🏫 Instructor | instructor@lms.com | inst123 |
| 👨‍🎓 Student | student@lms.com | student123 |

---

## 📂 Project Structure

```
lms-project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── CourseCard.js
    │   │   └── layout/
    │   │       ├── Footer.js
    │   │       └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   └── AdminDashboard.js
    │   │   ├── instructor/
    │   │   │   └── InstructorDashboard.js
    │   │   ├── public/
    │   │   │   ├── About.js
    │   │   │   ├── CourseDetail.js
    │   │   │   ├── Courses.js
    │   │   │   ├── Home.js
    │   │   │   ├── Login.js
    │   │   │   ├── Register.js
    │   │   │   └── Unauthorized.js
    │   │   └── student/
    │   │       ├── Profile.js
    │   │       └── StudentDashboard.js
    │   ├── routes/
    │   │   └── ProtectedRoute.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.css
    │   ├── App.js
    │   └── index.js
    ├── .env
    ├── .gitignore
    └── package.json
