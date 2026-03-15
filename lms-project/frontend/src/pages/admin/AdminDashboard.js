import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Spinner, Alert, Badge, Tabs, Tab
} from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getUsers, deleteUser, getAnalytics, getCourses, deleteCourse } from '../../services/api';
import { FaUsers, FaBook, FaChartBar, FaTrash, FaUserGraduate } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, coursesRes] = await Promise.all([
        getAnalytics(), getUsers(), getCourses(),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setUsers(usersRes.data.users);
      setCourses(coursesRes.data.courses);
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      flash('User deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Permanently delete this course?')) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      flash('Course deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const roleBadge = { admin: 'danger', instructor: 'warning', student: 'success' };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">👑 Admin Dashboard</h2>
        <p className="text-muted mb-0">Welcome, {user?.name}! Full system overview.</p>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {/* Analytics Cards */}
      {analytics && (
        <Row className="g-3 mb-4">
          {[
            { label: 'Total Users', value: analytics.totalUsers, icon: <FaUsers />, color: 'primary' },
            { label: 'Students', value: analytics.totalStudents, icon: <FaUserGraduate />, color: 'success' },
            { label: 'Instructors', value: analytics.totalInstructors, icon: <FaUsers />, color: 'warning' },
            { label: 'Total Courses', value: analytics.totalCourses, icon: <FaBook />, color: 'info' },
            { label: 'Enrollments', value: analytics.totalEnrollments, icon: <FaChartBar />, color: 'danger' },
          ].map(({ label, value, icon, color }) => (
            <Col key={label} xs={6} md={4} lg={2} className="flex-grow-1">
              <Card className={`border-0 shadow-sm border-top border-4 border-${color} text-center p-3`}>
                <div className={`fs-3 text-${color} mb-1`}>{icon}</div>
                <div className="fw-bold fs-4">{value}</div>
                <div className="text-muted small">{label}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Tabs */}
      <Tabs defaultActiveKey="users" className="mb-4">
        {/* Users Tab */}
        <Tab eventKey="users" title={`Users (${users.length})`}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-dark">
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td className="fw-semibold">{u.name}</td>
                      <td className="text-muted small">{u.email}</td>
                      <td><Badge bg={roleBadge[u.role]} className="text-capitalize">{u.role}</Badge></td>
                      <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u._id !== user._id && (
                          <Button size="sm" variant="outline-danger" onClick={() => handleDeleteUser(u._id)}>
                            <FaTrash />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Courses Tab */}
        <Tab eventKey="courses" title={`Courses (${courses.length})`}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-dark">
                  <tr><th>#</th><th>Title</th><th>Category</th><th>Instructor</th><th>Price</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => (
                    <tr key={c._id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td className="fw-semibold">{c.title}</td>
                      <td><Badge bg="primary">{c.category}</Badge></td>
                      <td className="small">{c.instructor?.name || '—'}</td>
                      <td>{c.price === 0 ? <Badge bg="success">Free</Badge> : `$${c.price}`}</td>
                      <td><Badge bg={c.isPublished ? 'success' : 'secondary'}>{c.isPublished ? 'Live' : 'Draft'}</Badge></td>
                      <td>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteCourse(c._id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Analytics Tab */}
        <Tab eventKey="analytics" title="Analytics">
          {analytics && (
            <Row className="g-4 mt-1">
              <Col md={6}>
                <Card className="border-0 shadow-sm p-4">
                  <h5 className="fw-bold mb-4">📊 Platform Summary</h5>
                  <table className="table table-borderless small">
                    <tbody>
                      {[
                        ['Total Registered Users', analytics.totalUsers],
                        ['Students', analytics.totalStudents],
                        ['Instructors', analytics.totalInstructors],
                        ['Admin Accounts', analytics.totalUsers - analytics.totalStudents - analytics.totalInstructors],
                        ['Total Courses', analytics.totalCourses],
                        ['Total Enrollments', analytics.totalEnrollments],
                        ['Avg Enrollments / Course', analytics.totalCourses ? (analytics.totalEnrollments / analytics.totalCourses).toFixed(1) : 0],
                      ].map(([label, value]) => (
                        <tr key={label}>
                          <td className="text-muted">{label}</td>
                          <td className="fw-bold text-end">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm p-4">
                  <h5 className="fw-bold mb-4">👤 User Distribution</h5>
                  {[
                    { label: 'Students', value: analytics.totalStudents, total: analytics.totalUsers, color: 'success' },
                    { label: 'Instructors', value: analytics.totalInstructors, total: analytics.totalUsers, color: 'warning' },
                  ].map(({ label, value, total, color }) => (
                    <div key={label} className="mb-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{label}</span><span className="fw-semibold">{value} ({total ? Math.round(value / total * 100) : 0}%)</span>
                      </div>
                      <div className="progress" style={{ height: 10 }}>
                        <div className={`progress-bar bg-${color}`} style={{ width: `${total ? (value / total * 100) : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
