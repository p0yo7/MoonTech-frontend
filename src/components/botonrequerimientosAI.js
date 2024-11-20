'use client';

import React from 'react';
import { Fab } from '@mui/material';

const CircleButton = ({ onClick, className }) => {
  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={onClick}
      className={className} // Prop para personalizarlo
      sx={{
        position: 'fixed', // Posiciona el botón de forma fija
        bottom: 16, // Espaciado desde el borde inferior
        right: 16, // Espaciado desde el borde derecho
        width: 56,
        height: 56,
        backgroundColor: '#2196f3',
        '&:hover': {
          backgroundColor: '#1976d2',
        },
        fontSize: '24px', // Ajustar tamaño del emoji
        fontWeight: 'bold', // Hacer el emoji más visible si es necesario
      }}
    >
      ✨
    </Fab>
  );
};

export default CircleButton;
