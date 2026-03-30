"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (status === "loading") {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="MATT Solutions Logo"
                  width={48}
                  height={48}
                  className="rounded"
                />
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">MATT Solutions</div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 transition-colors">
                <Image
                  src="/logo.png"
                  alt="MATT Engineering Solutions Logo"
                  width={48}
                  height={48}
                  className="rounded"
                />
              </Link>
            </div>
            <Link href="/" className="text-base sm:text-xl font-bold text-gray-900 dark:text-white hover:text-[#12498b] dark:hover:text-blue-400 transition-colors">
              <span className="hidden sm:inline">MATT Project Solutions</span>
              <span className="sm:hidden">MATT Project Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            {session ? (
              <>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    size="sm"
                    className="bg-[#12498b] hover:bg-[#0e3b6f] text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-[#b12222] hover:bg-[#911c1c] text-white"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right side - theme toggle and menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
            <div className="px-4 py-4 space-y-3">
              {session ? (
                <>
                  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-3 rounded-lg">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 border-red-200 dark:border-red-900/50 hover:border-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={closeMobileMenu} className="block">
                    <Button
                      size="default"
                      className="w-full bg-[#12498b] hover:bg-[#0e3b6f] text-white"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu} className="block">
                    <Button
                      size="default"
                      className="w-full bg-[#b12222] hover:bg-[#911c1c] text-white"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}