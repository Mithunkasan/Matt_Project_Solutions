"use client";

import React from "react";
import { Youtube, Linkedin, Search, Map, Calendar } from "lucide-react";

// Configurable Links
const TWITTER_URL = "https://twitter.com";
const YOUTUBE_URL = "https://youtube.com";
const LINKEDIN_URL = "https://linkedin.com";
const WHATSAPP_URL = "https://whatsapp.com";
const MAP_URL = "#map"; // User will provide map URL later

interface UtilityHeaderProps {
  language: "en" | "ta";
  setLanguage: (lang: "en" | "ta") => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  themeColor: "blue" | "red" | "green" | "black" | "grey";
  setThemeColor: (color: "blue" | "red" | "green" | "black" | "grey") => void;
}

// Custom SVG path for Twitter X logo
function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Custom SVG path for WhatsApp logo
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.978 14.121.954 11.5.954c-5.442 0-9.865 4.37-9.869 9.801 0 1.956.518 3.868 1.5 5.575l-.979 3.575 3.695-.951zm12.336-7.85c-.27-.134-1.602-.78-1.85-.87-.248-.09-.43-.134-.61.135-.18.27-.7 1.125-.858 1.306-.157.18-.315.2-.585.067-.27-.134-1.14-.419-2.17-1.332-.8-.707-1.34-1.58-1.498-1.848-.157-.27-.017-.417.118-.551.122-.121.27-.315.405-.472.135-.157.18-.27.27-.45.09-.18.045-.337-.022-.472-.067-.134-.61-1.456-.837-2.002-.22-.533-.48-.46-.61-.466-.118-.006-.27-.008-.43-.008-.158 0-.417.058-.636.292-.218.234-.834.805-.834 1.964 0 1.159.854 2.278.973 2.435.12.157 1.68 2.535 4.07 3.542.57.24 1.01.384 1.36.495.57.18 1.09.155 1.5.095.45-.067 1.6-.646 1.83-1.27.23-.624.23-1.159.16-1.27-.07-.11-.25-.18-.52-.315z" />
    </svg>
  );
}

export function UtilityHeader({
  language,
  setLanguage,
  fontSize,
  setFontSize,
  themeColor,
  setThemeColor,
}: UtilityHeaderProps) {
  const isTa = language === "ta";

  const handleIncreaseFont = () => {
    if (fontSize === "small") setFontSize("medium");
    else if (fontSize === "medium") setFontSize("large");
  };

  const handleDecreaseFont = () => {
    if (fontSize === "large") setFontSize("medium");
    else if (fontSize === "medium") setFontSize("small");
  };

  return (
    <div className="w-full bg-[#f8f9fa] border-b border-gray-200 py-2.5 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left Side: Social Icons */}
        <div className="flex items-center space-x-4">
          <a
            href={"https://x.com/mattenggsoln"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-800 hover:text-black dark:text-neutral-300 dark:hover:text-white hover:scale-108 transition-all"
            title="Twitter / X"
          >
            <XLogoIcon className="w-4.5 h-4.5" />
          </a>
          <a
            href={"https://www.youtube.com/mattengineeringequipments"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 hover:scale-108 transition-all"
            title="YouTube"
          >
            <Youtube className="w-5.5 h-5.5" />
          </a>
          <a
            href={"https://www.linkedin.com/company/mattengineeringsolutions"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 hover:scale-108 transition-all"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5 fill-current" />
          </a>
          <a
            href={"https://wa.me/916379721546"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] hover:text-[#20ba56] hover:scale-108 transition-all"
            title="WhatsApp"
          >
            <WhatsAppIcon className="w-4.5 h-4.5" />
          </a>
        </div>

        {/* Center: Search & Navigation Map/Sitemap */}
        <div className="flex items-center flex-wrap justify-center gap-4">
          {/* Search Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={isTa ? "தேடுக..." : "Search..."}
              className="bg-white border border-gray-300 rounded px-2 py-0.5 pr-7 text-xs w-40 focus:outline-none focus:border-blue-500 text-gray-800"
            />
            <button className="absolute right-1 text-gray-500 hover:text-gray-700">
              <Search className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Links */}
          <a
            href={MAP_URL}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-700 font-medium transition-colors"
          >
            <Map className="w-3.5 h-3.5 text-gray-500" />
            <span>{isTa ? "வரைபடம்" : "MAP"}</span>
          </a>
          <a
            href="#sitemap"
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-700 font-medium transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{isTa ? "வலைத்தள வரைபடம்" : "Sitemap"}</span>
          </a>
        </div>

        {/* Right Side: Accessibility & Theme */}
        <div className="flex items-center space-x-4 flex-wrap justify-center">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "ta" : "en")}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 rounded shadow-xs text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer select-none"
          >
            {language === "en" ? "தமிழ்" : "English"}
          </button>

          {/* Font Size Adjusters */}
          <div className="flex items-center bg-white rounded border border-gray-200 shadow-xs overflow-hidden">
            <button
              onClick={handleDecreaseFont}
              disabled={fontSize === "small"}
              className={`px-2.5 py-1 text-xs font-bold border-r border-gray-200 transition-all cursor-pointer select-none ${
                fontSize === "small" ? "opacity-30 cursor-not-allowed text-gray-400 bg-gray-50" : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`}
              title="Decrease Font Size"
            >
              A−
            </button>
            <span className="px-2 py-0.5 text-[9px] font-extrabold text-gray-500 bg-gray-50/50 uppercase select-none">
              {fontSize === "small" ? (isTa ? "சிறியது" : "SMALL") : fontSize === "medium" ? (isTa ? "சாதாரண" : "NORMAL") : (isTa ? "பெரியது" : "LARGE")}
            </span>
            <button
              onClick={handleIncreaseFont}
              disabled={fontSize === "large"}
              className={`px-2.5 py-1 text-xs font-bold border-l border-gray-200 transition-all cursor-pointer select-none ${
                fontSize === "large" ? "opacity-30 cursor-not-allowed text-gray-400 bg-gray-50" : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Color/Theme Toggles */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded border border-gray-200 shadow-xs">
            <button
              onClick={() => setThemeColor("blue")}
              className={`w-3.5 h-3.5 bg-blue-700 border transition-all ${
                themeColor === "blue" ? "ring-2 ring-blue-400 border-white scale-110" : "border-gray-300 hover:scale-105"
              }`}
              title="Blue Theme"
            />
            <button
              onClick={() => setThemeColor("red")}
              className={`w-3.5 h-3.5 bg-red-700 border transition-all ${
                themeColor === "red" ? "ring-2 ring-red-400 border-white scale-110" : "border-gray-300 hover:scale-105"
              }`}
              title="Red Theme"
            />
            <button
              onClick={() => setThemeColor("green")}
              className={`w-3.5 h-3.5 bg-emerald-700 border transition-all ${
                themeColor === "green" ? "ring-2 ring-emerald-400 border-white scale-110" : "border-gray-300 hover:scale-105"
              }`}
              title="Green Theme"
            />
            <button
              onClick={() => setThemeColor("black")}
              className={`w-3.5 h-3.5 bg-black border transition-all ${
                themeColor === "black" ? "ring-2 ring-neutral-500 border-white scale-110" : "border-gray-300 hover:scale-105"
              }`}
              title="High Contrast Black Theme"
            />
            <button
              onClick={() => setThemeColor("grey")}
              className={`w-3.5 h-3.5 bg-slate-600 border transition-all ${
                themeColor === "grey" ? "ring-2 ring-slate-400 border-white scale-110" : "border-gray-300 hover:scale-105"
              }`}
              title="Slate Theme"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
