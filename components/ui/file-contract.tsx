"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, DollarSign, Building2, ListChecks, FileCheck2, Download, Home, FileContract } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Project {
  project_id: string | number;
  project_name: string;
  project_description: string;
  project_budget: number | null;
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
  const projectId = params?.id;
  
  const [project, setProject] = useState<Project | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError('ID del proyecto no encontrado');
        setIsLoading(false);
        return;
      }
      await loadProjectData();
    };

    fetchData();
  }, [projectId]);

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
      
      // Wrap API calls in try-catch for more granular error handling
      try {
        const projectResponse = await axios.get(`http://localhost:8080/Project/${projectId}`, { headers });
        setProject(projectResponse.data);
      } catch (error) {
        console.error('Error fetching project:', error);
        throw new Error('Error al cargar los datos del proyecto');
      }

      try {
        const requirementsResponse = await axios.get(`http://localhost:8080/Project/${projectId}/Requirements`, { headers });
        setRequirements(requirementsResponse.data || []);
      } catch (error) {
        console.error('Error fetching requirements:', error);
        setRequirements([]);
      }

      try {
        const tasksResponse = await axios.get(`http://localhost:8080/Project/${projectId}/Tasks`, { headers });
        setTasks(tasksResponse.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }

    } catch (error) {
      let errorMessage = 'Error al cargar los datos del proyecto';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('project-summary');
      if (!element) {
        throw new Error('Element not found');
      }

      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 1,
        filename: `propuesta-proyecto-${projectId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('No se pudo generar el PDF');
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null) return 'No especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
          type="button"
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">No se encontró el proyecto</p>
      </div>
    );
  }

  // Safely calculate totals with null checks
  const totalHours = tasks.reduce((acc, task) => 
    acc + (Number.isFinite(task?.task_estimated_time) ? task.task_estimated_time : 0), 
    0
  );

  const totalCost = tasks.reduce((acc, task) => 
    acc + (Number.isFinite(task?.task_estimated_cost) ? task.task_estimated_cost : 0), 
    0
  );

  const renderProjectInfo = () => {
    if (!project) return null;
    
    return (
      <div className="space-y-2">
        <p>
          <span className="font-medium">Presupuesto: </span>
          {formatCurrency(project.project_budget)}
        </p>
        <p>
          <span className="font-medium">Empresa: </span>
          {project.company_name || 'No especificado'}
        </p>
        <p>
          <span className="font-medium">Descripción de empresa: </span>
          {project.company_description || 'No especificado'}
        </p>
        <p>
          <span className="font-medium">Tamaño de empresa: </span>
          {project.company_size || 'No especificado'}
        </p>
      </div>
    );
  };

  const renderRequirements = () => {
    if (!Array.isArray(requirements)) return null;

    return requirements.length > 0 ? (
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
    );
  };

  const renderTasks = () => {
    if (!Array.isArray(tasks)) return null;

    return tasks.length > 0 ? (
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
              {formatCurrency(task.task_estimated_cost)}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center">No hay tareas registradas</p>
    );
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <nav className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/')}
          type="button"
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <Home className="h-4 w-4" />
          Inicio
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleDownloadPDF}
            type="button"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Descargar Propuesta
          </button>
          <button
            onClick={() => router.push(`/project/${projectId}/contract`)}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileContract className="h-4 w-4" />
            Ir a Contrato
          </button>
        </div>
      </nav>

      <div id="project-summary" className="space-y-6">
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {project.project_name || 'Sin nombre'}
              </h1>
              <p className="text-gray-600 mt-2">{project.project_description || 'Sin descripción'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Información del Proyecto</h3>
              {renderProjectInfo()}
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
                  <span>Costo total estimado: {formatCurrency(totalCost)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <FileCheck2 className="h-6 w-6" />
            Requerimientos
          </h2>
          <div className="space-y-4">
            {renderRequirements()}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <ListChecks className="h-6 w-6" />
            Tareas
          </h2>
          <div className="space-y-4">
            {renderTasks()}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectSummary;