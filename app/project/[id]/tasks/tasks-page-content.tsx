"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios'
import Cookies from 'js-cookie'

interface Task {
  id: string
  name: string
  description: string
  estimatedTime: number
  effort: 'Low' | 'Medium' | 'High'
  priority: 'Low' | 'Medium' | 'High'
  estimatedCost: number
  completed: boolean
}

const INITIAL_TASK_STATE: Omit<Task, 'id' | 'completed'> = {
  name: '',
  description: '',
  estimatedTime: 0,
  effort: 'Medium',
  priority: 'Medium',
  estimatedCost: 0,
}

export default function TasksPageContent({ id }: { id: string }) {
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
            'Authorization': `${Cookies.get('authToken')}`,
          }
        }
      )
      if (response.data) {
        setTasks(response.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, toast])

  const addTask = useCallback(async () => {
    try {
      const response = await axios.post<Task>(
        `http://localhost:8080/Project/${id}/Requirements`,
        newTask,
        {
          headers: {
            'Authorization': `${Cookies.get('authToken')}`,
          }
        }
      )
      if (response.data) {
        setTasks(prevTasks => [...prevTasks, response.data])
        setNewTask(INITIAL_TASK_STATE)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }, [id, newTask, toast])

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId)
    if (!taskToUpdate) return

    try {
      const response = await axios.put<Task>(
        `http://localhost:8080/createTasks/${id}/Requirements/${taskId}`,
        { ...taskToUpdate, completed: !taskToUpdate.completed },
        {
          headers: {
            'Authorization': `${Cookies.get('authToken')}`,
          }
        }
      )
      if (response.data) {
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === taskId ? response.data : task)
        )
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }, [id, tasks, toast])

  const generateTasksAI = useCallback(async () => {
    setIsGenerating(true)
    try {
      const response = await axios.post<Task[]>(
        `http://localhost:8080/Project/Tasks/generate`,
        {},
        {
          headers: {
            'Authorization': `${Cookies.get('authToken')}`,
          }
        }
      )
      if (response.data) {
        setTasks(prevTasks => [...prevTasks, ...response.data])
        toast({
          title: "Tasks Generated",
          description: "AI has successfully generated new tasks for your project.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [toast])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/project/${id}/contract`)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading tasks...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Project Tasks</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={newTask.name}
              onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter task name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taskDescription">Task Description</Label>
            <Textarea
              id="taskDescription"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="0"
                value={newTask.estimatedTime}
                onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                placeholder="Enter estimated time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                min="0"
                value={newTask.estimatedCost}
                onChange={(e) => setNewTask(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
                placeholder="Enter estimated cost"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effort">Effort</Label>
              <Select
                value={newTask.effort}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, effort: value as 'Low' | 'Medium' | 'High' }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select effort level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as 'Low' | 'Medium' | 'High' }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" onClick={addTask}>Add Task</Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                <Label
                  htmlFor={task.id}
                  className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {task.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
          >
            Return
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={generateTasksAI}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Tasks with AI'
            )}
          </Button>
          <Button type="submit">
            Continue to Contract
          </Button>
        </div>
      </form>
    </div>
  )
}

