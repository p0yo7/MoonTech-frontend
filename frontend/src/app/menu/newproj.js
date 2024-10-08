import React from 'react';
import { Modal, Box } from '@mui/material';
import NewProj from '../newproject/page';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%', // Aumentamos el ancho al 80% de la pantalla
  maxWidth: '800px', // Establecemos un ancho máximo
  maxHeight: '90vh', // Altura máxima del 90% del viewport
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto', // Permite scroll si el contenido es muy largo
};

const NewProjectModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <NewProj handleClose={handleClose} />
      </Box>
    </Modal>
  );
};

export default NewProjectModal;