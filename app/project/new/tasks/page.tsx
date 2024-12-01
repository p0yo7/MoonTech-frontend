"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchTasks, createTask, updateTask, generateTasks } from '@/utils/api'

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

export default function NewProjectTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed'>>({
    name: '',
    description: '',
    estimatedTime: 0,
    effort: 'Medium',
    priority: 'Medium',
    estimatedCost: 0,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const projectId = localStorage.getItem('currentProjectId')
    if (projectId) {
      loadTasks(projectId)
    } else {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "No project ID found. Please start a new project.",
        variant: "destructive",
      })
    }
  }, [])

  const loadTasks = async (projectId: string) => {
    setIsLoading(true)
    try {
      const fetchedTasks = await fetchTasks(projectId)
      setTasks(fetchedTasks)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async () => {
    const projectId = localStorage.getItem('currentProjectId')
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project ID found. Please start a new project.",
        variant: "destructive",
      })
      return
    }
    try {
      const createdTask = await createTask(projectId, newTask)
      setTasks([...tasks, createdTask])
      setNewTask({
        name: '',
        description: '',
        estimatedTime: 0,
        effort: 'Medium',
        priority: 'Medium',
        estimatedCost: 0,
      })
      toast({
        title: "Success",
        description: "Task added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    const projectId = localStorage.getItem('currentProjectId')
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project ID found. Please start a new project.",
        variant: "destructive",
      })
      return
    }
    const taskToUpdate = tasks.find(task => task.id === id)
    if (taskToUpdate) {
      try {
        const updatedTask = await updateTask(projectId, id, { ...taskToUpdate, completed: !taskToUpdate.completed })
        const updatedTasks = tasks.map(task => task.id === id ? updatedTask : task)
        setTasks(updatedTasks)
        toast({
          title: "Success",
          description: `Task ${updatedTask.completed ? 'completed' : 'uncompleted'}.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const generateTasksAI = async () => {
    setIsGenerating(true)
    const projectId = localStorage.getItem('currentProjectId')
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project ID found. Please start a new project.",
        variant: "destructive",
      })
      setIsGenerating(false)
      return
    }
    try {
      const generatedTasks = await generateTasks(projectId)
      setTasks([...tasks, ...generatedTasks])
      toast({
        title: "Tasks Generated",
        description: "AI has successfully generated new tasks for your project.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/project/new/contract')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">New Project Tasks</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              placeholder="Enter task name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taskDescription">Task Description</Label>
            <Textarea
              id="taskDescription"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
              <Input
                id="estimatedTime"
                type="number"
                value={newTask.estimatedTime}
                onChange={(e) => setNewTask({ ...newTask, estimatedTime: Number(e.target.value) })}
                placeholder="Enter estimated time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={newTask.estimatedCost}
                onChange={(e) => setNewTask({ ...newTask, estimatedCost: Number(e.target.value) })}
                placeholder="Enter estimated cost"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effort">Effort</Label>
              <Select
                onValueChange={(value) => setNewTask({ ...newTask, effort: value as 'Low' | 'Medium' | 'High' })}
              >
                <SelectTrigger>
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
                onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'Low' | 'Medium' | 'High' })}
              >
                <SelectTrigger>
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
          {tasks.length === 0 ? (
            <p>No tasks added yet. Start by adding a new task or generate tasks with AI.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                <Label
                  htmlFor={`task-${task.id}`}
                  className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {task.name}
                </Label>
              </div>
            ))
          )}
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

