import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMyCourses } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaChartLine, FaUser } from 'react-icons/fa';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyCourses()
      .then(({ data }) => setEnrollments(data.enrollments))
      .catch(() => setError('Failed to load your courses.'))
      .finally(() => setLoading(false));
  }, []);

  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">👋 Welcome back, {user?.name}!</h2>
          <p className="text-muted mb-0">Here's your learning overview.</p>
        </div>
        <Button as={Link} to="/courses" variant="primary">Browse More Courses</Button>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-5">
        {[
          { label: 'Enrolled Courses', value: enrollments.length, icon: <FaBook />, color: 'primary' },
          { label: 'Avg. Progress', value: `${avgProgress}%`, icon: <FaChartLine />, color: 'success' },
          { label: 'Role', value: 'Student', icon: <FaUser />, color: 'info' },
        ].map(({ label, value, icon, color }) => (
          <Col md={4} key={label}>
            <Card className={`border-0 shadow-sm border-start border-4 border-${color}`}>
              <Card.Body className="d-flex align-items-center gap-3">
                <div className={`fs-3 text-${color}`}>{icon}</div>
                <div>
                  <div className="small text-muted">{label}</div>
                  <div className="fw-bold fs-4">{value}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* My Courses */}
      <h4 className="fw-bold mb-3">📚 My Courses</h4>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : enrollments.length === 0 ? (
        <Card className="border-0 shadow-sm text-center p-5">
          <p className="text-muted fs-5 mb-3">You haven't enrolled in any courses yet.</p>
          <Button as={Link} to="/courses" variant="primary">Browse Courses</Button>
        </Card>
      ) : (
        <Row className="g-4">
          {enrollments.map(({ _id, course, progress }) => (
            <Col md={4} key={_id}>
              <Card className="h-100 border-0 shadow-sm">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: 120, background: 'linear-gradient(135deg,#0d6efd22,#6610f222)', fontSize: '3rem' }}
                >🎓</div>
                <Card.Body>
                  <Badge bg="primary" className="mb-2">{course?.category}</Badge>
                  <h6 className="fw-bold">{course?.title}</h6>
                  <p className="small text-muted">By {course?.instructor?.name}</p>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Progress</span><span className="fw-semibold">{progress}%</span>
                    </div>
                    <ProgressBar now={progress} variant={progress === 100 ? 'success' : 'primary'} />
                  </div>
                  {progress === 100 && <Badge bg="success">✓ Completed</Badge>}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StudentDashboard;
