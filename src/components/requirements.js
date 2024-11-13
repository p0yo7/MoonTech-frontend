'use client'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material'

export default function TarjetaRequerimiento({ requirement = { requirement_id: '', requirement_text: '', requirement_approved: false, requirement_timestamp: '' } }) {
  const [estado, setEstado] = useState('pendiente')
  const [comment, setComment] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  const handleAprobar = () => setEstado('aprobado')
  const handleRechazar = () => setEstado('rechazado')
  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }
  const handleSendComment = () => {
    console.log("Comment sent:", comment)
    setComment('') // Limpiar el campo de comentario
  }
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const formattedDate = new Date(requirement.requirement_timestamp).toLocaleString()
  // console.log('Requerimiento:', requerimiento)
  return (
    <Card 
      sx={{ 
        maxWidth: 400, 
        bgcolor: 'grey.50',
        border: '2px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          borderColor: 'primary.main',
        },
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography 
              variant="h6" 
              color="primary"
              sx={{ 
                fontWeight: 'bold',
                pb: 0.5
              }}
            >
              #{requirement.requirement_id} {requirement.nombre || 'Sin nombre'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                pb: 1
              }}
            >
              Abierto el {formattedDate}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            sx={{
              bgcolor: 'grey.100',
              '&:hover': {
                bgcolor: 'grey.200'
              }
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
          </Menu>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          mb={2}
          sx={{
            bgcolor: 'grey.100',
            p: 1.5,
            borderRadius: 1
          }}
        >
          {requirement.requirement_text || 'Sin descripción'}
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Añadir un comentario..."
          value={comment}
          onChange={handleCommentChange}
          sx={{ 
            mb: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'grey.300',
                borderWidth: 2
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              }
            }
          }}
        />
        <Button 
          size="small" 
          variant="contained" 
          onClick={handleSendComment}
          sx={{
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          Publicar
        </Button>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CheckIcon />}
          onClick={handleAprobar}
          disabled={estado !== 'pendiente'}
          sx={{
            borderWidth: 2,
            '&:not(:disabled)': {
              '&:hover': {
                borderWidth: 2
              }
            }
          }}
        >
          Aprobar
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={handleRechazar}
          disabled={estado !== 'pendiente'}
          sx={{
            borderWidth: 2,
            '&:not(:disabled)': {
              '&:hover': {
                borderWidth: 2
              }
            }
          }}
        >
          Rechazar
        </Button>
      </CardActions>
      {estado !== 'pendiente' && (
        <Box
          sx={{
            textAlign: 'center',
            py: 1,
            bgcolor: estado === 'aprobado' ? 'success.light' : 'error.light',
            color: estado === 'aprobado' ? 'success.dark' : 'error.dark',
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
            fontWeight: 'bold'
          }}
        >
          {estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
        </Box>
      )}
    </Card>
  )
}