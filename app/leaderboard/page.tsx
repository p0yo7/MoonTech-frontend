"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Rocket } from '@/components/rocket'
import { fetchLeaderboard } from '@/utils/api'

interface Project {
  id: string
  name: string
  logo?: string
  completedTasks: number
  highEffortTasks: number
}

export default function LeaderboardPage() {
  const [topProjects, setTopProjects] = useState<Project[]>([])
  const router = useRouter()

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const leaderboard = await fetchLeaderboard()
      setTopProjects(leaderboard)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Project Leaderboard</h1>
      <div className="flex justify-center items-end space-x-8 mb-12">
        {topProjects.map((project, index) => (
          <div key={project.id} className="flex flex-col items-center">
            <Rocket 
              size={index === 0 ? 'large' : index === 1 ? 'medium' : 'small'} 
              logo={project.logo}
            />
            <p className="mt-4 text-lg font-semibold">{project.name}</p>
            <p className="text-sm text-gray-600">{project.highEffortTasks} high effort tasks</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  )
}

