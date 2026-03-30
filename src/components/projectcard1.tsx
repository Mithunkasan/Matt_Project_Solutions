"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import Link from "next/link";

interface ProjectCardProps {
  projects: Project;
}

export function Projectcard1({ projects }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:border-[#12498b] dark:hover:border-blue-500 h-full flex flex-col">
      {/* Header Section with Accent Color */}
      <div className="bg-[#12498b] px-5 sm:px-6 py-4">
        <h3 className="font-bold text-xl sm:text-2xl text-white break-words">
          {projects.name}
        </h3>
      </div>

      <CardContent className="p-5 sm:p-6 flex-grow flex flex-col transition-colors">
        {/* College, Department, Handler Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-800">
          {[
            { key: "college", label: "College" },
            { key: "department", label: "Department" },
            { key: "handler", label: "Handler" }
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide mb-1">
                {label}
              </span>
              <p className="text-sm text-gray-800 dark:text-gray-300 font-medium break-words">
                {projects[key as keyof Project] as string}
              </p>
            </div>
          ))}
        </div>

        {/* Student, Date, Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide mb-1">
              Student
            </span>
            <p className="text-sm text-gray-800 dark:text-gray-300 font-medium break-words">{projects.student}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide mb-1">
              Project Date
            </span>
            <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">{formatDate(projects.date)}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide mb-1">
              Status
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-md text-xs font-bold w-fit ${projects.status === "completed"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-800"
                : projects.status === "ongoing"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-800"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                }`}
            >
              {projects.status.charAt(0).toUpperCase() + projects.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <Link href={`/browse/projects/${projects.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-2 border-[#16539b] text-[#16539b] dark:text-blue-400 dark:border-blue-600 hover:bg-[#16539b] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold transition-colors"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}