// Centralize API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Unified fetch method with auth
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

// Auth
export async function register(userData: { name: string; email: string; password: string }) {
  return fetchWithAuth('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function login(credentials: { email: string; password: string }) {
  const response = await fetchWithAuth('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
}

export function logout() {
  localStorage.removeItem('token');
}

// Projects
export async function fetchProjects() {
  return fetchWithAuth('/projects');
}

export async function createProject(projectData: any) {
  return fetchWithAuth('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData)
  });
}

export async function fetchProject(projectId: string) {
  return fetchWithAuth(`/projects/${projectId}`);
}

export async function updateProject(projectId: string, projectData: {
  name: string;
  description: string;
  deadline?: string;
  logo?: string;
}) {
  return fetchWithAuth(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
}

export async function deleteProject(projectId: string) {
  return fetchWithAuth(`/projects/${projectId}`, {
    method: 'DELETE',
  });
}

// Tasks
export async function fetchTasks(projectId: string) {
  return fetchWithAuth(`/projects/${projectId}/tasks`);
}

export async function createTask(projectId: string, taskData: {
  name: string;
  description: string;
  estimatedTime: number;
  effort: 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High';
  estimatedCost: number;
}) {
  return fetchWithAuth(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(projectId: string, taskId: string, taskData: {
  name: string;
  description: string;
  estimatedTime: number;
  effort: 'Low' | 'Medium' | 'High';
  priority: 'Low' | 'Medium' | 'High';
  estimatedCost: number;
  completed: boolean;
}) {
  return fetchWithAuth(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
}

export async function deleteTask(projectId: string, taskId: string) {
  return fetchWithAuth(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

// Requirements
export const fetchRequirements = async (projectId: string) => {
  return fetchWithAuth(`/projects/${projectId}/requirements`);
}

export const createRequirement = async (projectId: string, description: string) => {
  return fetchWithAuth('/requirements', {
    method: 'POST',
    body: JSON.stringify({ projectId, description }),
  });
}

export async function updateRequirement(projectId: string, requirementId: string, requirementData: { description: string }) {
  return fetchWithAuth(`/projects/${projectId}/requirements/${requirementId}`, {
    method: 'PUT',
    body: JSON.stringify(requirementData),
  });
}

export async function deleteRequirement(projectId: string, requirementId: string) {
  return fetchWithAuth(`/projects/${projectId}/requirements/${requirementId}`, {
    method: 'DELETE',
  });
}

// Special case for file upload (needs different Content-Type)
export async function uploadFile(formData: FormData): Promise<{ url: string }> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to upload file');
  }
  return response.json();
}

// AI-assisted generation
export const generateRequirements = async (projectId: string, description: string) => {
  return fetchWithAuth('/requirements/generate', {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      description,
      existingRequirements: []
    }),
  });
}

export async function generateTasks(projectId: string) {
  return fetchWithAuth(`/projects/${projectId}/generate-tasks`, {
    method: 'POST',
  });
}

export async function generateContract(projectId: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/contract`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to generate contract');
  }
  return response.json();
}

export async function approveContract(projectId: string, contractContent: string) {
  return fetchWithAuth(`/projects/${projectId}/approve-contract`, {
    method: 'POST',
    body: JSON.stringify({ content: contractContent }),
  });
}

// Leaderboard
export async function fetchLeaderboard() {
  return fetchWithAuth('/leaderboard');
}

