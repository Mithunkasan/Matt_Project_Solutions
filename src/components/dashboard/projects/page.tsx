"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Building2, Users, DollarSign, Trash2, Edit } from "lucide-react"
import { EditProjectDialog } from "@/components/dashboard/EditProjectDialog"
import type { Project } from "@/types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleEditClick = (project: Project) => {
    setEditingProject(project)
    setIsEditDialogOpen(true)
  }

  const handleProjectUpdated = (id: string, updatedData: Partial<Project>) => {
    setProjects(prev =>
      prev.map(proj => proj.id === id ? { ...proj, ...updatedData } : proj)
    )
  }

  if (loading) {
    return <div className="text-center py-12">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and view all college projects</p>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative group">
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-[#12498b] to-[#b12222] border-0 text-white overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white">{project.name}</CardTitle>
                    <Badge variant="secondary" className="bg-white text-[#12498b]">
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-100">{project.college}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>{project.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>Team: {project.team}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Paid: ${project.amountPaid} / ${project.finalAmount}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: `${project.paymentProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-100 mt-1">{project.paymentProgress}% paid</p>
                  </div>

                  <div className="flex gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditClick(project)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <EditProjectDialog
        project={editingProject}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onProjectUpdated={handleProjectUpdated}
      />
    </div>
  )
}