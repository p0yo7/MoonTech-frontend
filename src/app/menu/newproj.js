import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NuevoProyecto from '../newproject/page';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

const NewProjectModal = ({ open, handleClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmClose = () => {
    setShowConfirm(true); // Muestra la confirmación antes de cerrar
  };

  const confirmClose = () => {
    setShowConfirm(false);
    handleClose(); // Llama a la función handleClose para cerrar el modal
  };

  const cancelClose = () => {
    setShowConfirm(false); // Cancela el cierre
  };

  return (
    <Modal open={open} onClose={handleConfirmClose}>
      <Box sx={style}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleConfirmClose}
            className="close-button" // Clase CSS para el botón
          >
            <CloseIcon />
          </button>
        </div>

        <NuevoProyecto handleClose={handleConfirmClose} />

        {showConfirm && (
          <div className="confirm-close">
            <p>Are you sure you want to close without saving?</p>
            <button onClick={confirmClose} className="confirm-button">Yes, close</button>
            <button onClick={cancelClose} className="cancel-button">No, go back</button>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default NewProjectModal;
