"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditProjectForm } from "../../components/forms/EditProjectForm";
import { Project } from "@/types";

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: (id: string, updatedData: Partial<Project>) => void;
}

export function EditProjectDialog({ project, open, onOpenChange, onProjectUpdated }: EditProjectDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Project: {project.name}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <EditProjectForm
            project={project}
            onProjectUpdated={onProjectUpdated}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}