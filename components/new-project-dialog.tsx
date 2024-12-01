"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { createProject, uploadFile } from '@/utils/api'

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: (projectId: string) => void
}

// Mock data for team members - replace with actual data from your backend
const teamMembers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" }
]

export function NewProjectDialog({ open, onOpenChange, onProjectCreated }: NewProjectDialogProps) {
  const [formData, setFormData] = useState({
    projName: '',
    owner: '',
    company: '',
    area: '',
    projectDescription: '',
    budget: '',
    comercial: '',
    liderDigital: '',
    pm: '',
    gdm: '',
    equipoDigital: '',
    legal: '',
    finanzas: ''
  })
  const [startDate, setStartDate] = useState<Date>()
  const [logo, setLogo] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let logoUrl = ''
      if (logo) {
        const formData = new FormData()
        formData.append('file', logo)
        const uploadResponse = await uploadFile(formData)
        logoUrl = uploadResponse.url
      }

      const newProject = await createProject({
        ...formData,
        startDate: startDate ? startDate.toISOString() : undefined,
        logo: logoUrl
      })

      toast({
        title: "Success",
        description: "New project created successfully.",
      })

      onProjectCreated(newProject.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: "Failed to create new project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projName">Project Name</Label>
              <Input 
                id="projName" 
                value={formData.projName} 
                onChange={(e) => handleInputChange('projName', e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Input 
                id="owner" 
                value={formData.owner} 
                onChange={(e) => handleInputChange('owner', e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                value={formData.company} 
                onChange={(e) => handleInputChange('company', e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <Input 
                id="area" 
                value={formData.area} 
                onChange={(e) => handleInputChange('area', e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input 
                id="budget" 
                type="number" 
                value={formData.budget} 
                onChange={(e) => handleInputChange('budget', e.target.value)} 
                required 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea 
              id="projectDescription" 
              value={formData.projectDescription} 
              onChange={(e) => handleInputChange('projectDescription', e.target.value)} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'comercial', label: 'Comercial' },
              { id: 'liderDigital', label: 'Lider Digital' },
              { id: 'pm', label: 'PM' },
              { id: 'gdm', label: 'GDM' },
              { id: 'equipoDigital', label: 'Equipo Digital' },
              { id: 'legal', label: 'Legal' },
              { id: 'finanzas', label: 'Finanzas' },
            ].map((role) => (
              <div key={role.id}>
                <Label htmlFor={role.id}>{role.label}</Label>
                <Select 
                  value={formData[role.id]} 
                  onValueChange={(value) => handleInputChange(role.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${role.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* <div>
            <Label htmlFor="logo">Logo</Label>
            <Input 
              id="logo" 
              type="file" 
              onChange={(e) => setLogo(e.target.files?.[0] || null)} 
              accept="image/*" 
            />
          </div> */}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}