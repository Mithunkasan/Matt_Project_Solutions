// import Link from "next/link"

// type Project = {
//   id: string
//   name: string
//   college: string
//   department: string
//   handler: string
//   team: string
//   student: string
//   date: string
//   amountPaid: number
//   finalAmount: number
//   status: string
//   paymentProgress: number
// }

// interface ProjectCardProps {
//   project: Project
//   view: "grid" | "detail"
// }

// export default function ProjectCard({ project, view = "grid" }: ProjectCardProps) {
//   if (view === "detail") {
//     return (
//       <div className="bg-white rounded-2xl shadow-2xl p-8 border-l-8 border-[#12498b]">
//         <div className="flex justify-between items-start mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
//           <span
//             className={`px-4 py-2 rounded-full text-sm font-semibold ${
//               project.status === "completed"
//                 ? "bg-green-100 text-green-700"
//                 : project.status === "in-progress"
//                 ? "bg-blue-100 text-blue-700"
//                 : "bg-yellow-100 text-yellow-700"
//             }`}
//           >
//             {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
//           </span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">College Information</h3>
//               <div className="mt-2 space-y-2">
//                 <p className="text-lg text-gray-900">
//                   <span className="font-semibold">College:</span> {project.college}
//                 </p>
//                 <p className="text-lg text-gray-900">
//                   <span className="font-semibold">Department:</span> {project.department}
//                 </p>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Team Details</h3>
//               <div className="mt-2 space-y-2">
//                 <p className="text-lg text-gray-900">
//                   <span className="font-semibold">Handler:</span> {project.handler}
//                 </p>
//                 <p className="text-lg text-gray-900">
//                   <span className="font-semibold">Team:</span> {project.team}
//                 </p>
//                 <p className="text-lg text-gray-900">
//                   <span className="font-semibold">Student:</span> {project.student}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Project Timeline</h3>
//               <div className="mt-2">
//                 <p className="text-lg text-gray-900">
//                   <span className="font-semibold">Date:</span> {new Date(project.date).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}
//                 </p>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Payment Progress</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold text-gray-700">Progress</span>
//                   <span className="text-xl font-bold text-[#12498b]">{project.paymentProgress}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-4">
//                   <div
//                     className="bg-[#12498b] h-4 rounded-full transition-all duration-500"
//                     style={{ width: `${project.paymentProgress}%` }}
//                   ></div>
//                 </div>
//                 <div className="flex justify-between text-lg">
//                   <span className="text-gray-600">Paid: ₹{project.amountPaid.toLocaleString()}</span>
//                   <span className="text-gray-600">Total: ₹{project.finalAmount.toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Grid view (for browse page)
//   return (
//     <Link href={`/projects/${project.id}`}>
//       <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-[#12498b] hover:-translate-y-1 cursor-pointer">
//         <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
//         <div className="space-y-2 mb-4 text-sm text-gray-600">
//           <p><span className="font-semibold">College:</span> {project.college}</p>
//           <p><span className="font-semibold">Department:</span> {project.department}</p>
//           <p><span className="font-semibold">Handler:</span> {project.handler}</p>
//           <p><span className="font-semibold">Date:</span> {new Date(project.date).toLocaleDateString()}</p>
//         </div>
//         <div className="mb-4">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-semibold text-gray-700">Payment Progress</span>
//             <span className="text-sm font-bold text-[#12498b]">{project.paymentProgress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-[#12498b] h-2 rounded-full transition-all"
//               style={{ width: `${project.paymentProgress}%` }}
//             ></div>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//               project.status === "completed"
//                 ? "bg-green-100 text-green-700"
//                 : project.status === "in-progress"
//                 ? "bg-blue-100 text-blue-700"
//                 : "bg-yellow-100 text-yellow-700"
//             }`}
//           >
//             {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
//           </span>
//         </div>
//       </div>
//     </Link>
//   )
// }





import Link from "next/link"

type Project = {
  id: string
  name: string
  college: string
  department: string
  handler: string
  team: string
  student: string
  date: string
  amountPaid: number
  finalAmount: number
  status: string
  paymentProgress: number
}

interface ProjectCardProps {
  project: Project
  view: "grid" | "detail"
  onViewDetails?: () => void
}

export default function ProjectCard({ project, view = "grid", onViewDetails }: ProjectCardProps) {
  if (view === "detail") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#12498b] to-[#1a5ba8] px-6 py-8 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-blue-100 text-sm sm:text-base">{project.college}</p>
            </div>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium self-start ${
                project.status === "completed"
                  ? "bg-green-500 text-white"
                  : project.status === "in-progress"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-8 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Academic Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Department</span>
                    <span className="text-sm text-gray-900 font-medium">{project.department}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Student</span>
                    <span className="text-sm text-gray-900">{project.student}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Project Timeline
                </h3>
                <div className="flex items-start">
                  <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Start Date</span>
                  <span className="text-sm text-gray-900">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Team Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Handler</span>
                    <span className="text-sm text-gray-900 font-medium">{project.handler}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Team</span>
                    <span className="text-sm text-gray-900">{project.team}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (for browse page)
  return (
    <div className="h-full flex">
      <div className="group bg-white rounded-lg border border-gray-200 hover:border-[#12498b] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col w-full h-full">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#12498b] transition-colors line-clamp-2">
              {project.name}
            </h3>
            <span
              className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                project.status === "completed"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : project.status === "in-progress"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {project.status === "in-progress" ? "In Progress" : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-5 py-4 flex-1">
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start">
              <span className="text-gray-500 w-20 flex-shrink-0">College</span>
              <span className="text-gray-900 font-medium line-clamp-1">{project.college}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-20 flex-shrink-0">Dept.</span>
              <span className="text-gray-900 line-clamp-1">{project.department}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-20 flex-shrink-0">Handler</span>
              <span className="text-gray-900 line-clamp-1">{project.handler}</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {new Date(project.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
            {onViewDetails ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onViewDetails()
                }}
                className="text-[#12498b] font-medium hover:underline cursor-pointer"
              >
                View Details →
              </button>
            ) : (
              <Link href={`/projects/${project.id}`} className="text-[#12498b] font-medium group-hover:underline">
                View Details →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}