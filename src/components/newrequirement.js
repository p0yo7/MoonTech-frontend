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

const NewRequirementModal = ({ open, handleClose, projectId, onAddRequirement }) => {
  const [requirementText, setRequirementText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const newRequirement = {
      ProjectID: parseInt(projectId, 10),
      OwnerID: parseInt(Cookies.get("userID"), 10),
      RequirementDescription: requirementText,
      approved: false
    };

    try {
      const response = await fetch('http://localhost:8080/createRequirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${Cookies.get("authToken")}`
        },
        body: JSON.stringify(newRequirement),
      });

      if (!response.ok) {
        throw new Error(`Error al agregar el requerimiento: ${response.status}`);
      }

      const result = await response.json();
      
      // Asegúrate de que el resultado tenga todos los campos necesarios
      const formattedResult = {
        ...result,
        ProjectID: parseInt(projectId, 10),
        OwnerID: parseInt(Cookies.get("userID"), 10),
        RequirementDescription: requirementText,
        approved: false,
        ...newRequirement // Mantén los datos originales si el servidor no los devuelve
      };

      // Limpia el formulario
      setRequirementText("");
      
      // Actualiza el estado del padre inmediatamente
      onAddRequirement(formattedResult);
      
      // Cierra el modal
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el requerimiento. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      aria-labelledby="modal-title"
    >
      <Box sx={style}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <CloseIcon />
          </button>
        </div>
        <h2 id="modal-title">Add Requirement</h2>
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
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting || !requirementText.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewRequirementModal;