"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types";
import { Building2, Calendar, User, Users, Tag, CreditCard } from "lucide-react";

interface ProjectViewDialogProps {
    project: Project | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProjectViewDialog({ project, open, onOpenChange }: ProjectViewDialogProps) {
    if (!project) return null;

    const progress = project.finalAmount && project.finalAmount > 0
        ? Math.round(((project.amountPaid || 0) / project.finalAmount) * 100)
        : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-full p-0 bg-white dark:bg-gray-900 rounded-xl shadow-xl border-none overflow-hidden">
                <div className="bg-[#12498b] px-6 py-8 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{project.name}</DialogTitle>
                    </DialogHeader>
                    <p className="opacity-80 mt-1">{project.college}</p>
                </div>

                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-[#12498b] dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{project.department || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-[#12498b] dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Team</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{project.team || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-[#12498b] dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{project.date ? new Date(project.date).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Tag className="w-5 h-5 text-[#12498b] dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${project.status === "completed"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : project.status === "ongoing"
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        }`}>
                                        {project.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-[#12498b] dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID/Name</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{project.student || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#12498b] dark:text-blue-400" />
                            Payment Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Amount Paid</p>
                                <p className="text-xl font-bold text-[#12498b] dark:text-blue-400">₹{project.amountPaid?.toLocaleString() || "0"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Final Amount</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">₹{project.finalAmount?.toLocaleString() || "0"}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Payment Progress</span>
                                <span className="font-bold text-[#12498b] dark:text-blue-400">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-[#12498b] to-blue-500 h-2.5 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
