import { ProjectGrid } from '@/components/project-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
        <Link href="/leaderboard">
          <Button>View Leaderboard</Button>
        </Link>
      </div>
      <ProjectGrid />
    </div>
  )
}

