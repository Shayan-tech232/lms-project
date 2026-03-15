import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage({ text: 'Passwords do not match.', type: 'danger' });
    }
    setLoading(true);
    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.password) payload.password = formData.password;
      const { data } = await updateProfile(payload);
      updateUser(data.user);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setFormData((p) => ({ ...p, password: '', confirmPassword: '' }));
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const roleBadge = { admin: 'danger', instructor: 'warning', student: 'success' };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">My Profile</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-4">
            <FaUserCircle size={80} className="text-primary mb-3 mx-auto" />
            <h5 className="fw-bold">{user?.name}</h5>
            <p className="text-muted small">{user?.email}</p>
            <Badge bg={roleBadge[user?.role]} className="text-capitalize px-3 py-2">
              {user?.role}
            </Badge>
            <p className="text-muted small mt-3 mb-0">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Edit Profile</h5>
              {message.text && (
                <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible className="py-2 small">
                  {message.text}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Full Name</Form.Label>
                  <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Email Address</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <hr />
                <p className="text-muted small">Leave password fields blank to keep current password.</p>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small">New Password</Form.Label>
                      <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold small">Confirm Password</Form.Label>
                      <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
