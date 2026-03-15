import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Form, InputGroup, Button, Spinner, Alert
} from 'react-bootstrap';
import { getCourses, enrollInCourse, getMyCourses } from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import { useAuth } from '../../context/AuthContext';
import { FaSearch } from 'react-icons/fa';

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Other'];

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [enrollMsg, setEnrollMsg] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await getCourses(params);
      setCourses(data.courses);
    } catch {
      setError('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [category]);

  useEffect(() => {
    if (user?.role === 'student') {
      getMyCourses()
        .then(({ data }) => setEnrolledIds(data.enrollments.map((e) => e.course._id)))
        .catch(() => {});
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      setEnrolledIds((prev) => [...prev, courseId]);
      setEnrollMsg('Successfully enrolled!');
      setTimeout(() => setEnrollMsg(''), 3000);
    } catch (err) {
      setEnrollMsg(err.response?.data?.message || 'Enrollment failed.');
      setTimeout(() => setEnrollMsg(''), 3000);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-2">All Courses</h1>
      <p className="text-muted mb-4">Explore our library of courses taught by expert instructors.</p>

      {enrollMsg && <Alert variant={enrolledIds.length ? 'success' : 'danger'}>{enrollMsg}</Alert>}

      {/* Filters */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" variant="primary"><FaSearch /></Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={6}>
          <div className="d-flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? 'primary' : 'outline-secondary'}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Results */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : courses.length === 0 ? (
        <Alert variant="info">No courses found. Try a different search or category.</Alert>
      ) : (
        <>
          <p className="text-muted mb-3">{courses.length} course(s) found</p>
          <Row className="g-4">
            {courses.map((course) => (
              <Col md={4} sm={6} key={course._id}>
                <CourseCard
                  course={course}
                  onEnroll={user?.role === 'student' ? handleEnroll : null}
                  enrolled={enrolledIds.includes(course._id)}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Courses;
