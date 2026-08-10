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

interface SharedFileItem {
  id: string;
  projectId: string;
  studentEmail: string;
  handlerEmail: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  message: string | null;
  createdAt: string;
  project?: {
    name: string;
    student: string;
    handler: string;
  };
}

interface ProgressUpdateItem {
  id: string;
  projectId: string;
  studentEmail: string;
  handlerEmail: string;
  status: string;
  progress: number;
  title: string;
  details: string;
  createdAt: string;
  project?: {
    name: string;
    student: string;
    handler: string;
  };
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

interface MainGridSlideItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  badge: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface InternshipRegistrationItem {
  id: string;
  fullName: string;
  collegeName: string;
  department?: string | null;
  yearOfStudy: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

interface ProjectHandlerOption {
  name: string;
  email: string;
  mobileNumber?: string | null;
}

interface WorkshopItem {
  id: string;
  date: string;
  time: string;
  handlerEmail: string;
  handlerName: string;
  participantNames: string;
  college: string;
  department: string;
  topic: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
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
  const isProjectHandler = session?.user?.role === 'PROJECT_HANDLER';
  const canManageSchedules = isProjectHandler;

  const [selectedTeam, setSelectedTeam] = useState("All MATT Teams");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "classes" | "courses" | "meetings" | "chat" | "links" | "announcements" | "offers" | "mainGrid" | "internships" | "activity" | "workshops">("projects");

  // Custom States for Courses, Meetings, Notifications
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFileItem[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdateItem[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [projectHandlers, setProjectHandlers] = useState<ProjectHandlerOption[]>([]);

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
  const [mainGridSlides, setMainGridSlides] = useState<MainGridSlideItem[]>([]);
  const [internshipRegistrations, setInternshipRegistrations] = useState<InternshipRegistrationItem[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isMainGridModalOpen, setIsMainGridModalOpen] = useState(false);
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
  const [mainGridForm, setMainGridForm] = useState<{ id?: string; title: string; imageUrl: string; description: string; badge: string; sortOrder: number }>({
    title: "",
    imageUrl: "",
    description: "",
    badge: "Student Spotlight",
    sortOrder: 0,
  });
  const [mgmtError, setMgmtError] = useState("");
  const [mgmtLoading, setMgmtLoading] = useState(false);
  const [selectedSlideFile, setSelectedSlideFile] = useState<File | null>(null);
  const [internshipSearchQuery, setInternshipSearchQuery] = useState("");
  const [selectedInternshipDept, setSelectedInternshipDept] = useState("All Departments");
  const [selectedInternshipYear, setSelectedInternshipYear] = useState("All Years");
  const [workshopForm, setWorkshopForm] = useState({
    id: "",
    date: "",
    time: "",
    handlerEmail: "",
    handlerName: "",
    participantNames: "",
    college: "",
    department: "",
    topic: "",
    duration: "",
  });
  const [showHandlerDropdown, setShowHandlerDropdown] = useState(false);
  const [handlerSearchQuery, setHandlerSearchQuery] = useState("");
  const [pendingWhatsAppLinks, setPendingWhatsAppLinks] = useState<{ name: string; url: string }[]>([]);

  // Mobile number update states for project handler login prompt
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [savingMobile, setSavingMobile] = useState(false);
  const [mobileError, setMobileError] = useState("");

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

  const fetchMainGridSlides = async () => {
    try {
      const res = await fetch("/api/landing/main-grid-slides");
      if (res.ok) setMainGridSlides(await res.json());
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

  const fetchSharedFiles = async () => {
    try {
      const res = await fetch("/api/shared-files");
      if (res.ok) setSharedFiles(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProgressUpdates = async () => {
    try {
      const res = await fetch("/api/progress-updates");
      if (res.ok) setProgressUpdates(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const res = await fetch("/api/workshops");
      if (res.ok) setWorkshops(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProjectHandlers = async () => {
    try {
      const res = await fetch("/api/project-handlers");
      if (res.ok) setProjectHandlers(await res.json());
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
            fetchMeetings(),
            fetchNotifications(),
            fetchSharedFiles(),
            fetchProgressUpdates(),
            fetchWorkshops()
          ];
          if (isAdmin) {
            promises.push(fetchCourses());
            promises.push(fetchLinks());
            promises.push(fetchAnnouncements());
            promises.push(fetchOffers());
            promises.push(fetchMainGridSlides());
            promises.push(fetchInternshipRegistrations());
            promises.push(fetchProjectHandlers());
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

  useEffect(() => {
    if (session?.user?.role === "PROJECT_HANDLER") {
      const checkMobileNumber = async () => {
        try {
          const res = await fetch("/api/project-handler/profile");
          if (res.ok) {
            const data = await res.json();
            if (data && !data.mobileNumber) {
              setShowMobileModal(true);
            }
          }
        } catch (err) {
          console.error("Failed to check handler mobile number:", err);
        }
      };
      checkMobileNumber();
    }
  }, [session]);

  const handleSaveMobile = async () => {
    if (!mobileNumber.trim()) {
      setMobileError("Mobile number is required");
      return;
    }
    const digitsOnly = mobileNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setMobileError("Please enter a valid mobile number (at least 10 digits)");
      return;
    }

    setSavingMobile(true);
    setMobileError("");
    try {
      const res = await fetch("/api/project-handler/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: digitsOnly })
      });
      if (res.ok) {
        setShowMobileModal(false);
        if (isAdmin) {
          fetchProjectHandlers();
        }
      } else {
        const data = await res.json();
        setMobileError(data.error || "Failed to save mobile number");
      }
    } catch (err) {
      console.error(err);
      setMobileError("An error occurred while saving mobile number");
    } finally {
      setSavingMobile(false);
    }
  };

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

  // MainGrid Slide Actions
  const openMainGridModal = (item?: MainGridSlideItem) => {
    if (item) {
      setMainGridForm({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.description,
        badge: item.badge || "Student Spotlight",
        sortOrder: item.sortOrder || 0,
      });
    } else {
      setMainGridForm({
        title: "",
        imageUrl: "",
        description: "",
        badge: "Student Spotlight",
        sortOrder: mainGridSlides.length,
      });
    }
    setSelectedSlideFile(null);
    setMgmtError("");
    setIsMainGridModalOpen(true);
  };

  const handleMainGridSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMgmtLoading(true);
    setMgmtError("");

    const isEdit = !!mainGridForm.id;
    const method = isEdit ? "PUT" : "POST";

    let currentImageUrl = mainGridForm.imageUrl;

    try {
      if (selectedSlideFile) {
        const formData = new FormData();
        formData.append("file", selectedSlideFile);

        const uploadRes = await fetch("/api/landing/main-grid-slides/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json();
          throw new Error(uploadData.error || "Failed to upload image file");
        }

        const { fileUrl } = await uploadRes.json();
        currentImageUrl = fileUrl;
      } else if (!currentImageUrl) {
        throw new Error("An image file is required.");
      }

      const res = await fetch("/api/landing/main-grid-slides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mainGridForm,
          imageUrl: currentImageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchMainGridSlides();
        setIsMainGridModalOpen(false);
        setSelectedSlideFile(null);
      } else {
        setMgmtError(data.error || "Failed to save MainGrid slide");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error. Please try again.";
      setMgmtError(errorMessage);
    } finally {
      setMgmtLoading(false);
    }
  };

  const handleMainGridDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this MainGrid slide?")) return;
    try {
      const res = await fetch(`/api/landing/main-grid-slides?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchMainGridSlides();
      } else {
        alert("Failed to delete MainGrid slide");
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

  const resetWorkshopForm = () => {
    setWorkshopForm({
      id: "",
      date: "",
      time: "",
      handlerEmail: "",
      handlerName: "",
      participantNames: "",
      college: "",
      department: "",
      topic: "",
      duration: "",
    });
    setMgmtError("");
    setShowHandlerDropdown(false);
    setHandlerSearchQuery("");
  };

  const handleWorkshopHandlerChange = (email: string) => {
    const handler = projectHandlers.find(item => item.email === email);
    setWorkshopForm(prev => ({
      ...prev,
      handlerEmail: email,
      handlerName: handler?.name || ""
    }));
  };

  const handleWorkshopEdit = (workshop: WorkshopItem) => {
    setWorkshopForm({
      id: workshop.id,
      date: workshop.date ? new Date(workshop.date).toISOString().slice(0, 10) : "",
      time: workshop.time,
      handlerEmail: workshop.handlerEmail,
      handlerName: workshop.handlerName,
      participantNames: workshop.participantNames,
      college: workshop.college,
      department: workshop.department,
      topic: workshop.topic,
      duration: workshop.duration,
    });
    setMgmtError("");
  };

  const handleWorkshopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMgmtLoading(true);
    setMgmtError("");
    setPendingWhatsAppLinks([]);

    if (!workshopForm.handlerEmail) {
      setMgmtError("Please select at least one Project Handler.");
      setMgmtLoading(false);
      return;
    }

    try {
      const isNew = !workshopForm.id;
      const res = await fetch("/api/workshops", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workshopForm),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchWorkshops();

        // Trigger WhatsApp notifications only on creation
        if (isNew) {
          const emails = workshopForm.handlerEmail.split(',').map(e => e.trim().toLowerCase());
          const names = workshopForm.handlerName.split(',').map(n => n.trim());
          
          const links: { name: string; url: string }[] = [];
          emails.forEach((email, index) => {
            const handler = projectHandlers.find(h => h.email.toLowerCase() === email);
            const name = names[index] || handler?.name || "Project Handler";
            const mobile = handler?.mobileNumber;
            if (mobile) {
              let cleaned = mobile.replace(/\D/g, "");
              if (cleaned.length === 10) {
                cleaned = "91" + cleaned;
              }
              const msg = `Hello ${name},\n\nYou have been assigned to conduct the following workshop:\n\nTopic: ${workshopForm.topic}\nDate: ${workshopForm.date}\nTime: ${workshopForm.time}\nCollege: ${workshopForm.college}\nDepartment: ${workshopForm.department}\nDuration: ${workshopForm.duration}\n\nRegards,\nAdmin`;
              
              const waUrl = `https://api.whatsapp.com/send?phone=${cleaned}&text=${encodeURIComponent(msg)}`;
              links.push({ name, url: waUrl });
              window.open(waUrl, "_blank");
            }
          });
          
          if (links.length > 0) {
            setPendingWhatsAppLinks(links);
          }
        }

        resetWorkshopForm();
      } else {
        setMgmtError(data.error || "Failed to save workshop");
      }
    } catch {
      setMgmtError("Network error. Please try again.");
    } finally {
      setMgmtLoading(false);
    }
  };

  const handleWorkshopDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workshop?")) return;

    try {
      const res = await fetch(`/api/workshops?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchWorkshops();
        if (workshopForm.id === id) resetWorkshopForm();
      } else {
        alert("Failed to delete workshop");
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

  const distinctInternshipDepts = Array.from(
    new Set(
      internshipRegistrations
        .map((reg) => reg.department)
        .filter((dept): dept is string => typeof dept === "string" && dept.trim() !== "")
    )
  ).sort();

  const distinctInternshipYears = Array.from(
    new Set(
      internshipRegistrations
        .map((reg) => reg.yearOfStudy)
        .filter((year): year is string => typeof year === "string" && year.trim() !== "")
    )
  ).sort();

  const filteredInternships = internshipRegistrations.filter((reg) => {
    const matchesSearch =
      !internshipSearchQuery ||
      reg.fullName.toLowerCase().includes(internshipSearchQuery.toLowerCase()) ||
      reg.collegeName.toLowerCase().includes(internshipSearchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(internshipSearchQuery.toLowerCase()) ||
      reg.phoneNumber.includes(internshipSearchQuery) ||
      (reg.department && reg.department.toLowerCase().includes(internshipSearchQuery.toLowerCase()));

    const matchesDept =
      selectedInternshipDept === "All Departments" ||
      reg.department === selectedInternshipDept;

    const matchesYear =
      selectedInternshipYear === "All Years" ||
      reg.yearOfStudy === selectedInternshipYear;

    return matchesSearch && matchesDept && matchesYear;
  });

  const showStatsCards = isAdmin && activeTab === "projects";

  if (!isAdmin && !isProjectHandler) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 lg:p-8 transition-colors">
        <Header />
        <main className="max-w-7xl mx-auto py-8">
          <StudentDashboard
            session={session}
            projects={projects}
            courses={courses}
            classSchedules={classSchedules}
            meetings={meetings}
            notifications={notifications}
            sharedFiles={sharedFiles}
            progressUpdates={progressUpdates}
            onRefreshData={async () => {
              await Promise.all([fetchProjects(), fetchClassSchedules(), fetchCourses(), fetchMeetings(), fetchNotifications(), fetchSharedFiles(), fetchProgressUpdates()]);
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
          {isProjectHandler && (
            <>
              <button
                onClick={() => setActiveTab("classes")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "classes"
                  ? "bg-[#b12222] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Schedules
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
                onClick={() => setActiveTab("workshops")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "workshops"
                  ? "bg-cyan-700 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Workshops
              </button>
            </>
          )}
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
                onClick={() => setActiveTab("activity")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "activity"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Handler Activity
              </button>
              <button
                onClick={() => setActiveTab("workshops")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "workshops"
                  ? "bg-cyan-700 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                Workshop
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
                onClick={() => setActiveTab("mainGrid")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 shrink-0 ${activeTab === "mainGrid"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                MainGrid
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
          {isAdmin && activeTab === "projects" && (
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
          {isAdmin && activeTab === "projects" && (
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

      {activeTab === "activity" && isAdmin && (
        <div className="space-y-6 lg:space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project Handler Activity</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor handler-created schedules, shared files, and project progress updates.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Schedules</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[420px] overflow-y-auto">
                {classSchedules.map((item) => (
                  <div key={item.id} className="p-4 text-xs space-y-1">
                    <p className="font-bold text-gray-900 dark:text-white">{item.project}</p>
                    <p className="text-gray-500 dark:text-gray-400">{item.studentEmail || "No student email"}</p>
                    <p className="text-gray-600 dark:text-gray-300">{new Date(item.date).toLocaleDateString()} at {item.time}</p>
                    <p className="text-gray-500 dark:text-gray-400">{item.location}</p>
                  </div>
                ))}
                {classSchedules.length === 0 && (
                  <p className="p-4 text-xs text-gray-500">No schedules found.</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Shared Files</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[420px] overflow-y-auto">
                {sharedFiles.map((file) => (
                  <div key={file.id} className="p-4 text-xs space-y-1">
                    <p className="font-bold text-gray-900 dark:text-white">{file.fileName}</p>
                    <p className="text-gray-500 dark:text-gray-400">{file.project?.name || "Project"} - {file.studentEmail}</p>
                    <p className="text-gray-500 dark:text-gray-400">Handler: {file.handlerEmail}</p>
                    {file.message && <p className="text-gray-600 dark:text-gray-300">{file.message}</p>}
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      View file
                    </a>
                  </div>
                ))}
                {sharedFiles.length === 0 && (
                  <p className="p-4 text-xs text-gray-500">No shared files found.</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Progress Updates</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[420px] overflow-y-auto">
                {progressUpdates.map((update) => (
                  <div key={update.id} className="p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-gray-900 dark:text-white">{update.title}</p>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold">
                        {update.progress}%
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{update.project?.name || "Project"} - {update.studentEmail}</p>
                    <p className="text-gray-500 dark:text-gray-400">Status: {update.status}</p>
                    <p className="text-gray-600 dark:text-gray-300">{update.details}</p>
                  </div>
                ))}
                {progressUpdates.length === 0 && (
                  <p className="p-4 text-xs text-gray-500">No progress updates found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "meetings" && isProjectHandler && (
        <MeetingManager />
      )}

      {activeTab === "chat" && isProjectHandler && (
        <AdminChatHub />
      )}

      {activeTab === "workshops" && (
        <div className="space-y-6 lg:space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workshop</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isAdmin ? "Create and manage workshop records assigned to Project Handlers." : "View workshops assigned to you by the admin."}
            </p>
          </div>

          {isAdmin && (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              {mgmtError && (
                <div className="mb-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 rounded text-sm">
                  {mgmtError}
                </div>
              )}
              {pendingWhatsAppLinks.length > 0 && (
                <div className="mb-4 bg-teal-50 dark:bg-teal-950/20 border-l-4 border-teal-500 text-teal-800 dark:text-teal-400 p-4 rounded-lg text-sm">
                  <div className="font-bold mb-1 text-teal-950 dark:text-teal-200">WhatsApp Notifications Ready:</div>
                  <p className="text-xs mb-3 text-teal-700/80 dark:text-teal-300/80">
                    If browser popup blocker blocked the WhatsApp redirect, click the button(s) below to open WhatsApp for each handler manually:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pendingWhatsAppLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
                      >
                        Send to {link.name}
                      </a>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPendingWhatsAppLinks([])}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-xs font-semibold transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              <form onSubmit={handleWorkshopSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={workshopForm.date}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={workshopForm.time}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Project Handler(s) <span className="text-red-500">*</span></label>
                  <div
                    onClick={() => setShowHandlerDropdown(!showHandlerDropdown)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white cursor-pointer flex justify-between items-center min-h-[38px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    <span className="truncate">
                      {workshopForm.handlerEmail
                        ? workshopForm.handlerName.split(',').length === 1
                          ? (() => {
                              const matched = projectHandlers.find(h => h.email.toLowerCase() === workshopForm.handlerEmail.toLowerCase());
                              const mobile = matched?.mobileNumber ? ` - Mobile: ${matched.mobileNumber}` : "";
                              return `${workshopForm.handlerName} (${workshopForm.handlerEmail})${mobile}`;
                            })()
                          : `${workshopForm.handlerName.split(',').length} Handlers Selected`
                        : "Select Project Handler(s)"}
                    </span>
                    <span className="text-xs text-gray-500">▼</span>
                  </div>

                  {showHandlerDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowHandlerDropdown(false)}
                      />
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-3 max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search handlers..."
                          value={handlerSearchQuery}
                          onChange={(e) => setHandlerSearchQuery(e.target.value)}
                          className="w-full px-3 py-1.5 mb-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs outline-none text-gray-900 dark:text-white"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="space-y-2">
                          {projectHandlers
                            .filter(h => 
                              h.name.toLowerCase().includes(handlerSearchQuery.toLowerCase()) || 
                              h.email.toLowerCase().includes(handlerSearchQuery.toLowerCase())
                            )
                            .map((handler) => {
                              const selectedEmails = workshopForm.handlerEmail
                                ? workshopForm.handlerEmail.split(",").map(e => e.trim().toLowerCase())
                                : [];
                              const isSelected = selectedEmails.includes(handler.email.toLowerCase());

                              return (
                                <label
                                  key={handler.email}
                                  className="flex items-start gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md cursor-pointer text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      let newEmails = [...selectedEmails];
                                      if (isSelected) {
                                        newEmails = newEmails.filter(e => e !== handler.email.toLowerCase());
                                      } else {
                                        newEmails.push(handler.email.toLowerCase());
                                      }
                                      
                                      // Match back to correct case from projectHandlers
                                      const finalEmails = newEmails.map(email => {
                                        const matched = projectHandlers.find(h => h.email.toLowerCase() === email);
                                        return matched ? matched.email : email;
                                      });
                                      const finalNames = finalEmails.map(email => {
                                        const matched = projectHandlers.find(h => h.email === email);
                                        return matched ? matched.name : email.split('@')[0];
                                      });

                                      setWorkshopForm(prev => ({
                                        ...prev,
                                        handlerEmail: finalEmails.join(","),
                                        handlerName: finalNames.join(",")
                                      }));
                                    }}
                                    className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                                  />
                                  <div className="flex-1 text-left">
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                      {handler.name}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                      {handler.email}
                                    </div>
                                    <div className="text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                                      Mobile: {handler.mobileNumber || "Not Available"}
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          {projectHandlers.length === 0 && (
                            <div className="text-gray-500 text-center py-2 text-xs">No handlers available</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={workshopForm.duration}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, duration: e.target.value })}
                    placeholder="e.g. 2 hours"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">College</label>
                  <input
                    type="text"
                    required
                    value={workshopForm.college}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, college: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={workshopForm.department}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Participants&apos; Names</label>
                  <textarea
                    required
                    rows={3}
                    value={workshopForm.participantNames}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, participantNames: e.target.value })}
                    placeholder="Enter participant names"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={workshopForm.topic}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, topic: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end pt-2">
                  {workshopForm.id && (
                    <button
                      type="button"
                      onClick={resetWorkshopForm}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={mgmtLoading}
                    className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm font-bold disabled:opacity-50"
                  >
                    {mgmtLoading ? "Saving..." : workshopForm.id ? "Update Workshop" : "Create Workshop"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Date / Time</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Handler</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Participants</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-700 dark:text-gray-300">College / Department</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Topic</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Duration</th>
                    {isAdmin && <th className="px-6 py-4 text-xs font-bold uppercase text-gray-700 dark:text-gray-300 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {workshops.map((workshop) => (
                    <tr key={workshop.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="font-semibold">{new Date(workshop.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{workshop.time}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="font-semibold text-gray-900 dark:text-white">{workshop.handlerName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{workshop.handlerEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs whitespace-pre-wrap">{workshop.participantNames}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <div>{workshop.college}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{workshop.department}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{workshop.topic}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{workshop.duration}</td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleWorkshopEdit(workshop)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                              title="Edit Workshop"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleWorkshopDelete(workshop.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                              title="Delete Workshop"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {workshops.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-sm text-gray-500">
                        No workshop records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
                      {isAdmin && <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Amount</th>}
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
                        {isAdmin && (
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                            ₹{project.finalAmount?.toLocaleString()}
                          </td>
                        )}
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
          {canManageSchedules && (
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
                <div className="flex gap-3 items-center">
                  <AddClassDialog onClassAdded={handleClassAdded} projects={projects} />
                </div>
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
                      {canManageSchedules && <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">Actions</th>}
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
                        {canManageSchedules && (
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

      {/* MainGrid Slides Management Tab */}
      {activeTab === "mainGrid" && isAdmin && (
        <div className="space-y-6 lg:space-y-8 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition-colors">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">MainGrid Slides</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage the image, badge, title, and description shown over the MainGrid slider images</p>
            </div>
            <button
              onClick={() => openMainGridModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Slide
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-28">Preview</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Content</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Image Path</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-24 text-center">Order</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {mainGridSlides.map((slide) => (
                    <tr key={slide.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-20 h-14 object-cover rounded-md border border-gray-200 dark:border-gray-700 bg-slate-100"
                        />
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white block">{slide.title}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mt-1">{slide.badge}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{slide.description}</span>
                        {slide.id.startsWith("default-slide-") && (
                          <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 font-mono">{slide.imageUrl}</td>
                      <td className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300">{slide.sortOrder}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2 justify-end">
                          <button
                            onClick={() => openMainGridModal(slide)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Edit Slide"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMainGridDelete(slide.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Delete Slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {mainGridSlides.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500 text-xs">No MainGrid slides found. Add one above!</td>
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
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Internship Registrations</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View and manage student registrations submitted via the Internship QR Code</p>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg">
              Showing {filteredInternships.length} of {internshipRegistrations.length} registrations
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, college, email, phone..."
                value={internshipSearchQuery}
                onChange={(e) => setInternshipSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-black dark:text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="relative min-w-[160px]">
              <select
                className="w-full h-10 pl-3 pr-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-black dark:text-white outline-none cursor-pointer appearance-none transition-all focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-600 font-medium"
                value={selectedInternshipDept}
                onChange={(e) => setSelectedInternshipDept(e.target.value)}
              >
                <option value="All Departments">All Departments</option>
                {distinctInternshipDepts.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Year Filter */}
            <div className="relative min-w-[160px]">
              <select
                className="w-full h-10 pl-3 pr-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-black dark:text-white outline-none cursor-pointer appearance-none transition-all focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-600 font-medium"
                value={selectedInternshipYear}
                onChange={(e) => setSelectedInternshipYear(e.target.value)}
              >
                <option value="All Years">All Years</option>
                {distinctInternshipYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Department</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-24">Year</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Email Address</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-36">Phone Number</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 text-right w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredInternships.map((reg) => (
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
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {reg.department || <span className="text-gray-400 italic">—</span>}
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
                  {filteredInternships.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-500 text-xs">
                        {internshipRegistrations.length === 0
                          ? "No internship registrations found."
                          : "No internship registrations match the selected filters."}
                      </td>
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

      {/* MainGrid slide management Modal */}
      {isMainGridModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsMainGridModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              {mainGridForm.id ? "Edit MainGrid Slide" : "Add MainGrid Slide"}
            </h3>
            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}
            <form onSubmit={handleMainGridSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Upload Slide Image {!mainGridForm.id && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!mainGridForm.id}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedSlideFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 dark:file:bg-sky-950/30 dark:file:text-sky-400 dark:hover:file:bg-sky-900/30 cursor-pointer"
                />
              </div>

              {(selectedSlideFile || mainGridForm.imageUrl) && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Image Preview
                  </label>
                  <div className="relative aspect-[16/9.8] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedSlideFile ? URL.createObjectURL(selectedSlideFile) : mainGridForm.imageUrl}
                      alt="Slide Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Spotlight"
                  value={mainGridForm.badge}
                  onChange={(e) => setMainGridForm({ ...mainGridForm, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project Guidance & Expert Counselling"
                  value={mainGridForm.title}
                  onChange={(e) => setMainGridForm({ ...mainGridForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Short text displayed over the image"
                  value={mainGridForm.description}
                  onChange={(e) => setMainGridForm({ ...mainGridForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={mainGridForm.sortOrder}
                  onChange={(e) => setMainGridForm({ ...mainGridForm, sortOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={mgmtLoading}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer mt-2"
              >
                {mgmtLoading ? "Saving..." : "Save Slide"}
              </button>
            </form>
          </div>
        </div>
      )}
      {showMobileModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all scale-100">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Update Your Mobile Number</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please provide your mobile number so we can contact you regarding workshop schedules and project updates.
              </p>
            </div>

            {mobileError && (
              <div className="mb-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 rounded-lg text-xs font-semibold">
                {mobileError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#12498b] text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveMobile}
                disabled={savingMobile}
                className="w-full h-11 bg-[#12498b] hover:bg-[#1858a3] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {savingMobile ? "Saving..." : "Save Mobile Number"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
