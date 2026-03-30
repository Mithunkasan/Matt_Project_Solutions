import { useState, useEffect } from 'react'
import { ClassSchedule } from '../types'

export function useClasses() {
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate day-wise stats
  const getDayStats = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    return days.map(day => ({
      day,
      count: classes.filter(cls => cls.day.toLowerCase() === day).length
    }))
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true)
        // Replace with your actual API call
        const res = await fetch('/api/public/classes')
        if (!res.ok) throw new Error('Failed to fetch classes')
        const data = await res.json()
        setClasses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  return {
    classes,
    loading,
    error,
    dayStats: getDayStats(),
    totalClasses: classes.length
  }
}