import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 py-8 transition-colors">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your college projects and classes in one place
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
        {/* Projects Card */}
        <Link href="/dashboard/projects">
          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-t-4 border-[#12498b] bg-white dark:bg-gray-900 dark:border-blue-600 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#12498b] bg-opacity-10 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-[#12498b] dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Projects</CardTitle>
                  <CardDescription className="dark:text-gray-400">Manage your projects</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track project details, payments, and completion status
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Classes Card */}
        <Link href="/dashboard/classes">
          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-t-4 border-[#b12222] bg-white dark:bg-gray-900 dark:border-red-600 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#b12222] bg-opacity-10 dark:bg-red-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-[#b12222] dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Class Schedules</CardTitle>
                  <CardDescription className="dark:text-gray-400">View your classes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Organize class timings and faculty information
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}