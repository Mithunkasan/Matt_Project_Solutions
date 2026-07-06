"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Video, X, Clock, Mail } from "lucide-react";

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

export function MeetingManager() {
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mgmtError, setMgmtError] = useState("");
  
  const [meetingForm, setMeetingForm] = useState({
    studentEmail: "",
    title: "",
    date: "",
    time: "",
    meetLink: "",
    type: "PROJECT" // PROJECT or COURSE
  });

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/meetings");
      if (res.ok) {
        setMeetings(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMgmtError("");

    if (!meetingForm.meetLink.startsWith("http")) {
      setMgmtError("Please enter a valid Google Meet link (should start with http:// or https://)");
      return;
    }

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetingForm)
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setMeetingForm({ studentEmail: "", title: "", date: "", time: "", meetLink: "", type: "PROJECT" });
        await fetchMeetings();
      } else {
        const data = await res.json();
        setMgmtError(data.error || "Failed to schedule meeting");
      }
    } catch {
      setMgmtError("Network error. Failed to schedule meeting");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return;

    try {
      const res = await fetch(`/api/meetings/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await fetchMeetings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-650" />
            <span>Scheduled Meetings</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">Schedule reviews or classes via Google Meet and send join alerts directly to the students.</p>
        </div>
        <button
          onClick={() => {
            setMeetingForm({ studentEmail: "", title: "", date: "", time: "", meetLink: "", type: "PROJECT" });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#12498b] hover:bg-[#0f3d75] text-white rounded-lg font-semibold text-sm shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Grid of Meetings */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading meeting schedules...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white dark:bg-gray-900 border rounded-xl">
          No meetings scheduled. Click &quot;Schedule Meeting&quot; above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div 
              key={meeting.id}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-450 px-2 py-0.5 rounded uppercase">
                    {meeting.type} Session
                  </span>
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                    title="Cancel Meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-gray-900 dark:text-white mt-3 text-base">{meeting.title}</h4>
                
                <div className="space-y-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{meeting.time}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{meeting.studentEmail}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <a 
                  href={meeting.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Join Google Meet
                </a>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Google Meet
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
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
              Schedule New Meeting
            </h3>

            {mgmtError && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {mgmtError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Student Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@gmail.com"
                  value={meetingForm.studentEmail}
                  onChange={(e) => setMeetingForm({ ...meetingForm, studentEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Synopsis Discussion or Course Review"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-955 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Google Meet Link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  value={meetingForm.meetLink}
                  onChange={(e) => setMeetingForm({ ...meetingForm, meetLink: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Session Type</label>
                <select
                  value={meetingForm.type}
                  onChange={(e) => setMeetingForm({ ...meetingForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-955 dark:text-white"
                >
                  <option value="PROJECT">Project Review</option>
                  <option value="COURSE">Course Lecture</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Schedule & Send Mail Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
