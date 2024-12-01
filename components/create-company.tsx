// components/CreateCompanyForm.tsx
'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createCompany } from '@/components/utils/api'
import axios from 'axios';
import Cookies from 'js-cookie';
interface CreateCompanyFormProps {
  onClose: () => void
}

export function CreateCompanyForm({ onClose }: CreateCompanyFormProps) {
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const authToken = Cookies.get('authToken')
      const response = await axios.post('http://localhost:8080/createCompany', {
        CompanyName: companyName,
        CompanyDescription: companyDescription,
        CompanySize: parseInt(companySize),
        RepresentativeID: 1, // Hardcoded for now
        BusinessTypeID: 1, // Hardcoded for now
      }, {
        headers: {
          Authorization: `${authToken}`
        }
      })
    //   console.log('Empresa creada:', response)
      if (response.data.message === 'Company created successfully') {
        toast({
          title: 'Éxito',
          description: 'Empresa creada exitosamente.',
        })
        onClose() // Close the dialog
      } else {
        toast({
          title: 'Error',
          description: 'Hubo un problema al crear la empresa. Por favor, intenta de nuevo.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error al crear la empresa:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear la empresa. Por favor, intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Empresa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nombre de la Empresa</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="companyDescription">Descripción de la Empresa</Label>
            <Input
              id="companyDescription"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="companySize">Tamaño de la Empresa</Label>
            <br />
            <select
              id="companySize"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              required
            >
              <option value="">Selecciona el tamaño</option>
              <option value="1">Pequeña</option>
              <option value="2">Mediana</option>
              <option value="3">Grande</option>
              <option value="4">Macro</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Empresa'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
