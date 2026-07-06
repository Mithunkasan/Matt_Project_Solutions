"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Plus, Trash2, Edit2, UserPlus, UserMinus, 
  TrendingUp, X, Clock, GraduationCap 
} from "lucide-react";

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
  enrollments: CourseEnrollment[];
}

export function CourseManager() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mgmtError, setMgmtError] = useState("");
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Forms
  const [courseForm, setCourseForm] = useState({
    id: "",
    name: "",
    description: "",
    department: "",
    duration: "",
    faculty: ""
  });

  const [enrollForm, setEnrollForm] = useState({
    studentEmail: "",
    studentName: ""
  });

  const [progressForm, setProgressForm] = useState({
    studentEmail: "",
    studentName: "",
    progress: 0,
    status: "Active"
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        setCourses(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMgmtError("");
    const isEdit = !!courseForm.id;
    const url = isEdit ? `/api/courses/${courseForm.id}` : "/api/courses";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update-course" : undefined,
          ...courseForm
        })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setCourseForm({ id: "", name: "", description: "", department: "", duration: "", faculty: "" });
        await fetchCourses();
        if (isEdit && selectedCourse) {
          const updatedCourses = await fetch("/api/courses").then(r => r.json());
          const updated = updatedCourses.find((c: CourseItem) => c.id === selectedCourse.id);
          setSelectedCourse(updated);
        }
      } else {
        const data = await res.json();
        setMgmtError(data.error || "Failed to save course");
      }
    } catch {
      setMgmtError("Network request failed");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course and all its student enrollments?")) return;

    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedCourse?.id === id) {
          setSelectedCourse(null);
        }
        await fetchCourses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setMgmtError("");

    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enroll",
          ...enrollForm
        })
      });

      if (res.ok) {
        setIsEnrollModalOpen(false);
        setEnrollForm({ studentEmail: "", studentName: "" });
        // Refresh details
        const updatedCourses = await fetch("/api/courses").then(r => r.json());
        setCourses(updatedCourses);
        const updated = updatedCourses.find((c: CourseItem) => c.id === selectedCourse.id);
        setSelectedCourse(updated);
      } else {
        const data = await res.json();
        setMgmtError(data.error || "Failed to enroll student");
      }
    } catch {
      setMgmtError("Failed to enroll student");
    }
  };

  const handleUnenroll = async (studentEmail: string) => {
    if (!selectedCourse) return;
    if (!confirm(`Are you sure you want to unenroll student: ${studentEmail}?`)) return;

    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unenroll",
          studentEmail
        })
      });

      if (res.ok) {
        // Refresh details
        const updatedCourses = await fetch("/api/courses").then(r => r.json());
        setCourses(updatedCourses);
        const updated = updatedCourses.find((c: CourseItem) => c.id === selectedCourse.id);
        setSelectedCourse(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setMgmtError("");

    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-progress",
          ...progressForm
        })
      });

      if (res.ok) {
        setIsProgressModalOpen(false);
        // Refresh details
        const updatedCourses = await fetch("/api/courses").then(r => r.json());
        setCourses(updatedCourses);
        const updated = updatedCourses.find((c: CourseItem) => c.id === selectedCourse.id);
        setSelectedCourse(updated);
      } else {
        const data = await res.json();
        setMgmtError(data.error || "Failed to update progress");
      }
    } catch {
      setMgmtError("Failed to update progress");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Course Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            <span>Course Management</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">Create courses, assign/enroll student emails, and track their academic completion progress.</p>
        </div>
        <button
          onClick={() => {
            setCourseForm({ id: "", name: "", description: "", department: "", duration: "", faculty: "" });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#b12222] hover:bg-[#c1353d] text-white rounded-lg font-semibold text-sm shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Courses list */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white dark:bg-gray-900 border rounded-xl">
              {"No courses defined. Click \"Add Course\" above."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedCourse?.id === course.id 
                      ? "bg-red-50/30 dark:bg-red-950/10 border-red-500 shadow-md" 
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold text-red-650 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded uppercase">
                        {course.department}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCourseForm({
                              id: course.id,
                              name: course.name,
                              description: course.description || "",
                              department: course.department,
                              duration: course.duration,
                              faculty: course.faculty
                            });
                            setIsAddModalOpen(true);
                          }}
                          className="p-1 text-gray-405 hover:text-blue-500 rounded"
                          title="Edit Course Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCourse(course.id);
                          }}
                          className="p-1 text-gray-405 hover:text-red-500 rounded"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 dark:text-white mt-3 text-base break-words">{course.name}</h4>
                    {course.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      {course.enrollments?.length || 0} Students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Selected Course Enrollments */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          {selectedCourse ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{selectedCourse.name}</h4>
                  <button
                    onClick={() => {
                      setEnrollForm({ studentEmail: "", studentName: "" });
                      setIsEnrollModalOpen(true);
                    }}
                    className="p-1.5 bg-red-100 dark:bg-red-950/20 text-red-650 hover:bg-red-200 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Enroll</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Instructor: {selectedCourse.faculty} • {selectedCourse.duration}</p>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Enrolled Students</h5>
                
                {selectedCourse.enrollments && selectedCourse.enrollments.length > 0 ? (
                  <div className="space-y-3 divide-y divide-gray-100 dark:divide-gray-850">
                    {selectedCourse.enrollments.map((enr: CourseEnrollment) => (
                      <div key={enr.id} className="pt-3 first:pt-0 flex flex-col space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{enr.studentName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{enr.studentEmail}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setProgressForm({
                                  studentEmail: enr.studentEmail,
                                  studentName: enr.studentName,
                                  progress: enr.progress,
                                  status: enr.status
                                });
                                setIsProgressModalOpen(true);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500 cursor-pointer"
                              title="Update Progress"
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUnenroll(enr.studentEmail)}
                              className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                              title="Unenroll"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-650 transition-all duration-300"
                              style={{ width: `${enr.progress}%` }}
                            />
                          </div>
                          <span className="font-bold text-gray-700 dark:text-gray-300">{enr.progress}%</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            enr.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {enr.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400">
                    {"No students enrolled in this course yet. Click \"Enroll\" to assign."}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center justify-center space-y-2">
              <GraduationCap className="w-12 h-12 text-gray-300" />
              <p>Select a course from the list to manage student enrollments and progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* 1. Add/Edit Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              {courseForm.id ? "Edit Course Details" : "Create New Course"}
            </h3>

            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Course Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Web Development (MERN)"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Master React, Node, Express, MongoDB and build live projects."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE or ECE"
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Months or 6 Weeks"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Assigned Trainer / Faculty</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Mithun K"
                  value={courseForm.faculty}
                  onChange={(e) => setCourseForm({ ...courseForm, faculty: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#b12222] hover:bg-[#c1353d] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors cursor-pointer"
              >
                {courseForm.id ? "Save Changes" : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Enroll Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Enroll Student in Course
            </h3>

            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Student Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@gmail.com"
                  value={enrollForm.studentEmail}
                  onChange={(e) => setEnrollForm({ ...enrollForm, studentEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={enrollForm.studentName}
                  onChange={(e) => setEnrollForm({ ...enrollForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-750 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Enroll & Authorize Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Update Progress Modal */}
      {isProgressModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsProgressModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Update Student Progress
            </h3>

            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}

            <form onSubmit={handleProgressSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
                <input
                  type="text"
                  disabled
                  value={progressForm.studentName}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Completion Progress (%)</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={progressForm.progress}
                  onChange={(e) => setProgressForm({ ...progressForm, progress: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={progressForm.status}
                  onChange={(e) => setProgressForm({ ...progressForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-955 dark:text-white"
                >
                  <option value="Active">Active Learning</option>
                  <option value="Completed">Completed</option>
                  <option value="OnHold">On Hold</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Save Progress Settings
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
