import Link from "next/link"
import { ClassSchedule } from "@/types"

interface ClassCardProps {
  classItem: ClassSchedule
  view: "grid" | "detail"
  onViewDetails?: () => void
}

export default function ClassCard({ classItem, view = "grid", onViewDetails }: ClassCardProps) {
  if (view === "detail") {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{classItem.project}</h1>
          <p className="text-gray-300 text-sm md:text-base">Class Schedule Details</p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{classItem.day}</div>
                    <p className="text-gray-600 text-sm">Day of Week</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-gray-900 mb-1">{classItem.time}</div>
                    <p className="text-gray-600 text-sm">Class Time</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">{classItem.faculty}</div>
                    <p className="text-gray-600 text-sm">Faculty Member</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {classItem.location && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900 mb-1">{classItem.location}</div>
                      <p className="text-gray-600 text-sm">Room Location</p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">Class is currently active</span>
              </div>
              <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium">
                View Materials
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (for browse page)
  return (
    <div className="h-full flex justify-center w-full">
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-200 hover:border-gray-300 hover:-translate-y-1 cursor-pointer flex flex-col w-full max-w-xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {classItem.faculty}
          </h3>

          <span className="px-4 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
            Pending
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">

          {/* Day */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-lg">
              📅
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Day</p>
              <p className="text-sm font-medium text-gray-900">
                {classItem.day}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 text-lg">
              ⏰
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Time</p>
              <p className="text-sm font-medium text-gray-900">
                {classItem.time}
              </p>
            </div>
          </div>

          {/* Faculty */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 text-lg">
              👤
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Faculty</p>
              <p className="text-sm font-medium text-gray-900">
                {classItem.faculty}
              </p>
            </div>
          </div>

          {/* Department */}
          {classItem.department && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600 text-lg">
                🏢
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-sm font-medium text-gray-900">
                  {classItem.department}
                </p>
              </div>
            </div>
          )}

          {/* Room (location) */}
          {classItem.location && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-50 text-pink-600 text-lg">
                📍
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Room</p>
                <p className="text-sm font-medium text-gray-900">
                  {classItem.location}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
          {onViewDetails ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onViewDetails()
              }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm hover:opacity-90 transition"
            >
              View Details →
            </button>
          ) : (
            <Link
              href={`/classes/${classItem.id}`}
              className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-700"
            >
              <span>View details</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}