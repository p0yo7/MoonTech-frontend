"use client"

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Importamos el componente de forma dinámica para evitar errores de SSR
const ProjectSummary = dynamic(() => import('@/components/ui/project-summary'), { 
  ssr: false,
  loading: () => (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
      <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
      <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
    </div>
  )
});

export default function ProposalPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
      </div>
    }>
      <ProjectSummary />
    </Suspense>
  );
}