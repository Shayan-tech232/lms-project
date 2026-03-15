import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCourses } from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import { FaRocket, FaUsers, FaBook, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    getCourses()
      .then(({ data }) => setFeaturedCourses(data.courses.slice(0, 3)))
      .catch(() => {});
  }, []);

  const features = [
    { icon: <FaRocket size={32} className="text-primary" />, title: 'Learn at Your Pace', desc: 'Access courses anytime, anywhere on any device.' },
    { icon: <FaUsers size={32} className="text-success" />, title: 'Expert Instructors', desc: 'Learn from industry professionals and experts.' },
    { icon: <FaBook size={32} className="text-warning" />, title: 'Rich Content', desc: 'Video lessons, quizzes, and hands-on projects.' },
    { icon: <FaShieldAlt size={32} className="text-danger" />, title: 'Secure Platform', desc: 'JWT authentication with role-based access control.' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0d6efd, #6610f2)',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="text-white mb-4 mb-lg-0">
              <span className="badge bg-light text-primary mb-3 px-3 py-2 fw-semibold">
                🎓 Full Stack MERN LMS
              </span>
              <h1 className="display-4 fw-bold mb-4">
                Learn, Grow &amp; Achieve with EduLearn
              </h1>
              <p className="lead mb-4 text-white-50">
                A complete Learning Management System built with React, Node.js, Express, and MongoDB.
                Join thousands of students and start your journey today.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/courses" variant="light" size="lg" className="fw-bold">
                  Browse Courses
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="lg">
                  Get Started Free
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div style={{ fontSize: '10rem', lineHeight: 1 }}>🎓</div>
              <Row className="g-3 mt-2">
                {[['500+', 'Students'], ['50+', 'Courses'], ['20+', 'Instructors']].map(([num, label]) => (
                  <Col key={label} xs={4}>
                    <div className="bg-white bg-opacity-10 rounded-3 p-3 text-white">
                      <div className="fs-4 fw-bold">{num}</div>
                      <div className="small">{label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">Why Choose EduLearn?</h2>
          <Row className="g-4">
            {features.map(({ icon, title, desc }) => (
              <Col md={3} sm={6} key={title}>
                <Card className="h-100 border-0 shadow-sm text-center p-4">
                  <div className="mb-3">{icon}</div>
                  <h5 className="fw-bold">{title}</h5>
                  <p className="text-muted small mb-0">{desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-5">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Featured Courses</h2>
              <Button as={Link} to="/courses" variant="outline-primary">View All</Button>
            </div>
            <Row className="g-4">
              {featuredCourses.map((course) => (
                <Col md={4} key={course._id}>
                  <CourseCard course={course} />
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-5 bg-primary text-white text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to Start Learning?</h2>
          <p className="lead mb-4 text-white-50">Join EduLearn and unlock your potential today.</p>
          <Button as={Link} to="/register" variant="light" size="lg" className="fw-bold">
            Create Free Account
          </Button>
        </Container>
      </section>
    </>
  );
};

export default Home;
