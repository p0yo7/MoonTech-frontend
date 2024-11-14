'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Cookies from 'js-cookie';

const theme = createTheme()

export default function ProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    projectArea: '',
    members: {
      Comercial: '',
      'Líder digital': '',
      Finanzas: '',
      GDM: '',
      PM: '',
    },
  })
  // Adaptar lo de members para que sea dinámico con el endpoint
  const router = useRouter()
  // Obtener las areas de trabajo de la db con el endpoint
  const projectAreas = ['Alimenticia', 'Agrícola', 'Textil', 'Manufactura', 'Tecnología']

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleMemberChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      members: {
        ...prevData.members,
        [name]: value,
      },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Obtener las areas de trabajo
    // Obtenre el id de la compania
    const request = {
      ProjectName: formData.title,
      AreaID: 1, // You might want to map this to the actual area ID
      CompanyID: 1,
      StartDate: new Date().toISOString().split('T')[0],
    }

    try {
      const response = await fetch('http://localhost:8080/createProject', {
        method: 'POST',
        headers: {
          'Authorization': `${Cookies.get('authToken')}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Error creating project')
      }

      const data = await response.json()
      console.log(data)
      router.push(`/projects/${data.id}/requirements`)
    } catch (error) {
      console.log(error)
      console.error('Error:', error)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Nuevo Proyecto
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Título (Proyecto)"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nombre de la Empresa"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="project-area-label">Área (proyecto)</InputLabel>
                    <Select
                      labelId="project-area-label"
                      value={formData.projectArea}
                      label="Área (proyecto)"
                      onChange={(e) => setFormData({ ...formData, projectArea: e.target.value })}
                    >
                      {projectAreas.map((area) => (
                        <MenuItem key={area} value={area}>
                          {area}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Seleccionar miembros y áreas
              </Typography>
              <Grid container spacing={3}>
                {Object.entries(formData.members).map(([role, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={role}>
                    <TextField
                      fullWidth
                      label={role}
                      name={role}
                      value={value}
                      onChange={handleMemberChange}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Crear Proyecto
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  )
}