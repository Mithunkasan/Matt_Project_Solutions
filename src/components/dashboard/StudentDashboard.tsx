"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Calendar, Bell, FileDown, Clock, CreditCard, 
  BookOpen, TrendingUp, User, Paperclip, Mic, Square, CheckCircle2, 
  Lock, AlertCircle, FileText, Play
} from "lucide-react";
import { Project, ClassSchedule } from "@/types";

interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

interface ProjectWithFiles extends Project {
  files?: ProjectFile[];
}

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

interface ChatMessage {
  id: string;
  message: string;
  senderRole: string;
  studentEmail: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  createdAt: string;
}

interface StudentDashboardProps {
  session: {
    user: {
      name: string;
      email: string;
      role: string;
      id: string;
    };
  };
  projects: ProjectWithFiles[];
  courses: CourseItem[];
  meetings: MeetingItem[];
  notifications: NotificationItem[];
  onRefreshData: () => Promise<void>;
}

export function StudentDashboard({ 
  session, 
  projects, 
  courses, 
  meetings, 
  notifications: initialNotifications,
  onRefreshData
}: StudentDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"project" | "course">("project");
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  
  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatFile, setChatFile] = useState<File | null>(null);
  const [sendingChat, setSendingChat] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // Voice Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeProject = projects[0]; // Take the first project assigned
  const activeCourse = courses[0];   // Take the first course enrolled
  
  // Determine tabs
  const hasProject = projects.length > 0;
  const hasCourse = courses.length > 0;

  useEffect(() => {
    // Set active tab based on what's available
    if (hasProject) {
      setActiveSubTab("project");
    } else if (hasCourse) {
      setActiveSubTab("course");
    }
  }, [hasProject, hasCourse]);

  // Sync notifications
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?studentEmail=${encodeURIComponent(session.user.email)}`);
        if (res.ok) {
          setMessages(await res.json());
          scrollToBottom();
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll messages every 5 seconds
    return () => clearInterval(interval);
  }, [session.user.email]);

  // Chat Submission
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !chatFile && !sendingChat) return;

    setSendingChat(true);
    try {
      const formData = new FormData();
      formData.append("message", chatInput);
      formData.append("studentEmail", session.user.email);
      if (chatFile) {
        formData.append("file", chatFile);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setChatInput("");
        setChatFile(null);
        // Trigger manual refresh
        const messagesRes = await fetch(`/api/chat?studentEmail=${encodeURIComponent(session.user.email)}`);
        if (messagesRes.ok) {
          setMessages(await messagesRes.json());
          scrollToBottom();
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSendingChat(false);
    }
  };

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: "audio/webm" });
        
        // Upload audio file
        setSendingChat(true);
        try {
          const formData = new FormData();
          formData.append("message", "Sent a voice message");
          formData.append("studentEmail", session.user.email);
          formData.append("file", audioFile);

          const res = await fetch("/api/chat", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const messagesRes = await fetch(`/api/chat?studentEmail=${encodeURIComponent(session.user.email)}`);
            if (messagesRes.ok) {
              setMessages(await messagesRes.json());
              scrollToBottom();
            }
          }
        } catch (err) {
          console.error("Failed to upload voice message:", err);
        } finally {
          setSendingChat(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access denied or unavailable.");
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Notifications Functions
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Document checklist setup
  const docChecklist = [
    "Proposal", "Synopsis", "Source Code", "Project Report", 
    "PPT", "IEEE Paper", "Screenshots", "User Manual", "Invoice"
  ];

  // Helper to match files
  const getFileForDoc = (docName: string) => {
    if (!activeProject?.files) return null;
    return activeProject.files.find((f: ProjectFile) => f.name.toLowerCase() === docName.toLowerCase());
  };

  // Calculate project progress percentage based on status
  const getProjectProgressPercent = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return 100;
      case "testing": return 85;
      case "development": return 65;
      case "design": return 40;
      case "documentation": return 20;
      default: return 5;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-[#12498b] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Student Dashboard</span>
            <h1 className="text-3xl font-bold mt-2">Welcome Back, {session?.user?.name}!</h1>
            <p className="text-blue-100/80 mt-1.5 text-sm sm:text-base max-w-xl">
              Track your assigned projects or courses, download files, schedule meetings, and communicate directly with your mentor.
            </p>
          </div>
          
          {/* Notification Counter Trigger & Refresh Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onRefreshData();
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 px-4 rounded-full transition-all shadow-sm cursor-pointer shrink-0 border border-white/20"
            >
              Refresh Dashboard
            </button>
            <div 
              onClick={handleMarkAllAsRead}
              className="relative bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all cursor-pointer"
            >
              <Bell className="w-6 h-6 text-white" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b12222] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#12498b]">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course/Project Toggle Switch (only if both are assigned) */}
      {hasProject && hasCourse && (
        <div className="flex justify-center">
          <div className="bg-gray-200 dark:bg-gray-800 p-1.5 rounded-full flex space-x-1 shadow-inner max-w-md w-full">
            <button
              onClick={() => setActiveSubTab("project")}
              className={`flex-1 py-2 px-6 rounded-full text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeSubTab === "project" 
                  ? "bg-[#12498b] text-white shadow-md" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Project Tracker</span>
            </button>
            <button
              onClick={() => setActiveSubTab("course")}
              className={`flex-1 py-2 px-6 rounded-full text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeSubTab === "course" 
                  ? "bg-[#b12222] text-white shadow-md" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Course Portal</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Project or Course Main Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. PROJECT VIEW */}
          {activeSubTab === "project" && hasProject && (
            <div className="space-y-8">
              {/* Project Card Info */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{activeProject.department} Department</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeProject.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{activeProject.college}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeProject.status?.toLowerCase() === "completed" 
                      ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400" 
                      : "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
                  }`}>
                    {activeProject.status}
                  </span>
                </div>

                {/* Progress Tracking */}
                <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-850">
                  <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span>Project Milestone Progress</span>
                    <span>{getProjectProgressPercent(activeProject.status)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500" 
                      style={{ width: `${getProjectProgressPercent(activeProject.status)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-5 text-[10px] font-bold text-gray-400 mt-2 text-center">
                    <span>Idea</span>
                    <span>Doc</span>
                    <span>Code</span>
                    <span>Test</span>
                    <span>Ready</span>
                  </div>
                </div>

                {/* Mentor Info & Team Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-100 dark:border-gray-850">
                  <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl">
                    <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Assigned Mentor</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{activeProject.handler || "Admin Team"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl">
                    <CreditCard className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Team Members</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{activeProject.team || "Individual Project"}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Status Info (if applicable) */}
                {activeProject.finalAmount > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-850 space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-[#12498b]" />
                      <span>Payment Status & Installments</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-gray-400 font-bold uppercase text-[9px]">Total Value</p>
                        <p className="font-bold text-gray-900 dark:text-white mt-1">₹{activeProject.finalAmount}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-green-500 font-bold uppercase text-[9px]">Paid</p>
                        <p className="font-bold text-green-600 dark:text-green-400 mt-1">₹{activeProject.amountPaid}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-red-500 font-bold uppercase text-[9px]">Balance</p>
                        <p className="font-bold text-red-650 dark:text-red-400 mt-1">₹{activeProject.finalAmount - activeProject.amountPaid}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        <span>Payment Completed</span>
                        <span>{activeProject.paymentProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300" 
                          style={{ width: `${activeProject.paymentProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Center - Project Files */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span>Project File Download Center</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Download proposal, synopsis, source code, report, ppt, screenshots, user manuals, and invoices once uploaded by the administrator.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {docChecklist.map((docName) => {
                    const file = getFileForDoc(docName);
                    return (
                      <div 
                        key={docName}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          file 
                            ? "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/40 hover:shadow-md" 
                            : "bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {file ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-450 shrink-0" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{docName}</p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {file ? file.fileName : "Waiting for Admin upload"}
                            </p>
                          </div>
                        </div>

                        {file ? (
                          <a
                            href={file.fileUrl}
                            download
                            className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-full shadow transition-colors flex items-center justify-center cursor-pointer shrink-0"
                            title={`Download ${docName}`}
                          >
                            <FileDown className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0 bg-gray-200 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                            Locked
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. COURSE VIEW */}
          {activeSubTab === "course" && hasCourse && (
            <div className="space-y-8">
              {/* Course Card Info */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">{activeCourse.department} Division</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeCourse.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{activeCourse.description || "Course orientation and professional development."}</p>
                </div>

                {/* Course Progress */}
                <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-850">
                  <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span>Course Syllabus Completion</span>
                    <span>{activeCourse.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500" 
                      style={{ width: `${activeCourse.progress}%` }}
                    />
                  </div>
                </div>

                {/* Duration & Mentor Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-100 dark:border-gray-850">
                  <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl">
                    <User className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Course Trainer</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{activeCourse.faculty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl">
                    <Clock className="w-5 h-5 text-[#12498b]" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Duration</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{activeCourse.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class Schedules List */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-red-650" />
                    <span>My Class Schedule Agenda</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Calendar schedule of live online classes, labs, and interactive doubt-clearing sessions.</p>
                </div>

                {activeCourse.schedules && activeCourse.schedules.length > 0 ? (
                  <div className="space-y-4">
                    {activeCourse.schedules.map((schedule: ClassSchedule) => (
                      <div 
                        key={schedule.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-250 dark:border-gray-800/80 gap-4"
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/20 text-red-650 rounded-xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold uppercase">{schedule.day.slice(0, 3)}</span>
                            <span className="text-sm font-extrabold">{new Date(schedule.date).getDate()}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{schedule.project}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                              <span>Faculty: {schedule.faculty}</span>
                              <span>•</span>
                              <span>Time: {schedule.time}</span>
                              <span>•</span>
                              <span>Dept: {schedule.department}</span>
                            </div>
                          </div>
                        </div>

                        <span className="bg-red-50 dark:bg-red-950/30 text-red-750 dark:text-red-400 text-xs px-3.5 py-1.5 rounded-full font-bold border border-red-100 dark:border-red-900/20 self-start sm:self-center">
                          {schedule.location}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No classes scheduled for this course yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Assigned Products Message */}
          {!hasProject && !hasCourse && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Under Admin Review</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Hello! Your registration was successful. The administrator is currently assigning your project files or course syllabus details.
                Please check back shortly or email support.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Meetings, Notifications feed, Chat Pane */}
        <div className="space-y-8">
          
          {/* 1. MEETING SCHEDULER WIDGET */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-850 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-650 animate-bounce" />
              <span>Meeting Scheduler</span>
            </h3>
            
            {meetings.length > 0 ? (
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold bg-[#12498b] text-white px-2 py-0.5 rounded-full uppercase">
                        {meeting.type}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1.5">{meeting.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(meeting.date).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{meeting.time}</span>
                        </span>
                      </div>
                    </div>

                    <a 
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 bg-[#12498b] hover:bg-[#0f3d75] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Join Meeting</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs bg-gray-50 dark:bg-gray-950 rounded-2xl">
                No meetings scheduled at the moment.
              </div>
            )}
          </div>

          {/* 2. NOTIFICATIONS PANELS */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center space-x-2">
                <Bell className="w-5 h-5 text-indigo-500 animate-swing" />
                <span>Recent Updates</span>
              </h3>
              {notifications.some(n => !n.read) && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 font-semibold cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                    className={`p-3 rounded-xl border text-xs transition-all relative cursor-pointer ${
                      notif.read 
                        ? "bg-gray-50/50 dark:bg-gray-950/20 border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-400" 
                        : "bg-indigo-50/30 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/30 text-gray-955 dark:text-white font-medium"
                    }`}
                  >
                    {!notif.read && (
                      <span className="absolute top-3.5 right-3 w-2 h-2 bg-indigo-650 rounded-full animate-pulse" />
                    )}
                    <p className="font-bold pr-4">{notif.title}</p>
                    <p className="mt-1 text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">{notif.message}</p>
                    <span className="text-[9px] text-gray-400 mt-2 block">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs bg-gray-50 dark:bg-gray-950 rounded-2xl">
                No notification alerts.
              </div>
            )}
          </div>

          {/* 3. IN-APP CHAT WIDGET */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-[400px] overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-850 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#12498b] dark:text-blue-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Admin Support Chat</h4>
                  <p className="text-[9px] text-green-500 font-semibold">Online Helpdesk</p>
                </div>
              </div>
            </div>

            {/* Message Viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30 dark:bg-gray-950/10">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isAdminMsg = msg.senderRole === "ADMIN";
                  return (
                    <div 
                      key={msg.id}
                      className={`flex ${isAdminMsg ? "justify-start" : "justify-end"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                          isAdminMsg 
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700" 
                            : "bg-[#12498b] text-white"
                        }`}
                      >
                        {/* Message Text */}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                        {/* File Attachments */}
                        {msg.fileUrl && (
                          <div className="mt-2 pt-2 border-t border-white/10 dark:border-gray-700/50">
                            {msg.fileType === "image" ? (
                              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block max-w-xs overflow-hidden rounded">
                                <img src={msg.fileUrl} alt="attachment" className="max-h-32 object-cover rounded hover:scale-105 transition-transform" />
                              </a>
                            ) : msg.fileType === "audio" ? (
                              <audio controls className="w-48 h-8 rounded bg-gray-100 dark:bg-gray-950 p-1">
                                <source src={msg.fileUrl} type="audio/webm" />
                              </audio>
                            ) : (
                              <a 
                                href={msg.fileUrl} 
                                download 
                                className="flex items-center space-x-1.5 font-bold hover:underline"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[150px]">{msg.fileName}</span>
                              </a>
                            )}
                          </div>
                        )}
                        <span className="text-[8px] opacity-60 mt-1 block text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Say Hello to Admin support! Start typing below...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Attachment preview */}
            {chatFile && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 shrink-0">
                <span className="truncate max-w-[200px] font-medium">Attachment: {chatFile.name}</span>
                <button onClick={() => setChatFile(null)} className="text-red-500 hover:text-red-750">Cancel</button>
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-3 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-855 flex items-center space-x-2 shrink-0">
              {/* Attachment Button */}
              <label className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer shrink-0">
                <Paperclip className="w-4 h-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => e.target.files && setChatFile(e.target.files[0])}
                />
              </label>

              {/* Text Input */}
              <input
                type="text"
                placeholder={recording ? "Recording audio note..." : "Type your message..."}
                disabled={recording}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#12498b] text-gray-900 dark:text-white"
              />

              {/* Voice Note Button */}
              {recording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-1 animate-pulse shrink-0 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[10px] font-bold">{recordingDuration}s</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 shrink-0 cursor-pointer"
                  title="Record voice note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {/* Send Button */}
              <button
                type="submit"
                disabled={sendingChat || (!chatInput.trim() && !chatFile)}
                className="py-2 px-3.5 bg-[#12498b] hover:bg-[#0f3d75] text-white text-xs font-bold rounded-xl shadow transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
