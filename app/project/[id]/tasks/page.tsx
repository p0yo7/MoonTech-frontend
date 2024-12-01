"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Sparkles } from 'lucide-react';

// Importaciones actualizadas para los componentes de Radix UI
import * as Select from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'

// Interfaz Task actualizada
interface Task {
  task_id: number
  task_title: string
  task_description: string
  task_estimated_time: number | string
  task_estimated_cost?: number | string
  task_effort?: 'Low' | 'Medium' | 'High'
  task_priority?: 'Low' | 'Medium' | 'High'
  task_completed?: boolean
}

// Estado inicial de la tarea ajustado
const INITIAL_TASK_STATE: Omit<Task, 'task_id'> = {
  task_title: '',
  task_description: '',
  task_estimated_time: '',
  task_estimated_cost: '',
  task_effort: 'Medium',
  task_priority: 'Medium',
  task_completed: false,
}

// Componente wrapper para manejar los parámetros
function TasksPageWrapper() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  if (!id) {
    return <div>Cargando...</div>
  }

  return <TasksPageContent id={id} />
}

// Contenido principal del componente
function TasksPageContent({ id }: { id: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState(INITIAL_TASK_STATE)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const loadTasks = useCallback(async () => {
    try {
      const response = await axios.get<Task[]>(
        `http://localhost:8080/Project/${id}/Tasks`,
        {
          headers: {
            Authorization: `${Cookies.get('authToken')}`,
          },
        }
      )
      if (response.data) {
        setTasks(response.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las tareas. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, toast])

  const addTask = useCallback(async () => {
    try {
      const taskToSubmit = {
        ...newTask,
        task_estimated_time: Number(newTask.task_estimated_time) || 0,
        task_estimated_cost: Number(newTask.task_estimated_cost) || 0,
      }
      const response = await axios.post<Task>(
        `http://localhost:8080/Project/${id}/Tasks`,
        taskToSubmit,
        {
          headers: {
            Authorization: `${Cookies.get('authToken')}`,
          },
        }
      )
      if (response.data) {
        setTasks((prevTasks) => [...prevTasks, response.data])
        setNewTask(INITIAL_TASK_STATE)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la tarea. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    }
  }, [id, newTask, toast])

  const toggleTaskCompletion = useCallback(
    async (taskId: number) => {
      const taskToUpdate = tasks.find((task) => task.task_id === taskId)
      if (!taskToUpdate) return

      try {
        const response = await axios.put<Task>(
          `http://localhost:8080/Project/${id}/Tasks/${taskId}`,
          { ...taskToUpdate, task_completed: !taskToUpdate.task_completed },
          {
            headers: {
              Authorization: `${Cookies.get('authToken')}`,
            },
          }
        )
        if (response.data) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.task_id === taskId ? response.data : task
            )
          )
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo actualizar la tarea. Por favor, inténtalo de nuevo.',
          variant: 'destructive',
        })
      }
    },
    [id, tasks, toast]
  )

  const generateTasksAI = useCallback(async () => {
    setIsGenerating(true)
    try {
      const response = await axios.post<Task[]>(
        `http://localhost:8080/Project/Tasks/Generate`,
        {
          project_id: Number(id),
        },
        {
          headers: {
            Authorization: `${Cookies.get('authToken')}`,
          },
        }
      )
      if (response.data) {
        setTasks((prevTasks) => [...prevTasks, ...response.data])
        toast({
          title: 'Tareas Generadas',
          description: 'La IA ha generado nuevas tareas para tu proyecto.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron generar las tareas. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }, [id, toast])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/project/${id}/contract`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Cargando tareas...
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Tareas del Proyecto</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Agregar Nueva Tarea</h2>
          <div className="space-y-2">
            <Label htmlFor="taskTitle">Título de la Tarea</Label>
            <Input
              id="taskTitle"
              value={newTask.task_title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, task_title: e.target.value }))
              }
              placeholder="Ingresa el título de la tarea"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taskDescription">Descripción de la Tarea</Label>
            <Textarea
              id="taskDescription"
              value={newTask.task_description}
              onChange={(e) =>
                setNewTask((prev) => ({
                  ...prev,
                  task_description: e.target.value,
                }))
              }
              placeholder="Ingresa la descripción de la tarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Tiempo Estimado (horas)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="0"
                value={newTask.task_estimated_time}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    task_estimated_time: e.target.value,
                  }))
                }
                placeholder="Ingresa el tiempo estimado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Costo Estimado ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                min="0"
                value={newTask.task_estimated_cost}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    task_estimated_cost: e.target.value,
                  }))
                }
                placeholder="Ingresa el costo estimado"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effort">Esfuerzo</Label>
              <Select.Root
                value={newTask.task_effort || 'Medium'}
                onValueChange={(value) =>
                  setNewTask((prev) => ({
                    ...prev,
                    task_effort: value as 'Low' | 'Medium' | 'High',
                  }))
                }
              >
                <Select.Trigger id="effort" aria-label="Selecciona el nivel de esfuerzo">
                  <Select.Value placeholder="Selecciona el nivel de esfuerzo" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    <Select.Item value="Low">
                      <Select.ItemText>Bajo</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="Medium">
                      <Select.ItemText>Medio</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="High">
                      <Select.ItemText>Alto</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select.Root
                value={newTask.task_priority || 'Medium'}
                onValueChange={(value) =>
                  setNewTask((prev) => ({
                    ...prev,
                    task_priority: value as 'Low' | 'Medium' | 'High',
                  }))
                }
              >
                <Select.Trigger id="priority" aria-label="Selecciona el nivel de prioridad">
                  <Select.Value placeholder="Selecciona el nivel de prioridad" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    <Select.Item value="Low">
                      <Select.ItemText>Baja</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="Medium">
                      <Select.ItemText>Media</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="High">
                      <Select.ItemText>Alta</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          <Button type="button" onClick={addTask}>
            Agregar Tarea
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tareas</h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={`task-${task.task_id}`}
                className="p-4 bg-gray-100 rounded"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox.Root
                    id={`task-${task.task_id}`}
                    checked={task.task_completed || false}
                    onCheckedChange={() => toggleTaskCompletion(task.task_id)}
                    className="flex items-center"
                    aria-label={`Marcar ${task.task_title} como ${
                      task.task_completed ? 'incompleta' : 'completada'
                    }`}
                  >
                    <Checkbox.Indicator className="text-blue-600">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <Label
                    htmlFor={`task-${task.task_id}`}
                    className={`flex-grow ${
                      task.task_completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {task.task_title}
                  </Label>
                </div>
                <div className="mt-2 ml-6 text-sm text-gray-700">
                  <p>
                    Tiempo Estimado: {task.task_estimated_time || 0} horas
                  </p>
                  <p>
                    Costo Estimado: ${task.task_estimated_cost || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Regresar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={generateTasksAI}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generar Tareas con IA
              </>
            )}
          </Button>
          <Button type="submit">Continuar al Contrato</Button>
          </div>
      </form>
    </div>
  )
}

export default TasksPageWrapper
