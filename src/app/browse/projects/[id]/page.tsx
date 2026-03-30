import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function getPublicProjectsAbsolute() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";

  if (!host) {
    const res = await fetch(`/api/public/projects`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  }

  const base = `${proto}://${host}`;
  const url = `${base}/api/public/projects`;
  const res = await fetch(url, {
    next: { revalidate: 30 },
    headers: { cookie: h.get("cookie") || "" },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const projects = await getPublicProjectsAbsolute();
  const project = Array.isArray(projects) ? projects.find((p: { id: string | number }) => String(p.id) === String(id)) : null;

  if (!project) {
    notFound();
  }

  const progress = Math.max(0, Math.min(100, Number(project.paymentProgress || 0)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#12498b] to-[#1a5ba8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Link href="/browse?tab=projects" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Projects</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{project.name}</h1>
          <p className="text-blue-100 mt-1">Project details and payment progress</p>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#12498b] uppercase tracking-wide mb-1">College</p>
                  <p className="text-gray-900 font-medium break-words">{project.college}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#12498b] uppercase tracking-wide mb-1">Department</p>
                  <p className="text-gray-900 font-medium break-words">{project.department}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#12498b] uppercase tracking-wide mb-1">Handler</p>
                  <p className="text-gray-900 font-medium break-words">{project.handler}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#12498b] uppercase tracking-wide mb-1">Team</p>
                  <p className="text-gray-900 font-medium break-words">{project.team}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#12498b] uppercase tracking-wide mb-1">Student</p>
                  <p className="text-gray-900 font-medium break-words">{project.student}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#12498b] uppercase tracking-wide mb-1">Date</p>
                  <p className="text-gray-900 font-medium">{new Date(project.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-600 mb-2">Payment Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#12498b] to-[#1a5ba8] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <span>{progress}%</span>
                  <span>Completed</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Amount Paid</p>
                  <p className="text-lg font-bold text-gray-900">₹{Number(project.amountPaid || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Final Amount</p>
                  <p className="text-lg font-bold text-gray-900">₹{Number(project.finalAmount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${project.status === "completed"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : project.status === "in-progress"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                }`}>
                {project.status}
              </span>
              <Button asChild className="bg-[#16539b] hover:bg-[#1858a3] text-white">
                <Link href="/browse?tab=projects">Back to Browse</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
