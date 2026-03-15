import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#0d6efd,#6610f2)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <div className="text-center mb-4">
              <FaGraduationCap size={48} className="text-white mb-2" />
              <h3 className="text-white fw-bold">EduLearn LMS</h3>
            </div>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-1">Welcome back!</h4>
                <p className="text-muted small mb-4">Login to your account</p>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
                  </Button>
                </Form>

                <hr />
                <p className="text-center small mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-semibold">Register here</Link>
                </p>

                {/* Demo credentials */}
                <div className="mt-3 p-3 bg-light rounded-3">
                  <p className="small fw-bold mb-2">Demo Credentials:</p>
                  <p className="small mb-1">👑 Admin: admin@lms.com / admin123</p>
                  <p className="small mb-1">👨‍🏫 Instructor: instructor@lms.com / inst123</p>
                  <p className="small mb-0">👨‍🎓 Student: student@lms.com / student123</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
