"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddClassForm } from "../../components/forms/AddClassForm";
import { ClassSchedule } from "@/types";

interface AddClassDialogProps {
  onClassAdded: (classItem: ClassSchedule) => void;
}

export function AddClassDialog({ onClassAdded }: AddClassDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClassAdded = (classItem: ClassSchedule) => {
    onClassAdded(classItem);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2 text-white bg-[#b12222] hover:bg-[#960507] h-10 px-1">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Class Schedule</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <AddClassForm onClassAdded={handleClassAdded} onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}