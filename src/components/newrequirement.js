import React from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const NewRequirementModal = ({ open, handleClose }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica para agregar el requerimiento
    handleClose(); // Cierra el modal después de agregar el requerimiento
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleClose} style={{ background: 'none', border: 'none' }}>
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
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary">Add</Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewRequirementModal;
