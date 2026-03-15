import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaTag } from 'react-icons/fa';

const CourseCard = ({ course, onEnroll, enrolled }) => {
  const { _id, title, description, instructor, category, price, lessons } = course;

  return (
    <Card className="h-100 shadow-sm border-0 course-card">
      <div
        className="card-img-top d-flex align-items-center justify-content-center"
        style={{
          height: '160px',
          background: 'linear-gradient(135deg, #0d6efd22, #6610f222)',
          fontSize: '3rem',
        }}
      >
        🎓
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="primary" className="text-capitalize">
            <FaTag className="me-1" />
            {category}
          </Badge>
          <span className="fw-bold text-success">
            {price === 0 ? 'Free' : `$${price}`}
          </span>
        </div>
        <Card.Title className="fs-6 fw-bold">{title}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {description?.length > 100 ? description.substring(0, 100) + '...' : description}
        </Card.Text>
        <div className="text-muted small mb-3">
          <FaUser className="me-1" />
          {instructor?.name || 'Unknown Instructor'}
          {lessons && (
            <span className="ms-3">📚 {lessons.length} lessons</span>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to={`/courses/${_id}`} variant="outline-primary" size="sm" className="flex-grow-1">
            View Details
          </Button>
          {onEnroll && !enrolled && (
            <Button variant="primary" size="sm" onClick={() => onEnroll(_id)} className="flex-grow-1">
              Enroll
            </Button>
          )}
          {enrolled && (
            <Button variant="success" size="sm" disabled className="flex-grow-1">
              ✓ Enrolled
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
