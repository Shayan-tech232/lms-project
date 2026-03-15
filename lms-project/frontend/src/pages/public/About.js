import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaReact, FaNodeJs, FaDatabase, FaLock } from 'react-icons/fa';
import { SiMongodb, SiExpress } from 'react-icons/si';

const About = () => {
  const techStack = [
    { icon: <FaReact size={40} className="text-info" />, name: 'React JS', desc: 'Frontend UI library' },
    { icon: <FaNodeJs size={40} className="text-success" />, name: 'Node.js', desc: 'Backend runtime' },
    { icon: <SiExpress size={40} />, name: 'Express.js', desc: 'Web framework' },
    { icon: <SiMongodb size={40} className="text-success" />, name: 'MongoDB', desc: 'NoSQL database' },
    { icon: <FaLock size={40} className="text-warning" />, name: 'JWT Auth', desc: 'Secure authentication' },
    { icon: <FaDatabase size={40} className="text-primary" />, name: 'Mongoose', desc: 'ODM for MongoDB' },
  ];

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="fw-bold display-5 mb-3">About EduLearn LMS</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: 600 }}>
            A full-stack Learning Management System demonstrating real-world industry standards
            built as a MERN Stack Final Project.
          </p>
        </Col>
      </Row>

      {/* Project Info */}
      <Row className="g-4 mb-5">
        {[
          { label: 'Assessment', value: 'Final Project', variant: 'primary' },
          { label: 'Course', value: 'MERN Stack Web Development', variant: 'success' },
          { label: 'Total Marks', value: '100', variant: 'warning' },
          { label: 'Duration', value: '2–3 Weeks', variant: 'info' },
        ].map(({ label, value, variant }) => (
          <Col md={3} sm={6} key={label}>
            <Card className="text-center border-0 shadow-sm p-3 h-100">
              <Badge bg={variant} className="mx-auto mb-2 px-3 py-2">{label}</Badge>
              <h5 className="fw-bold mb-0">{value}</h5>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tech Stack */}
      <h2 className="fw-bold text-center mb-4">Technologies Used</h2>
      <Row className="g-4 mb-5">
        {techStack.map(({ icon, name, desc }) => (
          <Col md={2} sm={4} xs={6} key={name}>
            <Card className="text-center border-0 shadow-sm p-3 h-100">
              <div className="mb-2">{icon}</div>
              <h6 className="fw-bold mb-1">{name}</h6>
              <p className="text-muted small mb-0">{desc}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Roles */}
      <h2 className="fw-bold text-center mb-4">User Roles</h2>
      <Row className="g-4 mb-5">
        {[
          { role: 'Student', emoji: '👨‍🎓', color: 'success', perms: ['Browse & enroll in courses', 'View enrolled courses', 'Track progress', 'Manage profile'] },
          { role: 'Instructor', emoji: '👨‍🏫', color: 'warning', perms: ['Create & manage courses', 'Upload lessons', 'Edit course content', 'Monitor enrollments'] },
          { role: 'Admin', emoji: '👑', color: 'danger', perms: ['Manage all users', 'Oversee all courses', 'View analytics', 'Delete any content'] },
        ].map(({ role, emoji, color, perms }) => (
          <Col md={4} key={role}>
            <Card className={`border-${color} border-2 h-100 shadow-sm`}>
              <Card.Header className={`bg-${color} text-white fw-bold fs-5`}>
                {emoji} {role}
              </Card.Header>
              <Card.Body>
                <ul className="mb-0 ps-3">
                  {perms.map((p) => <li key={p} className="mb-1 small">{p}</li>)}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Marking Scheme */}
      <h2 className="fw-bold text-center mb-4">Marking Scheme</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>Criteria</th><th className="text-end">Marks</th></tr>
                </thead>
                <tbody>
                  {[
                    ['UI/UX Design', 15], ['React Implementation', 15],
                    ['Backend API Development', 20], ['Database Design', 15],
                    ['Authentication & Security', 15], ['Role-Based Functionality', 10],
                    ['Code Quality & Structure', 5], ['Deployment & Testing', 5],
                  ].map(([c, m]) => (
                    <tr key={c}>
                      <td>{c}</td>
                      <td className="text-end fw-semibold">{m}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-primary">
                  <tr><th>Total</th><th className="text-end">100</th></tr>
                </tfoot>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
