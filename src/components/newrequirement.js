import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '400px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const NewRequirementModal = ({ open, handleClose, projectId, ownerId }) => {
  const [requirementText, setRequirementText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const postRequirement = async (text) => {
    const requirementData = {
      ProjectID: projectId,
      OwnerID: ownerId,
      RequirementDescription: text,
      approved: false
    };
    console.log(requirementData);
    try {
      const response = await fetch(`http://localhost:8080/createRequirement`, {
        method: 'POST',
        headers: {
          'Authorization': `${Cookies.get('authToken')}`,
        },
        body: JSON.stringify(requirementData),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error posting requirement:', error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!requirementText.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await postRequirement(requirementText);
      setRequirementText('');
      handleClose();
    } catch (error) {
      setError('Failed to add requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <CloseIcon />
          </button>
        </div>
       
        <h2>Add Requirement</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Requirement Text"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            disabled={isSubmitting}
            error={!!error}
            helperText={error}
            multiline
            rows={4}
            placeholder="Enter your requirement description here..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '8px' }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Requirement'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewRequirementModal;