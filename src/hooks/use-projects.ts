import { useState, useEffect } from 'react'
import { Project } from '../types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate stats
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status.toLowerCase().includes('completed')).length
  const ongoingProjects = projects.filter(p => p.status.toLowerCase().includes('ongoing') || p.status.toLowerCase().includes('progress')).length
  const pendingProjects = projects.filter(p => p.status.toLowerCase().includes('pending')).length

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        // Replace with your actual API call
        const res = await fetch('/api/public/projects')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    stats: {
      total: totalProjects,
      completed: completedProjects,
      ongoing: ongoingProjects,
      pending: pendingProjects
    }
  }
}