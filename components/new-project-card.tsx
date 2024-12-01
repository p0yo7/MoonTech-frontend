'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusIcon, Loader2, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from '@/components/ui/use-toast'
import { ScrollArea } from "@/components/ui/scroll-area"
import { v4 as uuidv4 } from 'uuid'
import CustomDateButton from "@/components/ui/custom-date"

const token = Cookies.get('authToken')

interface TeamMember {
  id: number
  full_name: string
  team_name: string
}

interface Company {
  id: number
  name: string
}

interface BusinessType {
  id: number
  name: string
}

interface Project {
  project_id: string | number
  project_name: string
  project_description: string
  project_budget: number
  company_name: string
  company_description: string
  company_size: number
  owner: string
  business_type: string
  start_date: string
  team_members: {
    comercial: string
    lider_digital: string
    pm: string
    gdm: string
    equipo_digital: string
    legal: string
    finanzas: string
  }
}

interface NewProjectCardProps {
  onNewProject: (project: Project) => void
}

// API functions
const fetchTeamMembers = async (teamName: string): Promise<TeamMember[]> => {
  try {
    const response = await axios.get(`http://localhost:8080/GetUsersForTeams/${teamName}`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const token = Cookies.get('authToken');
    const response = await axios.get('http://localhost:8080/getCompanies', {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    console.log(Cookies.get('authToken'));
    return [];
  }
};

const fetchBusinessTypes = async (): Promise<BusinessType[]> => {
  try {
    const response = await axios.get('http://localhost:8080/getBusinessTypes', {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export function NewProjectCard({ onNewProject }: NewProjectCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showCloseAlert, setShowCloseAlert] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([])
  const [teamMembers, setTeamMembers] = useState<{ [key: string]: TeamMember[] }>({})
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    projName: '',
    owner: '',
    company: '',
    businessType: '',
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

  useEffect(() => {
    const loadInitialData = async () => {
      if (isDialogOpen) {
        try {
          // Load companies and business types
          const [companiesData, businessTypesData] = await Promise.all([
            fetchCompanies(),
            fetchBusinessTypes()
          ]);
          
          setCompanies(companiesData);
          setBusinessTypes(businessTypesData);

          // Load team members
          const teams = [
            'Comercial',
            'Lider Digital',
            'PM',
            'GDM',
            'Equipo Digital',
            'Legal',
            'Finanzas'
          ];

          const teamMembersData: { [key: string]: TeamMember[] } = {};
          
          for (const team of teams) {
            const members = await fetchTeamMembers(team);
            teamMembersData[team] = members;
          }

          setTeamMembers(teamMembersData);
        } catch (error) {
          console.error('Error loading initial data:', error);
          toast({
            title: "Error",
            description: "Error al cargar los datos iniciales.",
            variant: "destructive",
          });
        }
      }
    };

    loadInitialData();
  }, [isDialogOpen, toast]);

  const handleCloseDialog = () => {
    if (hasUnsavedChanges) {
      setShowCloseAlert(true)
    } else {
      setIsDialogOpen(false)
      resetForm()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setHasUnsavedChanges(true)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      projName: '',
      owner: '',
      company: '',
      businessType: '',
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
    setStartDate(undefined)
    setHasUnsavedChanges(false)
  }

  const handleConfirmClose = () => {
    setShowCloseAlert(false)
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const requestData = {
      ProjectName: formData.projName,
      ProjectDescription: "",
      CompanyID: parseInt(formData.company),
      BusinessTypeID: parseInt(formData.businessType),
      StartDate: new Date().toISOString(),
      Budget: Number(formData.budget),
    }

    console.log('Request data:', requestData)
    try {
      const token = Cookies.get('authToken')
      const newProjectData = await axios.post('http://localhost:8080/createProject', 
        requestData, {
        headers: {
          'Authorization': `${token}`
        }
      })

      console.log('Nuevo proyecto creado:', newProjectData.data)

      const newProject: Project = {
        project_id: newProjectData.data.project_id || newProjectData.data.id || uuidv4(),
        project_name: formData.projName,
        project_description: formData.projectDescription,
        project_budget: Number(formData.budget) || 0,
        company_name: companies.find(c => c.id.toString() === formData.company)?.name || '',
        company_description: '',
        company_size: 0,
        owner: formData.owner,
        business_type: businessTypes.find(b => b.id.toString() === formData.businessType)?.name || '',
        start_date: startDate ? startDate.toISOString() : '',
        team_members: {
          comercial: formData.comercial,
          lider_digital: formData.liderDigital,
          pm: formData.pm,
          gdm: formData.gdm,
          equipo_digital: formData.equipoDigital,
          legal: formData.legal,
          finanzas: formData.finanzas
        }
      }

      onNewProject(newProject)
      setHasUnsavedChanges(false)
      setIsDialogOpen(false)
      resetForm()
      toast({
        title: "Éxito",
        description: "Nuevo proyecto creado con éxito.",
      })
      router.push(`/project/${newProject.project_id}/requirements`)
    } catch (error) {
      console.log(token);
      console.log('Error creating project:', error)
      // console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: "No se pudo crear el nuevo proyecto. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const teamRoles = [
    { id: 'comercial', label: 'Comercial', apiName: 'Comercial' },
    { id: 'liderDigital', label: 'Lider Digital', apiName: 'Lider Digital' },
    { id: 'pm', label: 'PM', apiName: 'PM' },
    { id: 'gdm', label: 'GDM', apiName: 'GDM' },
    { id: 'equipoDigital', label: 'Equipo Digital', apiName: 'Equipo Digital' },
    { id: 'legal', label: 'Legal', apiName: 'Legal' },
    { id: 'finanzas', label: 'Finanzas', apiName: 'Finanzas' }
  ]
  return (
    <>
      <Card 
        className="flex items-center justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="flex flex-col items-center p-6">
          <Button variant="ghost" size="icon" className="h-20 w-20">
            <PlusIcon className="h-10 w-10" />
          </Button>
          <p className="mt-2 text-sm font-medium">Crear Nuevo Proyecto</p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
          <DialogHeader className="sticky top-0 z-50 bg-background px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCloseDialog}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <ScrollArea className="px-6 py-4 max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projName">Nombre del Proyecto</Label>
                  <Input 
                    id="projName" 
                    value={formData.projName} 
                    onChange={(e) => handleInputChange('projName', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="owner">Propietario</Label>
                  <Input 
                    id="owner" 
                    value={formData.owner} 
                    onChange={(e) => handleInputChange('owner', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Select 
                    value={formData.company} 
                    onValueChange={(value) => handleInputChange('company', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="businessType">Giro Empresarial</Label>
                  <Select 
                    value={formData.businessType} 
                    onValueChange={(value) => handleInputChange('businessType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar giro empresarial" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <CustomDateButton
                    startDate={startDate}
                    setStartDate={setStartDate}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Presupuesto</Label>
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
                <Label htmlFor="projectDescription">Descripción del Proyecto</Label>
                <Textarea 
                  id="projectDescription" 
                  value={formData.projectDescription} 
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)} 
                  required 
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamRoles.map((role) => (
                  <div key={role.id}>
                    <Label htmlFor={role.id}>{role.label}</Label>
                    <Select 
                      value={formData[role.id]} 
                      onValueChange={(value) => handleInputChange(role.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Seleccionar ${role.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers[role.apiName]?.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.full_name}
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </form>
          </ScrollArea>

          <DialogFooter className="sticky bottom-0 bg-background px-6 py-4 border-t">
            <div className="flex w-full gap-2">
              <Button 
                variant="outline" 
                onClick={handleCloseDialog}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading} 
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Proyecto'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro que deseas cerrar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar. Si cierras ahora, perderás todos los cambios realizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}