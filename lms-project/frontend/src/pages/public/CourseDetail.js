import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Badge, Spinner, Alert, ListGroup, Accordion
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, enrollInCourse, getMyCourses } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaTag, FaBookOpen, FaDollarSign } from 'react-icons/fa';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getCourse(id);
        setCourse(data.course);

        if (user?.role === 'student') {
          const { data: myCourses } = await getMyCourses();
          const ids = myCourses.enrollments.map((e) => e.course._id);
          setEnrolled(ids.includes(id));
        }
      } catch {
        setMessage({ text: 'Failed to load course.', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await enrollInCourse(id);
      setEnrolled(true);
      setMessage({ text: 'Successfully enrolled! Go to your dashboard to start learning.', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Enrollment failed.', type: 'danger' });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  if (!course) return <Container className="py-5"><Alert variant="danger">Course not found.</Alert></Container>;

  return (
    <Container className="py-5">
      {message.text && <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>{message.text}</Alert>}
      <Row className="g-4">
        <Col lg={8}>
          {/* Course Header */}
          <div className="mb-4">
            <Badge bg="primary" className="mb-2">
              <FaTag className="me-1" />{course.category}
            </Badge>
            <h1 className="fw-bold">{course.title}</h1>
            <p className="lead text-muted">{course.description}</p>
            <div className="d-flex gap-4 text-muted small flex-wrap">
              <span><FaUser className="me-1" />{course.instructor?.name}</span>
              <span><FaBookOpen className="me-1" />{course.lessons?.length || 0} Lessons</span>
              <span><FaDollarSign className="me-1" />{course.price === 0 ? 'Free' : `$${course.price}`}</span>
            </div>
          </div>

          {/* Curriculum */}
          <h4 className="fw-bold mb-3">Course Curriculum</h4>
          {course.lessons?.length > 0 ? (
            <Accordion>
              {course.lessons.map((lesson, idx) => (
                <Accordion.Item eventKey={String(idx)} key={lesson._id || idx}>
                  <Accordion.Header>
                    <span className="me-2 text-muted">Lesson {idx + 1}:</span> {lesson.title}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-1">{lesson.content || 'No description provided.'}</p>
                    {lesson.duration && <Badge bg="secondary">⏱ {lesson.duration}</Badge>}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <Alert variant="info">No lessons available yet.</Alert>
          )}
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          <Card className="shadow border-0 sticky-top" style={{ top: '80px' }}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: 200, background: 'linear-gradient(135deg,#0d6efd22,#6610f222)', fontSize: '5rem' }}
            >🎓</div>
            <Card.Body>
              <h2 className="fw-bold text-primary mb-3">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </h2>
              {enrolled ? (
                <Button variant="success" className="w-100 mb-3" disabled>✓ Already Enrolled</Button>
              ) : user?.role === 'student' ? (
                <Button variant="primary" className="w-100 mb-3" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? <Spinner size="sm" animation="border" /> : 'Enroll Now'}
                </Button>
              ) : !user ? (
                <Button variant="primary" className="w-100 mb-3" onClick={() => navigate('/login')}>
                  Login to Enroll
                </Button>
              ) : null}
              <ListGroup variant="flush" className="small">
                <ListGroup.Item><FaBookOpen className="me-2 text-primary" />{course.lessons?.length || 0} lessons</ListGroup.Item>
                <ListGroup.Item><FaUser className="me-2 text-success" />Instructor: {course.instructor?.name}</ListGroup.Item>
                <ListGroup.Item><FaTag className="me-2 text-warning" />Category: {course.category}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetail;
