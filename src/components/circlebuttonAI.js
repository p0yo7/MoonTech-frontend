'use client';

import React from 'react';
import { Fab } from '@mui/material';
import Cookies from 'js-cookie';

const CircleButtonAI = ({ onClick }) => {
  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={onClick}
      sx={{
        position: 'fixed', // Posiciona el botón en la esquina inferior derecha
        bottom: 16,
        right: 16,
        width: 56,
        height: 56,
        backgroundColor: '#2196f3',
        '&:hover': {
          backgroundColor: '#1976d2',
        },
      }}
    >
      ✨
    </Fab>
  );
};

const PostRequirementAIButton = ({ projectId }) => {
  const postRequirement = async () => {
    try {
      // Datos a enviar
      const requirementData = { ProjectID: projectId };

      // Realiza la petición POST
      const response = await fetch('http://localhost:5000/ai/getAIRequirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${Cookies.get('authToken')}`, // Obtén el token de las cookies
        },
        body: JSON.stringify(requirementData),
      });

      // Manejo de la respuesta
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      alert('Requerimiento generado con éxito.');
    } catch (error) {
      console.error('Error al generar el requerimiento:', error);
      alert('Hubo un error al generar el requerimiento.');
    }
  };

  return <CircleButtonAI onClick={postRequirement} />;
};

export default PostRequirementAIButton;
