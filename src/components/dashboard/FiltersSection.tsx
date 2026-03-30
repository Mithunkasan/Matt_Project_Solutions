// "use client";

// import { Search } from "lucide-react";
// import { AddProjectDialog } from "./AddProjectDialog";
// import { useAppStore } from "@/lib/store";

// interface FiltersSectionProps {
//   selectedTeam: string;
//   selectedStatus: string;
//   onTeamChange: (team: string) => void;
//   onStatusChange: (status: string) => void;
//   onProjectAdded: (project: any) => void;
// }

// const teams = ["All MATT Teams", "HR", "AI", "Hardware", "Software", "JClicks", "CAD Point"];
// const statuses = ["All Statuses", "Pending", "Ongoing", "Completed"];

// export function FiltersSection({
//   selectedTeam,
//   selectedStatus,
//   onTeamChange,
"use client";

import { Search } from "lucide-react";
import { AddProjectDialog } from "./AddProjectDialog";
import { useAppStore } from "@/lib/store";
import { Project } from "@/types";
import { useSession } from "next-auth/react";

interface FiltersSectionProps {
  selectedTeam: string;
  selectedStatus: string;
  searchQuery: string;
  onTeamChange: (team: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (query: string) => void;
  onProjectAdded: (project: Project) => void;
}

const teams = ["All MATT Teams", "HR", "AI", "Hardware", "Software", "JClicks", "CAD Point"];
const statuses = ["All Statuses", "Pending", "Ongoing", "Completed"];

export function FiltersSection({
  selectedTeam,
  selectedStatus,
  searchQuery,
  onTeamChange,
  onStatusChange,
  onSearchChange,
  onProjectAdded,
}: FiltersSectionProps) {
  const { data: session } = useSession();
  const handleProjectAdded = (project: Project) => {
    onProjectAdded(project);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      {/* Main Container with proper spacing */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">

        {/* Search Bar - Takes full width on mobile, flex-grows on desktop */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#12498b] dark:text-blue-400 h-5 w-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-400 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#12498b]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Filters Group - Wraps nicely on mobile */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-stretch sm:items-center">

          {/* Team Select */}
          <div className="relative">
            <select
              className="h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white font-medium focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#12498b]/20 outline-none cursor-pointer appearance-none transition-all min-w-[160px] hover:border-[#12498b] dark:hover:border-blue-500"
              value={selectedTeam}
              onChange={(e) => onTeamChange(e.target.value)}
            >
              {teams.map((team) => (
                <option key={team} value={team} className="bg-white dark:bg-gray-900">
                  {team}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-[#12498b] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Status Select */}
          <div className="relative">
            <select
              className="h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white font-medium focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#12498b]/20 outline-none cursor-pointer appearance-none transition-all min-w-[160px] hover:border-[#12498b] dark:hover:border-blue-500"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status} className="bg-white dark:bg-gray-900">
                  {status}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-[#12498b] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Add Project Button - Admin Only */}
          {session?.user?.role === 'ADMIN' && (
            <div className="flex items-center">
              <AddProjectDialog onProjectAdded={handleProjectAdded} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}