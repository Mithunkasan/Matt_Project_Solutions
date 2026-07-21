"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  MessageSquare, User, Search, Paperclip, Mic, 
  Square, FileDown 
} from "lucide-react";

interface ChatThread {
  studentEmail: string;
  studentName: string;
  lastMessage?: string;
  lastMessageAt?: string;
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

export function AdminChatHub() {
  const [threads, setChatThreads] = useState<ChatThread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ChatThread[]>([]);
  const [selectedThreadEmail, setSelectedThreadEmail] = useState<string>("");
  const [selectedThreadName, setSelectedThreadName] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [threadSearch, setThreadSearch] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatFile, setChatFile] = useState<File | null>(null);
  
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Voice note refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchThreads = async () => {
    try {
      const res = await fetch("/api/chat?mode=threads");
      if (res.ok) {
        const data = await res.json();
        setChatThreads(data);
        setFilteredThreads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingThreads(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const fetchMessages = useCallback(async (email: string) => {
    if (!email) return;
    try {
      const res = await fetch(`/api/chat?studentEmail=${encodeURIComponent(email)}`);
      if (res.ok) {
        setMessages(await res.json());
        scrollToBottom();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (selectedThreadEmail) {
      fetchMessages(selectedThreadEmail);
      const interval = setInterval(() => {
        fetchMessages(selectedThreadEmail);
      }, 5000); // Poll messages every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedThreadEmail, fetchMessages]);

  useEffect(() => {
    if (!threadSearch.trim()) {
      setFilteredThreads(threads);
    } else {
      const clean = threadSearch.toLowerCase();
      setFilteredThreads(threads.filter(t => 
        t.studentEmail.toLowerCase().includes(clean) || 
        t.studentName.toLowerCase().includes(clean)
      ));
    }
  }, [threadSearch, threads]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThreadEmail || (!chatInput.trim() && !chatFile && !sending)) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("message", chatInput);
      formData.append("studentEmail", selectedThreadEmail);
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
        await fetchMessages(selectedThreadEmail);
        fetchThreads(); // Refresh thread list lastMessage timestamp
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // Voice note recording
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
        if (!selectedThreadEmail) return;
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: "audio/webm" });
        
        setSending(true);
        try {
          const formData = new FormData();
          formData.append("message", "Sent a voice message");
          formData.append("studentEmail", selectedThreadEmail);
          formData.append("file", audioFile);

          const res = await fetch("/api/chat", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            await fetchMessages(selectedThreadEmail);
            fetchThreads();
          }
        } catch (err) {
          console.error("Failed to upload voice message:", err);
        } finally {
          setSending(false);
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

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm flex h-[600px]">
      
      {/* Left panel: Threads list */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
        <div className="p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-855 space-y-3">
          <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">Student Threads</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search student or email..."
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-xl text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-850">
          {loadingThreads ? (
            <div className="text-center py-8 text-xs text-gray-400">Loading student threads...</div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">No threads found.</div>
          ) : (
            filteredThreads.map((thread) => {
              const isActive = selectedThreadEmail === thread.studentEmail;
              const hasMessage = thread.lastMessageAt && new Date(thread.lastMessageAt).getTime() > 0;
              return (
                <div
                  key={thread.studentEmail}
                  onClick={() => {
                    setSelectedThreadEmail(thread.studentEmail);
                    setSelectedThreadName(thread.studentName);
                  }}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-blue-50/50 dark:bg-blue-950/15" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-950/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isActive 
                        ? "bg-[#12498b] text-white" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{thread.studentName}</p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{thread.studentEmail}</p>
                    </div>
                  </div>
                  {hasMessage && thread.lastMessageAt && (
                    <span className="text-[8px] text-gray-400 shrink-0 self-start mt-0.5">
                      {new Date(thread.lastMessageAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel: Active chat window */}
      <div className="flex-1 flex flex-col bg-gray-50/10 dark:bg-gray-950/5">
        {selectedThreadEmail ? (
          <>
            {/* Header */}
            <div className="p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-855 flex items-center justify-between shrink-0">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Active Chat: {selectedThreadName}</h4>
                <p className="text-[9px] text-gray-500 mt-0.5">{selectedThreadEmail}</p>
              </div>
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </div>

            {/* Message Viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => {
                const isAdminMsg = msg.senderRole !== "STUDENT";
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isAdminMsg ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-2xl p-3 text-xs shadow-sm ${
                        isAdminMsg 
                          ? "bg-[#12498b] text-white" 
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                      {/* File attachment */}
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
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachment preview */}
            {chatFile && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 shrink-0">
                <span className="truncate max-w-[200px] font-medium">Attachment: {chatFile.name}</span>
                <button onClick={() => setChatFile(null)} className="text-red-500 hover:text-red-700">Cancel</button>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-gray-50 dark:bg-gray-955 border-t border-gray-200 dark:border-gray-855 flex items-center space-x-2 shrink-0">
              <label className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer shrink-0">
                <Paperclip className="w-4 h-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => e.target.files && setChatFile(e.target.files[0])}
                />
              </label>

              <input
                type="text"
                placeholder={recording ? "Recording audio note..." : "Type your message..."}
                disabled={recording}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-855 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#12498b] text-gray-900 dark:text-white"
              />

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

              <button
                type="submit"
                disabled={sending || (!chatInput.trim() && !chatFile)}
                className="py-2 px-3.5 bg-[#12498b] hover:bg-[#0f3d75] text-white text-xs font-bold rounded-xl shadow transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-2 text-gray-400">
            <MessageSquare className="w-12 h-12 text-gray-300" />
            <p className="text-sm">Select a student thread from the left panel to begin chatting.</p>
          </div>
        )}
      </div>

    </div>
  );
}
