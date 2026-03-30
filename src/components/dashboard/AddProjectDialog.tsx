"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddProjectForm } from "../../components/forms/AddProjectForm";
import { Project } from "@/types";

interface AddProjectDialogProps {
  onProjectAdded: (project: Project) => void;
}

export function AddProjectDialog({ onProjectAdded }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const handleProjectAdded = (project: Project) => {
    onProjectAdded(project);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 text-white bg-[#164c87] hover:bg-[#0f3761] h-10 px-1">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Project</DialogTitle>
        </DialogHeader>

        {/* Form container */}
        <div className="mt-4">
          <AddProjectForm
            onProjectAdded={(project) => {
              handleProjectAdded(project);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>

    </Dialog>
  );
}