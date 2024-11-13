'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardActions, Typography } from "@mui/material";
import { Button } from "@mui/material"
import { Plus } from 'lucide-react'

export default function TarjetaTarea({ tarea = {
  id: '',
  titulo: '',
  descripcion: '',
  area: '',
  tiempo: '',
  costo: ''
}}) {
  return (
    <div className="p-4 relative">
      <Card className="w-full max-w-md bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            {tarea.titulo || 'Nueva Tarea'}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            ID de Tarea: {tarea.id}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Descripción:</h3>
            <p className="text-sm text-muted-foreground">
              {tarea.descripcion || 'Sin descripción'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Área del Equipo:</h3>
              <p className="text-sm text-muted-foreground">{tarea.area || 'No especificado'}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Tiempo Estimado:</h3>
              <p className="text-sm text-muted-foreground">{tarea.tiempo || 'No especificado'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-1">Costo:</h3>
            <p className="text-sm text-muted-foreground">{tarea.costo || '$0 USD'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente contenedor para múltiples tarjetas y botón de agregar
export function ContenedorTareas() {
  const [tareas] = useState([
    {
      id: 'TAREA-001',
      titulo: 'Diseño de interfaz de registro de usuarios',
      descripcion: 'Crear un diseño de interfaz de usuario para el registro de nuevos usuarios en la plataforma de e-commerce.',
      area: 'Diseño',
      tiempo: '8 horas',
      costo: '800 USD'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Requerimiento RF1 - Nombre / Tareas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tareas.map((tarea) => (
          <TarjetaTarea key={tarea.id} tarea={tarea} />
        ))}
      </div>
      <Button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg"
        size="icon"
        style={{ backgroundColor: '#6C2BD9' }}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}