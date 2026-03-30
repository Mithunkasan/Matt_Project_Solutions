// @/components/dashboard/DashboardClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { FiltersSection } from "@/components/dashboard/FiltersSection";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ClassScheduleCard } from "@/components/dashboard/ClassScheduleCard";
import { AddClassDialog } from "@/components/dashboard/AddClassDialog";
import { EditProjectDialog } from "@/components/dashboard/EditProjectDialog";
import { EditClassDialog } from "@/components/dashboard/EditClassDialog";
import { ProjectViewDialog } from "@/components/dashboard/ProjectViewDialog";
import { ClassViewDialog } from "@/components/dashboard/ClassViewDialog";
import { PageLoading } from "@/components/layout/PageLoading";
import { LoadingSpinner } from "@/components/ui/Loading";
import { useAppStore } from "@/lib/store";
import { Project, ClassSchedule } from "@/types";
import { Search, LayoutGrid, List, FileDown, Eye, Edit, Trash2 } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    projects,
    classSchedules,
    addProject,
    deleteProject,
    updateProject,
    addClassSchedule,
    deleteClassSchedule,
    updateClassSchedule,
    fetchProjects,
    fetchClassSchedules
  } = useAppStore();

  const [selectedTeam, setSelectedTeam] = useState("All MATT Teams");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "classes">("projects");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassSchedule | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const loadData = async () => {
      if (session) {
        setFetchingData(true);
        try {
          await Promise.all([
            fetchProjects(),
            fetchClassSchedules()
          ]);
        } catch (error) {
          console.error('Failed to load data:', error);
        } finally {
          setFetchingData(false);
          setLoading(false);
        }
      }
    };

    loadData();
  }, [session, fetchProjects, fetchClassSchedules]);

  // Reset search when changing tabs
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const handleProjectUpdated = (projectId: string, updatedData: Partial<Project>) => {
    updateProject(projectId, updatedData);
  };

  const handleProjectDeleted = (projectId: string) => {
    deleteProject(projectId);
  };

  const handleClassUpdated = (classId: string, updatedData: Partial<ClassSchedule>) => {
    updateClassSchedule(classId, updatedData);
  };

  const handleClassDeleted = (classId: string) => {
    deleteClassSchedule(classId);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();

    doc.setFontSize(22);
    doc.setTextColor(18, 73, 139); // #12498b
    doc.text("MATT Project Solutions Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${now}`, 14, 28);

    // Projects Table
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Projects", 14, 40);

    autoTable(doc, {
      startY: 45,
      head: [['Name', 'College', 'Department', 'Status', 'Amount', 'Date']],
      body: filteredProjects.map(p => [
        p.name || '',
        p.college || '',
        p.department || '',
        p.status.toUpperCase() || '',
        `INR ${p.finalAmount?.toLocaleString() || '0'}`,
        p.date || ''
      ]),
      headStyles: { fillColor: [18, 73, 139] },
    });

    // Classes Table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY || 45;
    if (finalY < 250) {
      doc.text("Class Schedules", 14, finalY + 10);
      autoTable(doc, {
        startY: finalY + 15,
        head: [['Project', 'Department', 'Faculty', 'Location', 'Date', 'Time']],
        body: filteredClassSchedules.map(c => [
          c.project || '',
          c.department || '',
          c.faculty || '',
          c.location || '',
          c.date ? new Date(c.date).toLocaleDateString() : '',
          c.time || ''
        ]),
        headStyles: { fillColor: [177, 34, 34] }, // #b12222
      });
    } else {
      doc.addPage();
      doc.text("Class Schedules", 14, 20);
      autoTable(doc, {
        startY: 25,
        head: [['Project', 'Department', 'Faculty', 'Location', 'Date', 'Time']],
        body: filteredClassSchedules.map(c => [
          c.project || '',
          c.department || '',
          c.faculty || '',
          c.location || '',
          c.date ? new Date(c.date).toLocaleDateString() : '',
          c.time || ''
        ]),
        headStyles: { fillColor: [177, 34, 34] }, // #b12222
      });
    }

    doc.save(`MATT_Solutions_Report_${new Date().getTime()}.pdf`);
  };

  if (status === "loading" || loading) {
    return <PageLoading />;
  }

  if (!session) {
    return null;
  }

  const handleProjectAdded = (newProject: Project) => {
    addProject(newProject);
  };

  const handleClassAdded = (newClass: ClassSchedule) => {
    addClassSchedule(newClass);
  };

  // Safe filtering function to handle undefined values
  const safeSearchMatch = (text: string | undefined | null, query: string): boolean => {
    if (!text) return false;
    return text.toLowerCase().includes(query.toLowerCase());
  };

  // Updated filtering logic with safe search
  const filteredProjects = projects.filter(project => {
    const teamMatch = selectedTeam === "All MATT Teams" || project.team === selectedTeam;
    const statusMatch = selectedStatus === "All Statuses" || project.status === selectedStatus.toLowerCase();

    const searchMatch = searchQuery === "" ||
      safeSearchMatch(project.name, searchQuery) ||
      safeSearchMatch(project.college, searchQuery) ||
      safeSearchMatch(project.department, searchQuery) ||
      safeSearchMatch(project.handler, searchQuery) ||
      safeSearchMatch(project.student, searchQuery);

    return teamMatch && statusMatch && searchMatch;
  });

  const filteredClassSchedules = classSchedules.filter(classItem => {
    const searchMatch = searchQuery === "" ||
      safeSearchMatch(classItem.project, searchQuery) ||
      safeSearchMatch(classItem.department, searchQuery) ||
      safeSearchMatch(classItem.faculty, searchQuery) ||
      safeSearchMatch(classItem.location, searchQuery);

    return searchMatch;
  });

  // Calculate stats dynamically
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalPayment = projects.reduce((sum, project) => sum + (project.amountPaid || 0), 0);
  const totalValue = projects.reduce((sum, project) => sum + (project.finalAmount || 0), 0);
  const totalClasses = classSchedules.length;

  // Prepare dynamic data for charts
  const getProjectsChartData = () => {
    const monthlyData: { [key: string]: { completed: number; ongoing: number; pending: number; total: number } } = {};
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleString('default', { month: 'short' }));
    }

    months.forEach(month => {
      monthlyData[month] = { completed: 0, ongoing: 0, pending: 0, total: 0 };
    });

    projects.forEach(project => {
      const date = project.createdAt ? new Date(project.createdAt) : new Date();
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { completed: 0, ongoing: 0, pending: 0, total: 0 };
      }

      monthlyData[monthKey].total++;
      if (project.status === 'completed') monthlyData[monthKey].completed++;
      else if (project.status === 'ongoing') monthlyData[monthKey].ongoing++;
      else monthlyData[monthKey].pending++;
    });

    return months.map(month => ({
      month,
      completed: monthlyData[month].completed,
      ongoing: monthlyData[month].ongoing,
      pending: monthlyData[month].pending,
      total: monthlyData[month].total
    }));
  };

  const getPaymentChartData = () => {
    const monthlyData: { [key: string]: { received: number; pending: number } } = {};
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleString('default', { month: 'short' }));
    }

    months.forEach(month => {
      monthlyData[month] = { received: 0, pending: 0 };
    });

    projects.forEach(project => {
      const date = project.createdAt ? new Date(project.createdAt) : new Date();
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { received: 0, pending: 0 };
      }

      monthlyData[monthKey].received += project.amountPaid || 0;
      monthlyData[monthKey].pending += (project.finalAmount || 0) - (project.amountPaid || 0);
    });

    return months.map(month => ({
      month,
      received: monthlyData[month].received,
      pending: monthlyData[month].pending
    }));
  };

  const getActivitiesChartData = () => {
    const dailyData: { [key: string]: { classes: number } } = {
      'Mon': { classes: 0 },
      'Tue': { classes: 0 },
      'Wed': { classes: 0 },
      'Thu': { classes: 0 },
      'Fri': { classes: 0 },
      'Sat': { classes: 0 },
      'Sun': { classes: 0 }
    };

    classSchedules.forEach(classItem => {
      if (classItem.date) {
        const date = new Date(classItem.date);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (dailyData[day]) {
          dailyData[day].classes++;
        }
      }
    });

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      classes: dailyData[day].classes
    }));
  };

  const isAdmin = session?.user?.role === 'ADMIN';

  const projectsTableData = projects.slice(0, 5).map((project, index) => ({
    id: index + 1,
    name: project.name,
    status: project.status.charAt(0).toUpperCase() + project.status.slice(1),
    progress: project.status === 'completed' ? 100 : project.status === 'ongoing' ? 50 : 0,
    ...(isAdmin && { amount: project.finalAmount || 0 })
  }));

  const paymentTableData = isAdmin ? projects.slice(0, 5).map((project, index) => ({
    id: index + 1,
    project: project.name,
    amount: project.finalAmount || 0,
    status: project.amountPaid === project.finalAmount ? 'Paid' :
      project.amountPaid && project.amountPaid > 0 ? 'Partial' : 'Pending',
    date: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'
  })) : [];

  const activitiesTableData = [
    ...classSchedules.slice(0, 5).map((item, index) => ({
      id: index + 1,
      name: item.project,
      type: 'Class' as const,
      date: item.date ? new Date(item.date).toLocaleDateString() : 'N/A'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 lg:p-8 transition-colors">
      <Header />

      {fetchingData && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <LoadingSpinner size="lg" color={activeTab === "projects" ? "blue" : "red"} />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-gray-800 p-1 w-full max-w-sm">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "projects"
              ? "bg-[#12498b] text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "classes"
              ? "bg-[#b12222] text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
          >
            Class Schedules
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "card" ? "bg-white dark:bg-gray-700 text-[#12498b] dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="Card View"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-white dark:bg-gray-700 text-[#12498b] dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="Table View"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          )}
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-sm"
          >
            <FileDown className="h-5 w-5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Admin Only */}
      {isAdmin && (
        <StatsCards
          totalProjects={totalProjects}
          completedProjects={completedProjects}
          totalPayment={totalPayment}
          totalValue={totalValue}
          activeClasses={totalClasses}
          activeTab={activeTab}
          projectsChartData={getProjectsChartData()}
          paymentChartData={getPaymentChartData()}
          activitiesChartData={getActivitiesChartData()}
          projectsTableData={projectsTableData}
          paymentTableData={paymentTableData}
          activitiesTableData={activitiesTableData}
          allProjects={projects}
          allClasses={classSchedules}
        />
      )}

      {/* Content */}
      {activeTab === "projects" && (
        <div className="space-y-6 lg:space-y-8">
          {isAdmin && (
            <FiltersSection
              selectedTeam={selectedTeam}
              selectedStatus={selectedStatus}
              searchQuery={searchQuery}
              onTeamChange={setSelectedTeam}
              onStatusChange={setSelectedStatus}
              onSearchChange={setSearchQuery}
              onProjectAdded={handleProjectAdded}
            />
          )}

          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex">
                  <ProjectCard
                    projects={project}
                    onDelete={handleProjectDeleted}
                    onUpdate={handleProjectUpdated}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Project Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">College</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Team</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                      {isAdmin && <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{project.department}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{project.college}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-900/30">
                            {project.team}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            project.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                            {project.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{project.finalAmount?.toLocaleString()}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => setViewingProject(project)}
                              className="p-1 px-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingProject(project)}
                              className="p-1 px-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleProjectDeleted(project.id)}
                              className="p-1 px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 col-span-full">
              {searchQuery ?
                `No projects found matching "${searchQuery}". Try a different search term.` :
                "No projects found. Create your first project!"
              }
            </div>
          )}
        </div>
      )}

      {activeTab === "classes" && (
        <div className="space-y-6 lg:space-y-8">
          {isAdmin && (
            <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b12222] h-5 w-5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search classes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-400 focus:border-[#b12222] focus:ring-2 focus:ring-[#b12222]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-3 items-center">
                    <AddClassDialog onClassAdded={handleClassAdded} />
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassSchedules.map((classItem) => (
                <div key={classItem.id} className="flex">
                  <ClassScheduleCard
                    classItem={classItem}
                    onDelete={handleClassDeleted}
                    onUpdate={handleClassUpdated}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Project Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Faculty</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                      {isAdmin && <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredClassSchedules.map((classItem) => (
                      <tr key={classItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{classItem.project}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{classItem.department}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{classItem.faculty}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30">
                            {classItem.location}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{classItem.date ? new Date(classItem.date).toLocaleDateString() : 'N/A'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-tighter">{classItem.time}</div>
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => setViewingClass(classItem)}
                              className="p-1 px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingClass(classItem)}
                              className="p-1 px-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleClassDeleted(classItem.id)}
                              className="p-1 px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredClassSchedules.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 col-span-full">
              {searchQuery ?
                `No classes found matching "${searchQuery}".` :
                "No class schedules found. Add your first class schedule!"
              }
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      {viewingProject && (
        <ProjectViewDialog
          project={viewingProject}
          open={!!viewingProject}
          onOpenChange={(open) => !open && setViewingProject(null)}
        />
      )}

      {editingProject && (
        <EditProjectDialog
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {viewingClass && (
        <ClassViewDialog
          classItem={viewingClass}
          open={!!viewingClass}
          onOpenChange={(open) => !open && setViewingClass(null)}
        />
      )}

      {editingClass && (
        <EditClassDialog
          classItem={editingClass}
          open={!!editingClass}
          onOpenChange={(open) => !open && setEditingClass(null)}
          onClassUpdated={handleClassUpdated}
        />
      )}
    </div>
  );
}
