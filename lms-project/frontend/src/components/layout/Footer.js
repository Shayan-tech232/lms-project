import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-dark text-light py-5 mt-auto">
    <Container>
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <h5 className="fw-bold mb-3">
            <FaGraduationCap className="me-2 text-primary" />
            EduLearn LMS
          </h5>
          <p className="text-secondary small">
            A full-stack Learning Management System built with the MERN stack.
            Empowering students, instructors, and administrators.
          </p>
        </Col>
        <Col md={2} className="mb-3">
          <h6 className="fw-bold mb-3">Navigation</h6>
          <ul className="list-unstyled small">
            <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
            <li><Link to="/about" className="text-secondary text-decoration-none">About</Link></li>
            <li><Link to="/courses" className="text-secondary text-decoration-none">Courses</Link></li>
          </ul>
        </Col>
        <Col md={3} className="mb-3">
          <h6 className="fw-bold mb-3">Account</h6>
          <ul className="list-unstyled small">
            <li><Link to="/login" className="text-secondary text-decoration-none">Login</Link></li>
            <li><Link to="/register" className="text-secondary text-decoration-none">Register</Link></li>
          </ul>
        </Col>
        <Col md={3} className="mb-3">
          <h6 className="fw-bold mb-3">Technologies</h6>
          <p className="text-secondary small mb-0">React JS · Node.js · Express · MongoDB · JWT</p>
        </Col>
      </Row>
      <hr className="border-secondary" />
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <p className="text-secondary small mb-0">© 2026 EduLearn LMS — MERN Stack Final Project</p>
        <div className="d-flex gap-3">
          <FaGithub className="text-secondary fs-5" />
          <FaLinkedin className="text-secondary fs-5" />
        </div>
      </div>
    </Container>
  </footer>
);

export default Footer;
