'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/project-card';
import { NewProjectCard } from '@/components/new-project-card';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Project {
  project_id: string | number;
  project_name: string;
  project_description: string;
  project_budget: number;
  company_name: string;
  company_description: string;
  company_size: number;
}

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = Cookies.get('authToken');
      const userId = Cookies.get('userID');

      if (!token || !userId) {
        const errorMsg = 'Por favor, inicia sesión para ver los proyectos.';
        setError(errorMsg);
        toast({
          title: 'Error de autenticación',
          description: errorMsg,
          variant: 'destructive',
        });
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/ActiveProjects/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response data:', response.data);

      let projectsData = [];

      if (response.data === null) {
        projectsData = [];
      } else if (Array.isArray(response.data)) {
        projectsData = response.data;
      } else if (typeof response.data === 'object') {
        projectsData = [response.data]; // Convertimos el objeto en un arreglo
      } else {
        throw new Error(
          'Expected array or object of projects but got: ' + typeof response.data
        );
      }

      // Mapear los proyectos para que coincidan con la estructura esperada
      const mappedProjects = projectsData.map((project: any) => ({
        project_id: project.id,
        project_name: project.projName,
        project_description: project.project_description,
        project_budget: Number(project.project_budget),
        company_name: project.company_name,
        company_description: project.company_description,
        company_size: Number(project.company_size),
      }));

      // Verificar que project_id esté definido y sea único
      const projectIds = mappedProjects.map((project) => project.project_id);
      const uniqueProjectIds = new Set(projectIds);

      if (projectIds.length !== uniqueProjectIds.size) {
        console.error(
          'Hay project_id duplicados o indefinidos en los proyectos:',
          projectIds
        );
      }

      setProjects(mappedProjects);
    } catch (error) {
      let errorMessage =
        'No se pudieron cargar los proyectos. Por favor, intenta de nuevo.';

      if (axios.isAxiosError(error)) {
        console.log('Axios error:', error);
        if (error.response) {
          errorMessage = error.response.data?.error || errorMessage;
          console.log('Error response data:', error.response.data);
        } else if (error.request) {
          errorMessage =
            'Error de conexión. Por favor, verifica tu conexión a internet.';
        }
      } else {
        console.error('Error:', error);
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

  const handleNewProject = (project: Project) => {
    setProjects([...projects, project]);

    toast({
      title: 'Éxito',
      description: 'Nuevo proyecto creado con éxito.',
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadProjects}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        if (project.project_id === undefined || project.project_id === null) {
          console.error(
            'El project_id está indefinido para el proyecto:',
            project
          );
        }
        return (
          <ProjectCard
            key={project.project_id}
            project={project}
          />
        );
      })}
      <NewProjectCard
        key="new-project"
        onNewProject={handleNewProject}
      />
    </div>
  );
}
