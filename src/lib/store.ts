// @/lib/store.ts
"use client";

import { create } from 'zustand'
import { Project, ClassSchedule } from '@/types'

interface AppState {
  projects: Project[]
  classSchedules: ClassSchedule[]
  setProjects: (projects: Project[]) => void
  setClassSchedules: (classes: ClassSchedule[]) => void
  addProject: (project: Project) => void
  deleteProject: (id: string) => void
  updateProject: (id: string, updatedData: Partial<Project>) => void
  addClassSchedule: (classItem: ClassSchedule) => void
  deleteClassSchedule: (id: string) => void
  updateClassSchedule: (id: string, updatedData: Partial<ClassSchedule>) => void
  fetchProjects: () => Promise<void>
  fetchClassSchedules: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  projects: [],
  classSchedules: [],

  setProjects: (projects) => set({ projects }),
  setClassSchedules: (classSchedules) => set({ classSchedules }),

  addProject: (project) =>
    set((state) => {
      // Prevent duplicates
      if (state.projects.some(p => p.id === project.id)) return state;
      return { projects: [project, ...state.projects] };
    }),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter(project => project.id !== id)
    })),

  updateProject: (id, updatedData) =>
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === id ? { ...project, ...updatedData } : project
      )
    })),

  addClassSchedule: (classItem) =>
    set((state) => {
      // Prevent duplicates
      if (state.classSchedules.some(c => c.id === classItem.id)) return state;
      return { classSchedules: [classItem, ...state.classSchedules] };
    }),

  deleteClassSchedule: (id) =>
    set((state) => ({
      classSchedules: state.classSchedules.filter(classItem => classItem.id !== id)
    })),

  updateClassSchedule: (id, updatedData) =>
    set((state) => ({
      classSchedules: state.classSchedules.map(classItem =>
        classItem.id === id ? { ...classItem, ...updatedData } : classItem
      )
    })),

  fetchProjects: async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const projects = await response.json()
        set({ projects })
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  },

  fetchClassSchedules: async () => {
    try {
      const response = await fetch('/api/classes')
      if (response.ok) {
        const classSchedules = await response.json()
        set({ classSchedules })
      }
    } catch (error) {
      console.error('Failed to fetch class schedules:', error)
    }
  },
}))