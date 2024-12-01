"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { fetchRequirements, createRequirement, generateRequirements } from '@/utils/api'
import { Requirement } from '@/types/types'

export default function NewProjectRequirementsPage() {
  const [requirements, setRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const projectId = localStorage.getItem('currentProjectId')
    if (projectId) {
      loadRequirements(projectId)
    } else {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "No project ID found. Please start a new project.",
        variant: "destructive",
      })
    }
  }, [])

  const loadRequirements = async (projectId: string) => {
    setIsLoading(true)
    try {
      const fetchedRequirements = await fetchRequirements(projectId)
      setRequirements(fetchedRequirements.map((req: Requirement) => req.description))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load requirements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addRequirement = async () => {
    if (newRequirement.trim() === '') return
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
      await createRequirement(projectId, newRequirement)
      setRequirements([...requirements, newRequirement])
      setNewRequirement('')
      toast({
        title: "Success",
        description: "Requirement added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add requirement. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateRequirementsAI = async () => {
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
      const generatedRequirements = await generateRequirements(projectId, description)
      setRequirements([...requirements, ...generatedRequirements])
      toast({
        title: "Requirements Generated",
        description: "AI has successfully generated new requirements for your project.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate requirements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/project/new/tasks')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading requirements...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">New Project Requirements</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            className="h-32"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newRequirement">New Requirement</Label>
          <div className="flex space-x-2">
            <Input
              id="newRequirement"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="Enter new requirement"
            />
            <Button type="button" onClick={addRequirement}>Add</Button>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Requirements</h2>
          {requirements.length === 0 ? (
            <p>No requirements added yet. Start by adding a new requirement or generate requirements with AI.</p>
          ) : (
            requirements.map((req, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                {req}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Return
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={generateRequirementsAI}
            disabled={isGenerating || !description.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Requirements with AI'
            )}
          </Button>
          <Button type="submit">
            Continue to Tasks
          </Button>
        </div>
      </form>
    </div>
  )
}

