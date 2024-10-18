import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const RequirementCard = ({ requirement }) => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSendComment = () => {
    console.log("Comment sent:", comment);
    setComment(''); // Limpiar el campo de comentario
  };

  const formattedDate = new Date(requirement.requirement_timestamp).toLocaleString();

  return (
    <Card style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
      <Card.Body style={{ padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Card.Title style={{ fontSize: '16px', color: '#0366d6', marginBottom: '5px' }}>
              #{requirement.id} {requirement.requirement_text}
            </Card.Title>
            <Card.Text style={{ fontSize: '14px', color: '#586069', marginBottom: '5px' }}>
              Opened on {formattedDate}
            </Card.Text>
          </div>
          <div>
            <Button variant="outline-primary" size="sm" style={{ marginRight: '10px' }}>
              Edit
            </Button>
          </div>
        </div>
        {/* Comentarios */}
        <Form style={{ marginTop: '10px' }}>
          <Form.Group controlId={`comment-${requirement.id}`} style={{ marginBottom: '5px' }}>
            <Form.Control
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={handleCommentChange}
              size="sm"
            />
          </Form.Group>
          <Button variant="primary" size="sm" onClick={handleSendComment}>
            Publish
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequirementCard;
