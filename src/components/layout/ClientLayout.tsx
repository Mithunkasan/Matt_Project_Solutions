"use client";

import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Navbar />
        {/* Add padding-top to account for fixed navbar height (4rem = 64px) */}
        <main className="pt-16">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}