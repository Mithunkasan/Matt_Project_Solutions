"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Home } from "lucide-react";

interface NavigationMenuProps {
  language: "en" | "ta";
  themeColor: "blue" | "red" | "green" | "black" | "grey";
}

export function NavigationMenu({ language, themeColor }: NavigationMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isTa = language === "ta";

  // Dynamic branding background color mapping based on contrast theme
  const bgThemeMap = {
    blue: "bg-[#12498b]",
    red: "bg-[#b12222]",
    green: "bg-[#1e6b3c]",
    black: "bg-black",
    grey: "bg-slate-700",
  };

  // Nav Items definition
  const navItems = [
    {
      id: "home",
      label: isTa ? "முகப்பு" : "HOME",
      href: "/",
      isHome: true,
    },
    {
      id: "about",
      label: isTa ? "எங்களைப் பற்றி" : "ABOUT US",
      href: "/about",
    },
    {
      id: "services",
      label: isTa ? "சேவைகள்" : "SERVICES",
      href: "/services",
    },
    {
      id: "internship",
      label: isTa ? "இன்டர்ன்ஷிப்" : "INTERNSHIP",
      href: "/internship",
    },
    {
      id: "courses",
      label: isTa ? "பயிற்சிகள்" : "COURSES",
      href: "/courses",
    },
    {
      id: "gallery",
      label: isTa ? "கேலரி" : "GALLERY",
      href: "/gallery",
    },
    {
      id: "contact",
      label: isTa ? "தொடர்பு" : "CONTACT",
      href: "/contact",
    },
  ];

  return (
    <nav className={`w-full text-white ${bgThemeMap[themeColor]} shadow-md relative z-40 transition-colors`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center w-full overflow-x-auto scrollbar-hide py-1">
          {navItems.map((item) => {
            return (
              <div
                key={item.id}
                className="relative group flex-shrink-0"
              >
                {item.isHome ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-center p-3.5 hover:bg-black/15 transition-colors border-r border-white/10"
                    title={item.label}
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-black/15 transition-colors border-r border-white/10"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Navbar Header */}
        <div className="lg:hidden flex items-center justify-between w-full py-3.5">
          <span className="text-sm font-bold tracking-wider uppercase">
            {isTa ? "மேட் திட்ட தீர்வுகள்" : "MATT PROJECT SOLUTIONS"}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded hover:bg-black/10 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 shadow-xl flex flex-col py-3 z-50 animate-fadeIn max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            return (
              <div key={item.id} className="w-full">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Local custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}
