import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <Container className="text-center py-5">
    <div style={{ fontSize: '5rem' }}>🚫</div>
    <h2 className="fw-bold mt-3">Access Denied</h2>
    <p className="text-muted lead">You don't have permission to access this page.</p>
    <Button as={Link} to="/" variant="primary">Go Home</Button>
  </Container>
);

export default Unauthorized;
