"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Clock, DollarSign, Building2, ListChecks, FileCheck2, Home, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';

interface Project {
  project_id: string | number;
  project_name: string;
  project_description: string;
  project_budget: number;
  company_name: string;
  company_description: string;
  company_size: number;
}

interface Requirement {
  requirement_id: number;
  requirement_description: string;
  requirement_approved: boolean;
  requirement_timestamp: string;
}

interface Task {
  task_id: number;
  task_title: string;
  task_description: string;
  task_estimated_time: number;
  task_estimated_cost: number;
}

const ProjectSummary = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  
  const [project, setProject] = useState<Project | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const handleGoToContract = () => {
    router.push(`/project/${projectId}/contract`);
  };

  const handleGoToHome = () => {
    router.push('/dashboard');
  };

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = Cookies.get('authToken');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const headers = {
        Authorization: `${token}`,
      };
      
      // Cargar datos del proyecto
      const projectResponse = await axios.get(`http://localhost:8080/Project/${projectId}`, { headers });
      setProject(projectResponse.data);

      // Cargar requerimientos
      const requirementsResponse = await axios.get(`http://localhost:8080/Project/${projectId}/Requirements`, { headers });
      setRequirements(requirementsResponse.data);

      // Cargar tareas
      const tasksResponse = await axios.get(`http://localhost:8080/Project/${projectId}/Tasks`, { headers });
      setTasks(tasksResponse.data);

    } catch (error) {
      let errorMessage = 'Error al cargar los datos del proyecto';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadProjectData}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const totalHours = tasks.reduce((acc, task) => acc + task.task_estimated_time, 0);
  const totalCost = tasks.reduce((acc, task) => acc + task.task_estimated_cost, 0);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Información General del Proyecto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {project.project_name}
          </CardTitle>
          <CardDescription>{project.project_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Información del Proyecto</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Presupuesto:</span> ${project.project_budget.toLocaleString()}</p>
                <p><span className="font-medium">Empresa:</span> {project.company_name}</p>
                <p><span className="font-medium">Descripción de empresa:</span> {project.company_description}</p>
                <p><span className="font-medium">Tamaño de empresa:</span> {project.company_size}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resumen de Recursos</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Tiempo total estimado: {totalHours} horas</span>
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Costo total estimado: ${totalCost}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requerimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <FileCheck2 className="h-6 w-6" />
            Requerimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requirements.length > 0 ? (
              requirements.map((req) => (
                <div key={req.requirement_id} className="border p-4 rounded-lg">
                  <p className="font-medium">Requerimiento #{req.requirement_id}</p>
                  <p className="text-gray-600">{req.requirement_description}</p>
                  <p className="text-sm mt-2">
                    Estado: {req.requirement_approved ? 'Aprobado' : 'Pendiente'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No hay requerimientos registrados</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tareas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ListChecks className="h-6 w-6" />
            Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.task_id} className="border p-4 rounded-lg">
                  <h4 className="font-medium">{task.task_title}</h4>
                  <p className="text-gray-600 mt-1">{task.task_description}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {task.task_estimated_time} horas
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${task.task_estimated_cost}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No hay tareas registradas</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          onClick={handleGoToContract}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar a Contrato
        </Button>
        <Button 
          onClick={handleGoToHome}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Ir a Inicio
        </Button>
      </div>
    </div>
  );
};

export default ProjectSummary;