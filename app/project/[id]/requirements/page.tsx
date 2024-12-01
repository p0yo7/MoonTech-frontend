"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { generateRequirements } from '@/utils/api'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Sparkles } from 'lucide-react';

interface Requisito {
  requirement_id: number;
  requirement_description: string;
  requirement_approved: boolean;
  requirement_timestamp: string;
}

interface SolicitudRequisito {
  ProjectID: number;
  OwnerID: number;
  RequirementDescription: string;
  approved: boolean;
}

export default function PaginaRequisitosProyecto({ params }: { params: Promise<{ id: string }> }) {
  const parametrosResueltos = use(params)
  const [requisitos, setRequisitos] = useState<Requisito[] | null>(null)
  const [nuevoRequisito, setNuevoRequisito] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estaGenerando, setEstaGenerando] = useState(false)
  const [estaCargando, setEstaCargando] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const cargarRequisitos = async () => {
    const token = Cookies.get('authToken')
    
    try {
      const respuesta = await axios.get<Requisito[]>(
        `http://localhost:8080/Project/${parametrosResueltos.id}/Requirements`,
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      setRequisitos(respuesta.data)
    } catch (error: any) {
      console.error('Error al cargar requisitos:', error.response?.data || error.message)
      toast({
        title: "Error",
        description: "Error al cargar los requisitos. Por favor, intente nuevamente.",
        variant: "destructive",
      })
      setRequisitos(null)
    } finally {
      setEstaCargando(false)
    }
  }

  const cargarDescripcionProyecto = async () => {
    const token = Cookies.get('authToken')
    
    try {
      const respuesta = await axios.get<{ project_description: string }>(
        `http://localhost:8080/Project/${parametrosResueltos.id}`,
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      setDescripcion(respuesta.data.project_description)
    } catch (error: any) {
      console.error('Error al cargar la descripción del proyecto:', error.response?.data || error.message)
      toast({
        title: "Error",
        description: "Error al cargar la descripción del proyecto. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      await cargarRequisitos()
      await cargarDescripcionProyecto()
    }
    obtenerDatos()
  }, [parametrosResueltos.id])

  const agregarRequisito = async () => {
    if (nuevoRequisito.trim() === '') return
    
    const token = Cookies.get('authToken')
    
    try {
      const datosRequisito: SolicitudRequisito = {
        ProjectID: Number(parametrosResueltos.id),
        OwnerID: 1,
        RequirementDescription: nuevoRequisito,
        approved: false
      }

      const respuesta = await axios.post<Requisito>(
        `http://localhost:8080/createRequirement`,
        datosRequisito,
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (respuesta.data) {
        await cargarRequisitos()
        setNuevoRequisito('')
        toast({
          title: "Éxito",
          description: "Requisito agregado exitosamente.",
        })
      }
    } catch (error: any) {
      console.error('Error al agregar requisito:', error.response?.data || error.message)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al agregar requisito. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  const generarRequisitosIA = async () => {
    if (!descripcion.trim()) return

    const token = Cookies.get('authToken')
    setEstaGenerando(true)
    try {
      const respuesta = await axios.post<Requisito[]>(
        `http://localhost:8080/Project/Requirements/Generate`,
        { 
          project_id: Number(parametrosResueltos.id),
        },
        {
          headers: {
            'Authorization': `${token}`,
          }
        }
      )

      if (respuesta.data) {
        await cargarRequisitos()
        setDescripcion('')
        toast({
          title: "Éxito",
          description: "Requisitos generados exitosamente.",
        })
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al generar requisitos. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setEstaGenerando(false)
    }
  }

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/project/${parametrosResueltos.id}/tasks`)
  }

  const actualizarDescripcionProyecto = async () => {
    if (!descripcion.trim()) return

    const token = Cookies.get('authToken')
    
    try {
      const respuesta = await axios.put(
        `http://localhost:8080/ProjectDescription/${parametrosResueltos.id}`,
        { 
          project_id: Number(parametrosResueltos.id),
          project_description: descripcion,
          project_budget: "0",
        },
        {
          headers: {
            'Authorization': `${token}`,
          }
        }
      )

      if (respuesta.data) {
        toast({
          title: "Éxito",
          description: "Descripción del proyecto actualizada exitosamente.",
        })
      }
    } catch (error: any) {
      console.error('Error al actualizar la descripción del proyecto:', error.response?.data || error.message)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al actualizar la descripción del proyecto. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  if (estaCargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando requisitos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Requisitos del Proyecto</h1>
      <form onSubmit={manejarEnvio} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description">Descripción del Proyecto</Label>
          <Textarea
            id="description"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingrese la descripción del proyecto para generar requisitos con IA"
            className="h-32"
          />
          <Button 
            type="button" 
            onClick={actualizarDescripcionProyecto}
          >
            Actualizar Descripción del Proyecto
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="newRequirement">Nuevo Requisito</Label>
          <div className="flex space-x-2">
            <Input
              id="newRequirement"
              value={nuevoRequisito}
              onChange={(e) => setNuevoRequisito(e.target.value)}
              placeholder="Ingrese nuevo requisito"
            />
            <Button 
              type="button" 
              onClick={agregarRequisito}
            >
              Agregar
            </Button>
          </div>
        </div>

        {requisitos === null ? (
          <div>
            <p>Menú normal</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Lista de Requisitos</h2>
            {requisitos.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">
                Aún no hay requisitos agregados. Agregue algunos requisitos o genérelos usando IA.
              </div>
            ) : (
              <div className="space-y-2">
                {requisitos.map((req) => (
                  <div 
                    key={`req-${req.requirement_id}`}
                    className={`p-4 rounded border ${
                      req.requirement_approved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="flex-1">{req.requirement_description}</span>
                      {req.requirement_approved && (
                        <span className="ml-2 px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          Aprobado
                        </span>
                      )}
                    </div>
                    {req.requirement_timestamp !== "0001-01-01T00:00:00Z" && (
                      <div className="text-xs text-gray-500 mt-1">
                        Agregado: {new Date(req.requirement_timestamp).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={generarRequisitosIA}
            disabled={estaGenerando || !descripcion.trim()}
            className="flex items-center gap-2"
          >
            {estaGenerando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando Requisitos...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generar con IA
              </>
            )}
          </Button>
          <Button 
            type="submit"
            disabled={requisitos === null || requisitos.length === 0}
          >
            Continuar a Tareas
          </Button>
        </div>
      </form>
    </div>
  )
}