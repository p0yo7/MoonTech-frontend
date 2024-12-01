// components/ProjectCard.tsx

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Building2, DollarSign, Users } from 'lucide-react';
import { generateContract } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';

interface Project {
  project_id: number;
  project_name: string;
  project_description: string;
  project_budget: number;
  company_name: string;
  company_description: string;
  company_size: number;
  features?: string[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleRequirements = () => {
    router.push(`/project/${project.project_id}/requirements`);
  };

  const handleTasks = () => {
    router.push(`/project/${project.project_id}/tasks`);
  };

  const handleDownload = async () => {
    try {
      const contract = await generateContract(project.project_id);
      const blob = new Blob([contract.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.project_name}_contract.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading contract:', error);
      toast({
        title: 'Error',
        description:
          'No se pudo descargar el contrato. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold">{project.project_name}</span>
          <span className="text-sm text-gray-500">ID: {project.project_id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-gray-600 line-clamp-2">
            {project.project_description}
          </p>

          <div className="grid grid-cols-2 gap-4 my-4">
            {[
              {
                key: 'company',
                icon: <Building2 className="h-4 w-4 text-gray-500" />,
                text: project.company_name,
              },
              {
                key: 'budget',
                icon: <DollarSign className="h-4 w-4 text-gray-500" />,
                text: `$${project.project_budget.toLocaleString()}`,
              },
              {
                key: 'size',
                icon: <Users className="h-4 w-4 text-gray-500" />,
                text: `Tamaño: ${project.company_size}`,
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {project.features && (
          <ul>
            {project.features.map((feature) => (
              <li key={feature} className="text-sm text-gray-600">
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="pt-4 space-y-2">
          <Button
            onClick={handleRequirements}
            className="w-full"
            variant="outline"
          >
            Requerimientos
          </Button>
          <Button onClick={handleTasks} className="w-full">
            Tareas
          </Button>
          <Button
            onClick={handleDownload}
            variant="secondary"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar Contrato
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>{project.company_description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
