'use client'

import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CircleButton = ({ onClick, className }) => {
  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={onClick}
      className={className} // Prop para personalizarlo
      sx={{
        width: 56,
        height: 56,
        backgroundColor: '#2196f3',
        '&:hover': {
          backgroundColor: '#1976d2',
        },
      }}
    >
      <AddIcon sx={{ color: 'white' }} />
    </Fab>
  );
};

export default CircleButton;