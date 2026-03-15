import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Modal, Form
} from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getInstructorCourses, createCourse, updateCourse, deleteCourse, addLesson } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaBook, FaUsers } from 'react-icons/fa';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Other'];

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [courseForm, setCourseForm] = useState({ title: '', description: '', category: 'Web Development', price: 0, isPublished: false });
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', duration: '' });

  const fetchCourses = () => {
    getInstructorCourses()
      .then(({ data }) => setCourses(data.courses))
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setCourseForm({ title: '', description: '', category: 'Web Development', price: 0, isPublished: false });
    setShowCourseModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setCourseForm({ title: course.title, description: course.description, category: course.category, price: course.price, isPublished: course.isPublished });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, courseForm);
        setSuccessMsg('Course updated successfully!');
      } else {
        await createCourse(courseForm);
        setSuccessMsg('Course created successfully!');
      }
      setShowCourseModal(false);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setSuccessMsg('Course deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleAddLesson = async () => {
    setSaving(true);
    try {
      await addLesson(selectedCourseId, lessonForm);
      setSuccessMsg('Lesson added!');
      setShowLessonModal(false);
      fetchCourses();
      setLessonForm({ title: '', content: '', duration: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lesson.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">👨‍🏫 Instructor Dashboard</h2>
          <p className="text-muted mb-0">Welcome, {user?.name}! Manage your courses below.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}><FaPlus className="me-2" />Create Course</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-primary">
            <Card.Body className="d-flex align-items-center gap-3">
              <FaBook className="fs-3 text-primary" />
              <div><div className="small text-muted">Total Courses</div><div className="fw-bold fs-4">{courses.length}</div></div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-success">
            <Card.Body className="d-flex align-items-center gap-3">
              <FaUsers className="fs-3 text-success" />
              <div>
                <div className="small text-muted">Published</div>
                <div className="fw-bold fs-4">{courses.filter((c) => c.isPublished).length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-warning">
            <Card.Body className="d-flex align-items-center gap-3">
              <FaBook className="fs-3 text-warning" />
              <div>
                <div className="small text-muted">Total Lessons</div>
                <div className="fw-bold fs-4">{courses.reduce((s, c) => s + (c.lessons?.length || 0), 0)}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Courses Table */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : courses.length === 0 ? (
        <Card className="border-0 shadow-sm text-center p-5">
          <p className="text-muted mb-3">You haven't created any courses yet.</p>
          <Button variant="primary" onClick={openCreateModal}><FaPlus className="me-2" />Create Your First Course</Button>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Title</th><th>Category</th><th>Price</th><th>Lessons</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td className="fw-semibold">{course.title}</td>
                    <td><Badge bg="primary">{course.category}</Badge></td>
                    <td>{course.price === 0 ? <Badge bg="success">Free</Badge> : `$${course.price}`}</td>
                    <td>{course.lessons?.length || 0}</td>
                    <td>
                      <Badge bg={course.isPublished ? 'success' : 'secondary'}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => openEditModal(course)}>
                          <FaEdit />
                        </Button>
                        <Button size="sm" variant="outline-success" onClick={() => { setSelectedCourseId(course._id); setShowLessonModal(true); }}>
                          + Lesson
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteCourse(course._id)}>
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Course Modal */}
      <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingCourse ? 'Edit Course' : 'Create New Course'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Course Title</Form.Label>
              <Form.Control value={courseForm.title} onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Complete React Bootcamp" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={courseForm.description} onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))} />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Category</Form.Label>
                  <Form.Select value={courseForm.category} onChange={(e) => setCourseForm((p) => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Price ($)</Form.Label>
                  <Form.Control type="number" min="0" value={courseForm.price} onChange={(e) => setCourseForm((p) => ({ ...p, price: Number(e.target.value) }))} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Check type="switch" label="Publish this course" checked={courseForm.isPublished} onChange={(e) => setCourseForm((p) => ({ ...p, isPublished: e.target.checked }))} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCourseModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveCourse} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : editingCourse ? 'Save Changes' : 'Create Course'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lesson Modal */}
      <Modal show={showLessonModal} onHide={() => setShowLessonModal(false)}>
        <Modal.Header closeButton><Modal.Title>Upload Lesson</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Lesson Title</Form.Label>
              <Form.Control value={lessonForm.title} onChange={(e) => setLessonForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Introduction to React" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Content / Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={lessonForm.content} onChange={(e) => setLessonForm((p) => ({ ...p, content: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Duration</Form.Label>
              <Form.Control value={lessonForm.duration} onChange={(e) => setLessonForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 15 min" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLessonModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddLesson} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : 'Add Lesson'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InstructorDashboard;
