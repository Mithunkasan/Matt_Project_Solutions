"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, ChevronLeft, ChevronRight, Volume2, Calendar } from "lucide-react";
import { DEFAULT_MAIN_GRID_SLIDES } from "@/lib/landingDefaults";

interface MainGridProps {
  language: "en" | "ta";
  themeColor: "blue" | "red" | "green" | "black" | "grey";
}

interface ImportantLinkItem {
  id: string;
  title: string;
  url: string;
}

interface AnnouncementItem {
  id: string;
  month: string;
  day: string;
  title: string;
  href: string;
}

interface MainGridSlideItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  badge: string;
  sortOrder: number;
}

export function MainGrid({ language, themeColor }: MainGridProps) {
  const isTa = language === "ta";

  const textThemeMap = {
    blue: "text-[#12498b]",
    red: "text-[#b12222]",
    green: "text-[#1e6b3c]",
    black: "text-black dark:text-white",
    grey: "text-slate-700 dark:text-slate-300",
  };

  const bgThemeMap = {
    blue: "bg-[#12498b]",
    red: "bg-[#b12222]",
    green: "bg-[#1e6b3c]",
    black: "bg-black",
    grey: "bg-slate-700",
  };

  const accentBgThemeMap = {
    blue: "bg-[#e6effc] text-[#12498b]",
    red: "bg-[#fdebeb] text-[#b12222]",
    green: "bg-[#eaf7ee] text-[#1e6b3c]",
    black: "bg-neutral-800 text-yellow-400",
    grey: "bg-slate-100 text-slate-700",
  };

  const [links, setLinks] = useState<ImportantLinkItem[]>([]);
  const [newsItems, setNewsItems] = useState<AnnouncementItem[]>([]);
  const [slides, setSlides] = useState<MainGridSlideItem[]>(
    DEFAULT_MAIN_GRID_SLIDES.map((slide, idx) => ({
      id: `default-slide-${idx}`,
      ...slide,
    }))
  );
  const [activeSlide, setActiveSlide] = useState(0);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/landing/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error("Fetch links error:", err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/landing/announcements");
      if (res.ok) {
        const data = await res.json();
        setNewsItems(data);
      }
    } catch (err) {
      console.error("Fetch announcements error:", err);
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/landing/main-grid-slides");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          setActiveSlide(0);
        }
      }
    } catch (err) {
      console.error("Fetch main grid slides error:", err);
    }
  };

  useEffect(() => {
    fetchLinks();
    fetchAnnouncements();
    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-gray-900 py-8 px-4 transition-colors relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 flex flex-col space-y-6 order-2 lg:order-1">
          <Link
            href="/login"
            className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs hover:shadow-md transition-all group"
          >
            <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]} group-hover:scale-105 transition-transform`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <p className={`font-bold text-xs uppercase tracking-wider ${textThemeMap[themeColor]}`}>
                {isTa ? "Project Portal" : "Project Dashboard"}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                {isTa ? "Track and view progress" : "Track & View Progress"}
              </p>
            </div>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden">
            <div className={`flex items-center px-4 py-3 text-white ${bgThemeMap[themeColor]}`}>
              <div className="flex items-center space-x-2">
                <FileText className="w-4.5 h-4.5" />
                <h3 className="font-bold text-xs uppercase tracking-wider">
                  {isTa ? "Important Links" : "IMPORTANT LINKS"}
                </h3>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700/50 flex flex-col">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between px-4 py-3 group hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-all"
                >
                  <a
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex-1"
                  >
                    {link.title}
                  </a>
                  <ChevronRight className="w-3.5 h-3.5 opacity-45" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col space-y-4 order-1 lg:order-2">
          <div className="relative w-full aspect-[16/9.8] bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
            <div className="w-full h-full relative">
              <img
                src={slides[activeSlide].imageUrl}
                alt={slides[activeSlide].title}
                className="w-full h-full object-cover opacity-90 transition-all duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white flex flex-col justify-end">
              <div className="bg-[#12498b]/90 border-l-4 border-yellow-400 px-3 py-1.5 rounded-r max-w-fit mb-2">
                <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                  {slides[activeSlide].badge}
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base leading-snug drop-shadow-md">
                {slides[activeSlide].title}
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-200 font-medium tracking-wide mt-1.5 line-clamp-2 leading-relaxed opacity-90">
                {slides[activeSlide].description}
              </p>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 z-10">
              <button
                onClick={handlePrev}
                className="bg-black/60 hover:bg-black/80 text-white p-1 rounded-full border border-white/20 transition-all cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="bg-black/60 hover:bg-black/80 text-white p-1 rounded-full border border-white/20 transition-all cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute top-4 right-4 flex space-x-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeSlide === idx ? "bg-yellow-400 w-4" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col space-y-6 order-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs p-4 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-white">
                  {isTa ? "News & Notifications" : "News & Notifications"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {isTa ? "Batches, projects & schedules" : "Batches, projects & schedules"}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden">
            <div className={`flex items-center px-4 py-3 text-white ${bgThemeMap[themeColor]}`}>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4.5 h-4.5" />
                <h3 className="font-bold text-xs uppercase tracking-wider">
                  {isTa ? "Whats New" : "WHATS NEW"}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
              {newsItems.map((news) => (
                <div key={news.id} className="flex items-start space-x-3 group border-b border-gray-100 dark:border-gray-700/50 pb-3 last:border-b-0 last:pb-0 relative">
                  <div className={`flex flex-col items-center justify-center w-12 py-1 rounded text-white font-bold leading-none ${bgThemeMap[themeColor]}`}>
                    <span className="text-[8px] uppercase tracking-wider opacity-85">{news.month}</span>
                    <span className="text-sm font-extrabold mt-0.5">{news.day}</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <Link
                      href={news.href}
                      className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 leading-snug group-hover:underline transition-colors block"
                    >
                      {news.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-gray-700/30 px-4 py-2 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
              <Link
                href="/browse"
                className={`text-[10px] font-bold uppercase tracking-wider hover:underline flex items-center space-x-1 ${textThemeMap[themeColor]}`}
              >
                <span>{isTa ? "View All" : "View All"}</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
