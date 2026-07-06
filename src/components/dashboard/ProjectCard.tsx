// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Project } from "@/types";
// import { useState } from "react";

// interface ProjectCardProps {
//   projects: Project;
//   onDelete: (projectId: string) => void;
// }

// export function ProjectCard({ projects, onDelete }: ProjectCardProps) {
//   const [deleting, setDeleting] = useState(false);

//   const handleDelete = async () => {
//     if (confirm("Are you sure you want to delete this project?")) {
//       setDeleting(true);
//       try {
//         const response = await fetch(`/api/projects/${projects.id}`, {
//           method: "DELETE",
//         });

//         if (response.ok) {
//           onDelete(projects.id);
//         } else {
//           alert("Failed to delete project");
//         }
//       } catch (error) {
//         console.error("Error deleting project:", error);
//         alert("Failed to delete project");
//       } finally {
//         setDeleting(false);
//       }
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <Card className="bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//       <CardContent className="p-5 sm:p-6">
//         {/* Project Name */}
//         <h3 className="font-semibold text-xl sm:text-2xl mb-4 text-gray-900 dark:text-gray-100 break-words">
//           {projects.name}
//         </h3>

//         {/* Top Row: College | Department | Handler */}
//         <div className="flex justify-between items-start text-sm sm:text-base gap-4 mb-4 flex-wrap">
//           {["College", "Department", "Handler"].map((label) => (
//             <div key={label} className="flex flex-col flex-1 min-w-[90px]">
//               <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
//               <p className="text-gray-600 dark:text-gray-400 break-words">
//                 {projects[label.toLowerCase() as keyof typeof projects]}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Row: Student | Date | Status */}
//         <div className="flex justify-between items-start text-sm sm:text-base gap-4 mb-5 flex-wrap">
//           <div className="flex flex-col flex-1 min-w-[90px]">
//             <span className="font-medium text-gray-700 dark:text-gray-300">Student</span>
//             <p className="text-gray-600 dark:text-gray-400 break-words">{projects.student}</p>
//           </div>
//           <div className="flex flex-col flex-1 min-w-[90px]">
//             <span className="font-medium text-gray-700 dark:text-gray-300">Project Date</span>
//             <p className="text-gray-600 dark:text-gray-400">{formatDate(projects.date)}</p>
//           </div>
//           <div className="flex flex-col flex-1 min-w-[90px]">
//             <span className="font-medium text-gray-700 dark:text-gray-300">Status</span>
//             <span
//               className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${projects.status === "completed"
//                   ? "bg-gradient-to-r from-green-200 to-green-400 text-green-800"
//                   : projects.status === "ongoing"
//                     ? "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-800"
//                     : "bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-800"
//                 }`}
//             >
//               {projects.status.charAt(0).toUpperCase() + projects.status.slice(1)}
//             </span>
//           </div>
//         </div>

//         {/* Payment Progress */}
//         <div className="mb-5">
//           <div className="flex justify-between text-sm mb-1">
//             <span className="font-medium text-gray-700 dark:text-gray-300">Payment Progress</span>
//             <span className="text-gray-600 dark:text-gray-400">
//               ${projects.amountPaid?.toLocaleString()} of ${projects.finalAmount?.toLocaleString()}
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
//             <div
//               className="h-3 rounded-full transition-all duration-500"
//               style={{
//                 width: `${projects.paymentProgress}%`,
//                 background: `linear-gradient(90deg, #4ade80, #22c55e)`,
//               }}
//             />
//           </div>
//           <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
//             {projects.paymentProgress}% paid
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 flex-col sm:flex-row">
//           <Button variant="outline" size="sm" className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-700">
//             Edit
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
//             onClick={handleDelete}
//             disabled={deleting}
//           >
//             {deleting ? "Deleting..." : "Delete"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>

//   );
// }







import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Upload, Calendar, Bell, X, CheckCircle2, Trash2 } from "lucide-react";

interface ProjectCardProps {
  projects: Project;
  onDelete: (projectId: string) => void;
  onUpdate: (projectId: string, updatedData: Partial<Project>) => void;
}

export function ProjectCard({ projects, onDelete, onUpdate }: ProjectCardProps) {
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Project>>(projects);

  const isAdmin = session?.user?.role === 'ADMIN';

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMeetOpen, setIsMeetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Forms
  const [uploadDocName, setUploadDocName] = useState("Proposal");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [meetForm, setMeetForm] = useState({
    title: "",
    date: "",
    time: "",
    meetLink: "",
    type: "PROJECT"
  });
  const [scheduling, setScheduling] = useState(false);

  const [alertForm, setAlertForm] = useState({
    title: "",
    message: "",
    type: "STATUS",
    sendEmail: false
  });
  const [sendingAlert, setSendingAlert] = useState(false);

  const handleEdit = () => {
    setEditing(true);
    setEditData(projects);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/projects/${projects.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        onUpdate(projects.id, updatedProject);
        setEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(projects);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      setDeleting(true);
      try {
        const response = await fetch(`/api/projects/${projects.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          onDelete(projects.id);
        } else {
          alert("Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setErrorMsg("Please select a file to upload");
      return;
    }
    setUploading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("projectId", projects.id);
      formData.append("documentName", uploadDocName);

      const res = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const fileRecord = await res.json();
        // Update locally
        const updatedFiles = projects.files ? [...projects.files] : [];
        const index = updatedFiles.findIndex(f => f.name === uploadDocName);
        if (index > -1) {
          updatedFiles[index] = fileRecord;
        } else {
          updatedFiles.push(fileRecord);
        }
        onUpdate(projects.id, { ...projects, files: updatedFiles });
        setUploadFile(null);
        setIsUploadOpen(false);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to upload file");
      }
    } catch {
      setErrorMsg("Upload request failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete the uploaded file for ${docName}?`)) return;
    try {
      const res = await fetch(`/api/projects/files/${fileId}`, { method: "DELETE" });
      if (res.ok) {
        const updatedFiles = projects.files ? projects.files.filter(f => f.id !== fileId) : [];
        onUpdate(projects.id, { ...projects, files: updatedFiles });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projects.studentEmail) {
      alert("This project does not have a registered student email.");
      return;
    }
    setScheduling(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: projects.studentEmail,
          title: meetForm.title,
          date: meetForm.date,
          time: meetForm.time,
          meetLink: meetForm.meetLink,
          type: "PROJECT"
        })
      });

      if (res.ok) {
        setIsMeetOpen(false);
        setMeetForm({ title: "", date: "", time: "", meetLink: "", type: "PROJECT" });
        alert("Meeting scheduled and student notified!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to schedule meeting");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScheduling(false);
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projects.studentEmail) {
      alert("This project does not have a registered student email.");
      return;
    }
    setSendingAlert(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: projects.studentEmail,
          title: alertForm.title,
          message: alertForm.message,
          type: alertForm.type,
          sendEmail: alertForm.sendEmail
        })
      });

      if (res.ok) {
        setIsAlertOpen(false);
        setAlertForm({ title: "", message: "", type: "STATUS", sendEmail: false });
        alert("Alert notification sent successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send alert");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingAlert(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleInputChange = (field: keyof Project, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field: keyof Project, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setEditData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:border-[#12498b] dark:hover:border-blue-500 h-full flex flex-col">
      {/* Header Section with Accent Color */}
      <div className="bg-[#12498b] px-5 sm:px-6 py-4">
        {editing ? (
          <input
            type="text"
            value={editData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full font-bold text-xl sm:text-2xl text-white bg-transparent border-b border-white/50 focus:border-white focus:outline-none px-1"
          />
        ) : (
          <h3 className="font-bold text-xl sm:text-2xl text-white break-words">
            {projects.name}
          </h3>
        )}
      </div>

      <CardContent className="p-5 sm:p-6 flex-grow flex flex-col bg-white dark:bg-gray-900">
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
              {editing ? (
                <input
                  type="text"
                  value={editData[key as keyof Project] as string || ""}
                  onChange={(e) => handleInputChange(key as keyof Project, e.target.value)}
                  className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#12498b] bg-white dark:bg-gray-800"
                />
              ) : (
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">
                  {projects[key as keyof Project] as string}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Student, Date, Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide mb-1">
              Student
            </span>
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editData.student || ""}
                  onChange={(e) => handleInputChange("student", e.target.value)}
                  placeholder="Student Name"
                  className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#12498b] bg-white dark:bg-gray-800"
                />
                <input
                  type="email"
                  value={editData.studentEmail || ""}
                  onChange={(e) => handleInputChange("studentEmail", e.target.value)}
                  placeholder="Student Email"
                  className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#12498b] bg-white dark:bg-gray-800"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">{projects.student}</p>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide mb-1">
              Project Date
            </span>
            {editing ? (
              <input
                type="date"
                value={editData.date || ""}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#12498b] bg-white dark:bg-gray-800"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{formatDate(projects.date)}</p>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide mb-1">
              Status
            </span>
            {editing ? (
              <select
                value={editData.status || ""}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#12498b] bg-white dark:bg-gray-800"
              >
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <div className="flex flex-col gap-2">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit shadow-sm ${projects.status === "completed"
                    ? "bg-green-500 text-white"
                    : projects.status === "ongoing"
                      ? "bg-blue-600 text-white"
                      : "bg-orange-500 text-white"
                    }`}
                >
                  {projects.status}
                </span>
                {!isAdmin && (
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${projects.status === 'completed' ? 'w-full bg-green-500' :
                        projects.status === 'ongoing' ? 'w-1/2 bg-blue-500' : 'w-1/4 bg-orange-400'
                        }`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Payment Progress Section - Admin Only */}
        {isAdmin && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[#12498b] dark:text-blue-400 uppercase tracking-wide">
                Payment Progress
              </span>
              {editing ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={editData.amountPaid || 0}
                    onChange={(e) => handleNumberChange("amountPaid", e.target.value)}
                    className="w-20 text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#12498b] bg-white dark:bg-gray-800"
                    placeholder="Paid"
                  />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">/</span>
                  <input
                    type="number"
                    value={editData.finalAmount || 0}
                    onChange={(e) => handleNumberChange("finalAmount", e.target.value)}
                    className="w-20 text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#12498b] bg-white dark:bg-gray-800"
                    placeholder="Total"
                  />
                </div>
              ) : (
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  ₹{projects.amountPaid?.toLocaleString()} / ₹{projects.finalAmount?.toLocaleString()}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-300 dark:border-gray-700">
              <div
                className="h-4 transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${projects.paymentProgress}%`,
                  background: `linear-gradient(90deg, #12498b, #1e6bb8)`,
                }}
              >
                {projects.paymentProgress > 15 && (
                  <span className="text-xs font-bold text-white">{projects.paymentProgress}%</span>
                )}
              </div>
            </div>
            {projects.paymentProgress <= 15 && (
              <div className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">
                {projects.paymentProgress}% paid
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isAdmin && (
          <div className="flex gap-3 flex-col sm:flex-row mt-auto">
            {editing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold transition-colors"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-gray-500 text-gray-600 hover:bg-gray-500 hover:text-white font-semibold transition-colors"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-[#12498b] text-[#12498b] hover:bg-[#12498b] hover:text-white font-semibold transition-colors dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-semibold transition-colors"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Custom Actions: Files, Meetings, Alerts */}
        {isAdmin && !editing && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-150 dark:border-gray-800 text-center">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-500 mb-1" />
              <span>Upload Doc</span>
            </button>
            <button
              onClick={() => setIsMeetOpen(true)}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-green-500 mb-1" />
              <span>Schedule Meet</span>
            </button>
            <button
              onClick={() => setIsAlertOpen(true)}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold cursor-pointer"
            >
              <Bell className="w-4 h-4 text-indigo-500 mb-1" />
              <span>Send Alert</span>
            </button>
          </div>
        )}
      </CardContent>

      {/* 1. DOCUMENT UPLOAD MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Project File Manager
            </h3>

            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-2.5 rounded text-xs mb-4">
                {errorMsg}
              </div>
            )}

            {/* List existing uploads */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Uploaded Files Checklist</h4>
              {projects.files && projects.files.length > 0 ? (
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {projects.files.map((file) => (
                    <div key={file.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-950 rounded-lg text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="font-bold text-gray-800 dark:text-white">{file.name}:</span>
                        <span className="text-gray-500 dark:text-gray-450 truncate">{file.fileName}</span>
                      </div>
                      <button
                        onClick={() => handleFileDelete(file.id, file.name)}
                        className="text-gray-400 hover:text-red-500 shrink-0 cursor-pointer p-1"
                        title="Delete upload"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg text-center">No files uploaded yet.</p>
              )}
            </div>

            {/* Upload form */}
            <form onSubmit={handleFileUpload} className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-850">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Document Category</label>
                <select
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-950 dark:text-white"
                >
                  {["Proposal", "Synopsis", "Source Code", "Project Report", "PPT", "IEEE Paper", "Screenshots", "User Manual", "Invoice"].map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select File</label>
                <input
                  type="file"
                  required
                  onChange={(e) => e.target.files && setUploadFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. MEETING MODAL */}
      {isMeetOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsMeetOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Schedule Project Review
            </h3>
            <form onSubmit={handleScheduleMeet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Student Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={projects.studentEmail || "No registered student"}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Session / Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase 1 Review & Source Code Walkthrough"
                  value={meetForm.title}
                  onChange={(e) => setMeetForm({ ...meetForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={meetForm.date}
                    onChange={(e) => setMeetForm({ ...meetForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-955 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 02:00 PM"
                    value={meetForm.time}
                    onChange={(e) => setMeetForm({ ...meetForm, time: e.target.value })}
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
                  value={meetForm.meetLink}
                  onChange={(e) => setMeetForm({ ...meetForm, meetLink: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={scheduling}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {scheduling ? "Scheduling..." : "Schedule & Notify"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. ALERT / REMINDER MODAL */}
      {isAlertOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAlertOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Send Alert to Student
            </h3>
            <form onSubmit={handleSendAlert} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Student Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={projects.studentEmail || "No registered student"}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payment Installment Overdue Reminder"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Alert Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Hello, this is a reminder that your second payment installment is overdue. Please complete the transaction to unlock project report documents."
                  value={alertForm.message}
                  onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Alert Type</label>
                <select
                  value={alertForm.type}
                  onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-955 dark:text-white"
                >
                  <option value="STATUS">Status Update</option>
                  <option value="PAYMENT">Payment Reminder</option>
                  <option value="MEETING">Meeting Update</option>
                  <option value="VIVA">Viva Date Alert</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={alertForm.sendEmail}
                  onChange={(e) => setAlertForm({ ...alertForm, sendEmail: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendEmail" className="text-xs font-semibold text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                  Send Email Notification Alert (SMTP)
                </label>
              </div>
              <button
                type="submit"
                disabled={sendingAlert}
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {sendingAlert ? "Sending..." : "Send Alert"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}