import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      if (user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#0d6efd,#6610f2)', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '2rem 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="text-center mb-4">
              <FaGraduationCap size={48} className="text-white mb-2" />
              <h3 className="text-white fw-bold">EduLearn LMS</h3>
            </div>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-1">Create an Account</h4>
                <p className="text-muted small mb-4">Join thousands of learners today</p>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Full Name</Form.Label>
                    <Form.Control
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
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
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Register As</Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleChange}>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </Form.Select>
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold small">Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Create Account'}
                  </Button>
                </Form>

                <hr />
                <p className="text-center small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold">Login here</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
