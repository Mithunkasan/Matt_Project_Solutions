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
      </CardContent>
    </Card>
  );
}