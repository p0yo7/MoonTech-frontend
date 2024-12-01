"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { approveContract, uploadContract } from '@/components/utils/api'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Sparkles } from 'lucide-react'

export default function ContractPage() {
  const [contract, setContract] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const token = Cookies.get('authToken')

  useEffect(() => {
    if (params.id) {
      loadContract()
    }
  }, [params.id])

  const loadContract = async () => {
    setIsLoading(true)
    try {
      const response = await axios({
        url: `http://localhost:8080/Project/${params.id}/Contract`,
        method: 'GET',
        headers: {
          'Authorization': `${token}`
        }
      });

      if (response.data) {
        setContract(response.data.content || '')
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "No se pudo cargar el contrato. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateContract = async () => {
    setIsGenerating(true)
    try {
      const response = await axios.post('http://localhost:8080/Project/Contract/Generate/', {
        project_id: parseInt(params.id, 10)
      }, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setContract(response.data.content || '')
        toast({
          title: "Éxito",
          description: "El contrato se ha generado correctamente.",
        })
      }
    } catch (error) {
      console.error('Error al generar el contrato:', error)
      toast({
        title: "Error",
        description: "No se pudo generar el contrato. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      if (!token || token === 'null' || token === 'undefined') {
        toast({
          title: "Error de autenticación",
          description: "No hay sesión activa. Por favor, inicia sesión nuevamente.",
          variant: "destructive",
        });
        router.push('/login');
        return;
      }
  
      const response = await axios({
        url: `http://localhost:8080/Project/${params.id}/Contract`,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Authorization': `${token}`,
          'Accept': 'application/pdf',
        },
      });
  
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/pdf')) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Contrato_Proyecto_${params.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
  
        toast({
          title: "Éxito",
          description: "El PDF se ha descargado correctamente.",
        });
      } else {
        throw new Error('La respuesta del servidor no es un PDF');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast({
          title: "Error",
          description: "No se encontró el contrato para este proyecto.",
          variant: "destructive",
        });
        return;
      }
  
      if (error.response?.status === 401) {
        toast({
          title: "Error de autenticación",
          description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          variant: "destructive",
        });
        router.push('/login');
        return;
      }
  
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF del contrato.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      // await approveContract(params.id, contract)
      toast({
        title: "Contrato Aprobado",
        description: "El contrato ha sido aprobado y guardado.",
      })
      router.push(`/project/${params.id}/proposal`)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar el contrato. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo PDF para subir.",
        variant: "destructive",
      })
      return
    }
    setIsUploading(true)
    try {
      toast({
        title: "Contrato Subido",
        description: "El contrato en PDF se ha subido exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir el contrato. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return <div>Cargando contrato...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Contrato del Proyecto</h1>
      <div className="mb-8 p-4 border rounded-lg bg-white">
        <pre className="whitespace-pre-wrap">{contract}</pre>
      </div>
      
      {/* Opción para generar contrato con IA */}
      <div className="mb-4">
        <Button onClick={generateContract} disabled={isGenerating}>
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generando Contrato...' : 'Generar Contrato con IA'}
        </Button>
      </div>

      {/* Opción para descargar PDF */}
      <div className="mb-4">
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isDownloading}
          className="mr-4"
        >
          {isDownloading ? 'Descargando...' : 'Descargar PDF'}
        </Button>
      </div>

      {/* Opción para subir contrato en PDF */}
      <div className="mb-4">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <br />
        <Button onClick={handleFileUpload} disabled={isUploading || !file}>
          {isUploading ? 'Subiendo...' : 'Subir Contrato PDF'}
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Regresar
        </Button>
        <Button onClick={handleApprove} disabled={isApproving}>
          {isApproving ? 'Aprobando...' : 'Aprobar Contrato'}
        </Button>
      </div>
    </div>
  )
}