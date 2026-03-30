import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function getPublicClassesAbsolute() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";

  if (!host) {
    const res = await fetch(`/api/public/classes`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  }

  const base = `${proto}://${host}`;
  const url = `${base}/api/public/classes`;
  const res = await fetch(url, {
    next: { revalidate: 30 },
    headers: {
      cookie: h.get("cookie") || "",
    },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ClassDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const classes = await getPublicClassesAbsolute();
  const classItem = Array.isArray(classes) ? classes.find((c: { id: string | number }) => String(c.id) === String(id)) : null;

  if (!classItem) {
    notFound();
  }

  const title = classItem.subject || classItem.project || "Class";
  const location = classItem.location || classItem.room || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#b12222] to-[#d42a2a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Link href="/browse?tab=classes" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Classes</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{title}</h1>
          <p className="text-blue-100 mt-1">Class schedule details</p>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">Day</p>
                  <p className="text-gray-900 font-medium">{classItem.day}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">Time</p>
                  <p className="text-gray-900 font-medium">{classItem.time}</p>
                </div>
                {location && (
                  <div>
                    <p className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">Location</p>
                    <p className="text-gray-900 font-medium break-words">{location}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {classItem.department && (
                  <div>
                    <p className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">Department</p>
                    <p className="text-gray-900 font-medium break-words">{classItem.department}</p>
                  </div>
                )}
                {classItem.faculty && (
                  <div>
                    <p className="text-xs font-semibold text-[#b12222] uppercase tracking-wide mb-1">Faculty</p>
                    <p className="text-gray-900 font-medium break-words">{classItem.faculty}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">Class is active</span>
              </div>
              <Button asChild className="bg-[#c62727] text-white hover:bg-red-600  hover:text-white">
                <Link href="/browse?tab=classes">Back to Browse</Link>
              </Button>

            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
