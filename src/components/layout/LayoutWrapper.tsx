"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollingMarquee } from "@/components/layout/ScrollingMarquee";

const NO_LAYOUT_ROUTES = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/forgot-student-id",
  "/reset-password",
  "/admin",
  "/internship-register",
  "/about",
  "/services",
  "/internship",
  "/courses",
  "/gallery",
  "/contact",
]);

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Suppress layout for exact matches or auth routes
  const showDefaultLayout = !NO_LAYOUT_ROUTES.has(pathname);

  if (!showDefaultLayout) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <ScrollingMarquee />
      <main className="min-h-screen pt-28">
        {children}
      </main>
    </>
  );
}
