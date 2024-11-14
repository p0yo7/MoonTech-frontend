import React, { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProjectForm from '../newproject/page'; // Assuming the file is in the same directory

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '1200px',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

const NewProjectModal = ({ open, handleClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmClose = () => {
    setShowConfirm(true);
  };

  const confirmClose = () => {
    setShowConfirm(false);
    handleClose();
  };

  const cancelClose = () => {
    setShowConfirm(false);
  };

  return (
    <Modal open={open} onClose={handleConfirmClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button onClick={handleConfirmClose} sx={{ minWidth: 'auto', p: 0 }}>
            <CloseIcon />
          </Button>
        </Box>

        <ProjectForm />

        {showConfirm && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to close without saving?
            </Typography>
            <Button
              onClick={confirmClose}
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
            >
              Yes, close
            </Button>
            <Button
              onClick={cancelClose}
              variant="outlined"
            >
              No, go back
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default NewProjectModal;