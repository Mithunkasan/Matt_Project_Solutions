"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditClassForm } from "../../components/forms/EditClassForm";
import { ClassSchedule } from "@/types";

interface EditClassDialogProps {
  classItem: ClassSchedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassUpdated: (id: string, updatedData: Partial<ClassSchedule>) => void;
}

export function EditClassDialog({ classItem, open, onOpenChange, onClassUpdated }: EditClassDialogProps) {
  if (!classItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Class Schedule: {classItem.project}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <EditClassForm
            classSchedule={classItem}
            onClassUpdated={onClassUpdated}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}