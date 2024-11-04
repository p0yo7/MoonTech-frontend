import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const RequirementCard = ({ requirement }) => {
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    console.log("Comment sent:", {
      requirementId: requirement.requirement_id,
      comment: comment
    });
    setComment('');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedText(requirement.requirement_text);
  };

  const handleSaveEdit = () => {
    if (!editedText.trim()) return;
    console.log("Saving edit:", {
      requirementId: requirement.requirement_id,
      newText: editedText
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText('');
  };

  const formattedDate = new Date(requirement.requirement_timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card style={{ 
      backgroundColor: '#f8f9fa', 
      borderRadius: '5px',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }}>
      <Card.Body style={{ padding: '15px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <Form.Control
                as="textarea"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
            ) : (
              <Card.Title style={{ 
                fontSize: '16px', 
                color: '#0366d6', 
                marginBottom: '5px',
                wordBreak: 'break-word'
              }}>
                #{requirement.requirement_id} {requirement.requirement_text}
              </Card.Title>
            )}
            <Card.Text style={{ 
              fontSize: '14px', 
              color: '#586069', 
              marginBottom: '5px' 
            }}>
              Opened on {formattedDate}
            </Card.Text>
            {requirement.requirement_approved && (
              <span style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                marginLeft: '8px'
              }}>
                Approved
              </span>
            )}
          </div>
          <div>
            {isEditing ? (
              <>
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={handleSaveEdit}
                  style={{ marginRight: '5px' }}
                >
                  Save
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleEditClick}
                style={{ marginRight: '10px' }}
              >
                Edit
              </Button>
            )}
          </div>
        </div>

        <Form style={{ marginTop: '15px' }}>
          <Form.Group controlId={`comment-${requirement.requirement_id}`} style={{ marginBottom: '5px' }}>
            <Form.Control
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={handleCommentChange}
              size="sm"
            />
          </Form.Group>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSendComment}
            disabled={!comment.trim()}
          >
            Publish
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequirementCard;