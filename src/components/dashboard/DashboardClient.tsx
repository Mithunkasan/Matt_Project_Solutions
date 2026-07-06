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
import { Search, LayoutGrid, List, FileDown, Eye, Edit, Trash2, Plus, X } from "lucide-react";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { CourseManager } from "@/components/dashboard/CourseManager";
import { MeetingManager } from "@/components/dashboard/MeetingManager";
import { AdminChatHub } from "@/components/dashboard/AdminChatHub";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface CourseEnrollment {
  id: string;
  courseId: string;
  studentEmail: string;
  studentName: string;
  progress: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseItem {
  id: string;
  name: string;
  description: string | null;
  department: string;
  duration: string;
  faculty: string;
  progress?: number;
  status?: string;
  schedules?: ClassSchedule[];
  enrollments?: CourseEnrollment[];
}

interface MeetingItem {
  id: string;
  studentEmail: string;
  title: string;
  date: string;
  time: string;
  meetLink: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationItem {
  id: string;
  studentEmail: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface ImportantLinkItem {
  id: string;
  title: string;
  url: string;
}

interface AnnouncementItem {
  id: string;
  month: string;
  day: string;
  title: string;
  href: string;
}

interface OfferItem {
  id: string;
  text: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

interface InternshipRegistrationItem {
  id: string;
  fullName: string;
  collegeName: string;
  yearOfStudy: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

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

  const isAdmin = session?.user?.role === 'ADMIN';

  const [selectedTeam, setSelectedTeam] = useState("All MATT Teams");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "classes" | "courses" | "meetings" | "chat" | "links" | "announcements" | "offers" | "internships">("projects");

  // Custom States for Courses, Meetings, Notifications
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassSchedule | null>(null);

  // Landing Page Management States
  const [landingLinks, setLandingLinks] = useState<ImportantLinkItem[]>([]);
  const [landingAnnouncements, setLandingAnnouncements] = useState<AnnouncementItem[]>([]);
  const [landingOffers, setLandingOffers] = useState<OfferItem[]>([]);
  const [internshipRegistrations, setInternshipRegistrations] = useState<InternshipRegistrationItem[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState<{ id?: string; title: string; url: string }>({ title: "", url: "" });
  const [annForm, setAnnForm] = useState<{ id?: string; month: string; day: string; title: string; href: string }>({
    month: "",
    day: "",
    title: "",
    href: "",
  });
  const [offerForm, setOfferForm] = useState<{ id?: string; text: string; link: string }>({
    text: "",
    link: "",
  });
  const [mgmtError, setMgmtError] = useState("");
  const [mgmtLoading, setMgmtLoading] = useState(false);

  // Fetch functions for Landing Page Management
  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/landing/links");
      if (res.ok) setLandingLinks(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/landing/announcements");
      if (res.ok) setLandingAnnouncements(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/landing/offers");
      if (res.ok) setLandingOffers(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInternshipRegistrations = async () => {
    try {
      const res = await fetch("/api/internship/list");
      if (res.ok) setInternshipRegistrations(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) setCourses(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await fetch("/api/meetings");
      if (res.ok) setMeetings(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

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
          const promises = [
            fetchProjects(), 
            fetchClassSchedules(),
            fetchCourses(),
            fetchMeetings(),
            fetchNotifications()
          ];
          if (isAdmin) {
            promises.push(fetchLinks());
            promises.push(fetchAnnouncements());
            promises.push(fetchOffers());
            promises.push(fetchInternshipRegistrations());
          }
          await Promise.all(promises);
        } catch (error) {
          console.error('Failed to load data:', error);
        } finally {
          setFetchingData(false);
          setLoading(false);
        }
      }
    };

    loadData();
  }, [session, fetchProjects, fetchClassSchedules, isAdmin]);

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

  // Important Link API actions
  const openLinkModal = (item?: ImportantLinkItem) => {
    if (item) {
      setLinkForm({ id: item.id, title: item.title, url: item.url });
    } else {
      setLinkForm({ title: "", url: "" });
    }
    setMgmtError("");
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMgmtLoading(true);
    setMgmtError("");

    const isEdit = !!linkForm.id;
    const url = "/api/landing/links";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkForm),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchLinks();
        setIsLinkModalOpen(false);
      } else {
        setMgmtError(data.error || "Failed to save link");
      }
    } catch {
      setMgmtError("Network error. Please try again.");
    } finally {
      setMgmtLoading(false);
    }
  };

  const handleLinkDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      const res = await fetch(`/api/landing/links?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchLinks();
      } else {
        alert("Failed to delete link");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Announcement API actions
  const openAnnModal = (item?: AnnouncementItem) => {
    if (item) {
      setAnnForm({ id: item.id, month: item.month, day: item.day, title: item.title, href: item.href });
    } else {
      const date = new Date();
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      setAnnForm({
        month: monthNames[date.getMonth()],
        day: date.getDate().toString(),
        title: "",
        href: "/browse?tab=projects",
      });
    }
    setMgmtError("");
    setIsAnnModalOpen(true);
  };

  const handleAnnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMgmtLoading(true);
    setMgmtError("");

    const isEdit = !!annForm.id;
    const url = "/api/landing/announcements";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(annForm),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchAnnouncements();
        setIsAnnModalOpen(false);
      } else {
        setMgmtError(data.error || "Failed to save announcement");
      }
    } catch {
      setMgmtError("Network error. Please try again.");
    } finally {
      setMgmtLoading(false);
    }
  };

  const handleAnnDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/landing/announcements?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchAnnouncements();
      } else {
        alert("Failed to delete announcement");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Scrolling Offers Actions
  const openOfferModal = (item?: OfferItem) => {
    if (item) {
      setOfferForm({ id: item.id, text: item.text, link: item.link || "" });
    } else {
      setOfferForm({
        text: "",
        link: "",
      });
    }
    setMgmtError("");
    setIsOfferModalOpen(true);
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMgmtLoading(true);
    setMgmtError("");

    const isEdit = !!offerForm.id;
    const url = "/api/landing/offers";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerForm),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchOffers();
        setIsOfferModalOpen(false);
      } else {
        setMgmtError(data.error || "Failed to save offer");
      }
    } catch {
      setMgmtError("Network error. Please try again.");
    } finally {
      setMgmtLoading(false);
    }
  };

  const handleOfferDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/landing/offers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchOffers();
      } else {
        alert("Failed to delete offer");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInternshipDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship application?")) return;
    try {
      const res = await fetch(`/api/internship/list?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchInternshipRegistrations();
      } else {
        alert("Failed to delete internship application");
      }
    } catch (e) {
      console.error(e);
    }
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

  const showStatsCards = isAdmin && (activeTab === "projects" || activeTab === "classes");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 lg:p-8 transition-colors">
        <Header />
        <main className="max-w-7xl mx-auto py-8">
          <StudentDashboard
            session={session}
            projects={projects}
            courses={courses}
            meetings={meetings}
            notifications={notifications}
            onRefreshData={async () => {
              await Promise.all([fetchProjects(), fetchClassSchedules(), fetchCourses(), fetchMeetings(), fetchNotifications()]);
            }}
          />
        </main>
      </div>
    );
  }

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
        <div className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-gray-800 p-1 w-full max-w-2xl overflow-x-auto">
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
            Schedules
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "courses"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab("meetings")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "meetings"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Meetings
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "chat"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Chat Support
              </button>
              <button
                onClick={() => setActiveTab("links")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "links"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Links
              </button>
              <button
                onClick={() => setActiveTab("announcements")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "announcements"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                What&apos;s New
              </button>
              <button
                onClick={() => setActiveTab("offers")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "offers"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Offers
              </button>
              <button
                onClick={() => setActiveTab("internships")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "internships"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Internships
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (activeTab === "projects" || activeTab === "classes") && (
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
          {(activeTab === "projects" || activeTab === "classes") && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-sm"
            >
              <FileDown className="h-5 w-5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards - Admin Only */}
      {showStatsCards && (
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

      {/* Content tabs */}
      {activeTab === "courses" && isAdmin && (
        <CourseManager />
      )}

      {activeTab === "meetings" && isAdmin && (
        <MeetingManager />
      )}

      {activeTab === "chat" && isAdmin && (
        <AdminChatHub />
      )}

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

      {/* 3. Important Links Management Tab */}
      {activeTab === "links" && isAdmin && (
        <div className="space-y-6 lg:space-y-8 animate-fadeIn">
          {/* Header Action Strip */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition-colors">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Important Links</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage links displayed on the main landing page sidebar</p>
            </div>
            <button
              onClick={() => openLinkModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add New Link
            </button>
          </div>

          {/* Table List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Link Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">URL / Path</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {landingLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{link.title}</span>
                        {link.id.startsWith("default-") && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 font-mono">{link.url}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openLinkModal(link)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer inline-flex"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleLinkDelete(link.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer inline-flex"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {landingLinks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-gray-500 text-xs">No links found. Add one above!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. What's New Announcements Management Tab */}
      {activeTab === "announcements" && isAdmin && (
        <div className="space-y-6 lg:space-y-8 animate-fadeIn">
          {/* Header Action Strip */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition-colors">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">What&apos;s New Announcements</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage announcements displayed in the timeline feed on the landing page</p>
            </div>
            <button
              onClick={() => openAnnModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Announcement
            </button>
          </div>

          {/* Table List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-24 text-center">Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Announcement Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Target Path</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {landingAnnouncements.map((ann) => (
                    <tr key={ann.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded w-16 text-xs font-bold">
                          <span className="text-[9px] uppercase tracking-wider text-gray-500">{ann.month}</span>
                          <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200 mt-0.5">{ann.day}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white leading-relaxed block">{ann.title}</span>
                        {ann.id.startsWith("default-") && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 font-mono">{ann.href}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAnnModal(ann)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer inline-flex"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAnnDelete(ann.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer inline-flex"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {landingAnnouncements.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-gray-500 text-xs">No announcements found. Add one above!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Scrolling Offers Management Tab */}
      {activeTab === "offers" && isAdmin && (
        <div className="space-y-6 lg:space-y-8 animate-fadeIn">
          {/* Header Action Strip */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition-colors">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Scrolling Announcement Bar Offers</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage announcements and offers displayed in the continuous scrolling marquee on the landing page</p>
            </div>
            <button
              onClick={() => openOfferModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Offer
            </button>
          </div>

          {/* Table List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Offer / Announcement Text</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Link (Optional)</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {landingOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-950 dark:text-gray-100 max-w-md break-words">
                        {offer.text}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {offer.link ? (
                          <a href={offer.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                            {offer.link}
                          </a>
                        ) : (
                          <span className="italic font-normal text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2 justify-end">
                          <button
                            onClick={() => openOfferModal(offer)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Edit Offer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOfferDelete(offer.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Delete Offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {landingOffers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-gray-500 text-xs">No scrolling offers found. Add one above!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Internship Registrations Management Tab */}
      {activeTab === "internships" && isAdmin && (
        <div className="space-y-6 lg:space-y-8 animate-fadeIn">
          {/* Header Action Strip */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition-colors">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Internship Registrations</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View and manage student registrations submitted via the Internship QR Code</p>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg">
              Total registrations: {internshipRegistrations.length}
            </div>
          </div>

          {/* Table List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-32">Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Full Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">College / Institution</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-24">Year</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Email Address</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-36">Phone Number</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 text-right w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {internshipRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-950 dark:text-white">
                        {reg.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {reg.collegeName}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {reg.yearOfStudy}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <a href={`mailto:${reg.email}`} className="hover:underline text-blue-600 dark:text-blue-400">
                          {reg.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <a href={`tel:${reg.phoneNumber}`} className="hover:underline">
                          {reg.phoneNumber}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleInternshipDelete(reg.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {internshipRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500 text-xs">No internship registrations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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

      {/* Link management Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsLinkModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              {linkForm.id ? "Edit Important Link" : "Add Important Link"}
            </h3>
            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}
            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IEEE project guidelines"
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  URL / Path
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /browse or https://google.com"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={mgmtLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer mt-2"
              >
                {mgmtLoading ? "Saving..." : "Save Link"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Announcement management Modal */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAnnModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              {annForm.id ? "Edit Announcement" : "Add Announcement"}
            </h3>
            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}
            <form onSubmit={handleAnnSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Month (3 Letters)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="e.g. JUL"
                    value={annForm.month}
                    onChange={(e) => setAnnForm({ ...annForm, month: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Day (Date Number)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="e.g. 15"
                    value={annForm.day}
                    onChange={(e) => setAnnForm({ ...annForm, day: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white text-center font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Announcement Title
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. PYTHON FULL-STACK WEB DEVELOPMENT BATCH STARTING"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Redirect Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /browse?tab=classes"
                  value={annForm.href}
                  onChange={(e) => setAnnForm({ ...annForm, href: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={mgmtLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer mt-2"
              >
                {mgmtLoading ? "Saving..." : "Save Announcement"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Offer management Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsOfferModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              {offerForm.id ? "Edit Scrolling Offer" : "Add Scrolling Offer"}
            </h3>
            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Offer / Announcement Text
                </label>
                <textarea
                  required
                  placeholder="e.g. 20% DISCOUNT ON ALL IEEE 2026 PROJECTS"
                  value={offerForm.text}
                  onChange={(e) => setOfferForm({ ...offerForm, text: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Target Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /courses or https://yourwebsite.com/offer"
                  value={offerForm.link}
                  onChange={(e) => setOfferForm({ ...offerForm, link: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={mgmtLoading}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer mt-2"
              >
                {mgmtLoading ? "Saving..." : "Save Offer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
