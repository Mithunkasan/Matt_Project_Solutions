// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ClassSchedule } from "@/types";

// interface ClassScheduleCardProps {
//   classItem: ClassSchedule;
// }

// export function ClassScheduleCard({ classItem }: ClassScheduleCardProps) {
//   return (
//     <Card className="bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//       <CardContent className="p-5 sm:p-6">
//         {/* Project Name */}
//         <h3 className="font-semibold text-xl sm:text-2xl mb-4 text-gray-900 dark:text-gray-100 break-words">
//           {classItem.project}
//         </h3>

//         {/* First Row: Day | Time | Location */}
//         <div className="flex flex-wrap gap-4 mb-4">
//           <div className="flex flex-col flex-1 min-w-[100px]">
//             <span className="font-medium text-gray-700 dark:text-gray-300 mb-1">Day</span>
//             <span className="text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
//               {classItem.day}
//             </span>
//           </div>
//           <div className="flex flex-col flex-1 min-w-[100px]">
//             <span className="font-medium text-gray-700 dark:text-gray-300 mb-1">Time</span>
//             <span className="text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900 px-2 py-1 rounded">
//               {classItem.time}
//             </span>
//           </div>
//           <div className="flex flex-col flex-1 min-w-[150px]">
//             <span className="font-medium text-gray-700 dark:text-gray-300 mb-1">Location</span>
//             <span className="text-gray-600 dark:text-gray-400 break-words">
//               {classItem.location} - {classItem.department}
//             </span>
//           </div>
//         </div>

//         {/* Second Row: Faculty */}
//         <div className="flex flex-wrap gap-4 mb-5">
//           <div className="flex flex-col flex-1 min-w-[100px]">
//             <span className="font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</span>
//             <span className="text-gray-600 dark:text-gray-400 break-words">{classItem.faculty}</span>
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
//           >
//             Delete
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }









// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ClassSchedule } from "@/types";

// interface ClassScheduleCardProps {
//   classItem: ClassSchedule;
// }

// export function ClassScheduleCard({ classItem }: ClassScheduleCardProps) {
//   return (
//     <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#b12222]">
//       {/* Header Section with Accent Color */}
//       <div className="bg-[#b12222] px-5 sm:px-6 py-4">
//         <h3 className="font-bold text-xl sm:text-2xl text-white break-words">
//           {classItem.project}
//         </h3>
//       </div>

//       <CardContent className="p-5 sm:p-6">
//         {/* Day, Time, Location Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-200">
//           <div className="flex flex-col">
//             <span className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">
//               Day
//             </span>
//             <p className="text-sm text-gray-800 font-medium break-words">
//               {classItem.day}
//             </p>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">
//               Time
//             </span>
//             <p className="text-sm text-gray-800 font-medium break-words">
//               {classItem.time}
//             </p>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">
//               Location
//             </span>
//             <p className="text-sm text-gray-800 font-medium break-words">
//               {classItem.location}
//             </p>
//           </div>
//         </div>

//         {/* Department and Faculty Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-200">
//           <div className="flex flex-col">
//             <span className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">
//               Department
//             </span>
//             <p className="text-sm text-gray-800 font-medium break-words">
//               {classItem.department}
//             </p>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">
//               Faculty
//             </span>
//             <p className="text-sm text-gray-800 font-medium break-words">
//               {classItem.faculty}
//             </p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 flex-col sm:flex-row">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="flex-1 border-2 border-[#b12222] text-[#b12222] hover:bg-[#b12222] hover:text-white font-semibold transition-colors"
//           >
//             Edit
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-semibold transition-colors"
//           >
//             Delete
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }











import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClassSchedule } from "@/types";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ClassScheduleCardProps {
  classItem: ClassSchedule;
  onDelete: (classId: string) => void;
  onUpdate: (classId: string, updatedData: Partial<ClassSchedule>) => void;
}

export function ClassScheduleCard({ classItem, onDelete, onUpdate }: ClassScheduleCardProps) {
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ClassSchedule>>(classItem);

  const isAdmin = session?.user?.role === 'ADMIN';

  const handleEdit = () => {
    setEditing(true);
    setEditData(classItem);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/classes/${classItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedClass = await response.json();
        onUpdate(classItem.id, updatedClass);
        setEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update class schedule");
      }
    } catch (error) {
      console.error("Error updating class schedule:", error);
      alert("Failed to update class schedule");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(classItem);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this class schedule?")) {
      setDeleting(true);
      try {
        const response = await fetch(`/api/classes/${classItem.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          onDelete(classItem.id);
        } else {
          alert("Failed to delete class schedule");
        }
      } catch (error) {
        console.error("Error deleting class schedule:", error);
        alert("Failed to delete class schedule");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleInputChange = (field: keyof ClassSchedule, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:border-[#b12222] dark:hover:border-red-500 h-full flex flex-col">
      {/* Header Section with Accent Color */}
      <div className="bg-[#b12222] px-5 sm:px-6 py-4">
        {editing ? (
          <input
            type="text"
            value={editData.project || ""}
            onChange={(e) => handleInputChange("project", e.target.value)}
            className="w-full font-bold text-xl sm:text-2xl text-white bg-transparent border-b border-white/50 focus:border-white focus:outline-none px-1"
          />
        ) : (
          <h3 className="font-bold text-xl sm:text-2xl text-white break-words">
            {classItem.project}
          </h3>
        )}
      </div>

      <CardContent className="p-5 sm:p-6 flex-grow flex flex-col bg-white dark:bg-gray-900">
        {/* Day, Time, Location Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b12222] dark:text-red-400 uppercase tracking-wide mb-1">
              Day
            </span>
            {editing ? (
              <input
                type="text"
                value={editData.day || ""}
                onChange={(e) => handleInputChange("day", e.target.value)}
                className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#b12222] bg-white dark:bg-gray-800"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">
                {classItem.day}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b12222] dark:text-red-400 uppercase tracking-wide mb-1">
              Time
            </span>
            {editing ? (
              <input
                type="text"
                value={editData.time || ""}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#b12222] bg-white dark:bg-gray-800"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">
                {classItem.time}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b12222] dark:text-red-400 uppercase tracking-wide mb-1">
              Location
            </span>
            {editing ? (
              <input
                type="text"
                value={editData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#b12222] bg-white dark:bg-gray-800"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">
                {classItem.location}
              </p>
            )}
          </div>
        </div>

        {/* Department and Faculty Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b12222] dark:text-red-400 uppercase tracking-wide mb-1">
              Department
            </span>
            {editing ? (
              <input
                type="text"
                value={editData.department || ""}
                onChange={(e) => handleInputChange("department", e.target.value)}
                className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#b12222] bg-white dark:bg-gray-800"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">
                {classItem.department}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b12222] dark:text-red-400 uppercase tracking-wide mb-1">
              Faculty / Student
            </span>
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editData.faculty || ""}
                  onChange={(e) => handleInputChange("faculty", e.target.value)}
                  placeholder="Faculty Name"
                  className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#b12222] bg-white dark:bg-gray-800"
                />
                <input
                  type="email"
                  value={editData.studentEmail || ""}
                  onChange={(e) => handleInputChange("studentEmail", e.target.value)}
                  placeholder="Student Email"
                  className="text-sm text-gray-800 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#b12222] bg-white dark:bg-gray-800"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">
                {classItem.faculty}
              </p>
            )}
          </div>

        </div>

        {/* Action Buttons - Admin Only */}
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
                  className="flex-1 border-2 border-[#b12222] text-[#b12222] hover:bg-[#b12222] hover:text-white font-semibold transition-colors dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
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