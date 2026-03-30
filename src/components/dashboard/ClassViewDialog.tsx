"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClassSchedule } from "@/types";
import { Calendar, Clock, User, MapPin } from "lucide-react";

interface ClassViewDialogProps {
    classItem: ClassSchedule | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ClassViewDialog({ classItem, open, onOpenChange }: ClassViewDialogProps) {
    if (!classItem) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-full p-0 bg-white dark:bg-gray-900 rounded-xl shadow-xl border-none overflow-hidden">
                <div className="bg-[#b12222] px-6 py-8 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{classItem.project}</DialogTitle>
                    </DialogHeader>
                    <p className="opacity-80 mt-1">{classItem.department}</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-[#b12222] dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Faculty</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{classItem.faculty || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-[#b12222] dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{classItem.location || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-[#b12222] dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Day</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {classItem.date ? new Date(classItem.date).toLocaleDateString() : "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.day}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-[#b12222] dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{classItem.time || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Please ensure you arrive at the location at least 10 minutes before the scheduled time.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
