// src/components/landing/tnpsc/AnnouncementBar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";

interface OfferItem {
  id: string;
  text: string;
  link: string;
}

interface AnnouncementBarProps {
  language: "en" | "ta";
  themeColor: "blue" | "red" | "green" | "black" | "grey";
}

export function AnnouncementBar({ language, themeColor }: AnnouncementBarProps) {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const isTa = language === "ta";

  // Dynamic branding color mapping
  const bgThemeMap = {
    blue: "bg-blue-50 dark:bg-slate-900/80 border-y border-blue-100 dark:border-slate-800 text-blue-900 dark:text-blue-100",
    red: "bg-red-50 dark:bg-slate-900/80 border-y border-red-100 dark:border-slate-800 text-red-900 dark:text-red-100",
    green: "bg-green-50 dark:bg-slate-900/80 border-y border-green-100 dark:border-slate-800 text-green-900 dark:text-green-100",
    black: "bg-neutral-900 border-y border-neutral-800 text-yellow-400",
    grey: "bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200",
  };

  const badgeBgThemeMap = {
    blue: "bg-[#12498b] text-white",
    red: "bg-[#b12222] text-white",
    green: "bg-[#1e6b3c] text-white",
    black: "bg-yellow-400 text-black font-extrabold",
    grey: "bg-slate-700 text-white",
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/landing/offers");
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch (err) {
      console.error("Failed to fetch offers for marquee:", err);
    }
  };

  useEffect(() => {
    fetchOffers();

    // Poll every 30 seconds to automatically update the landing page marquee
    const interval = setInterval(fetchOffers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (offers.length === 0) return null;

  // Duplicate items list to ensure seamless marquee looping
  // If the list is short, duplicate it multiple times to span across the screen width.
  const displayOffers = [];
  const repeatCount = Math.max(2, Math.ceil(6 / offers.length));
  for (let i = 0; i < repeatCount; i++) {
    displayOffers.push(...offers);
  }

  return (
    <div className={`relative w-full overflow-hidden flex items-center h-11 shadow-sm transition-all duration-300 ${bgThemeMap[themeColor]}`}>
      {/* CSS Keyframes Injection */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-scroll {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ticker Badge / Label */}
      <div className={`relative z-10 flex items-center gap-1.5 px-4 h-full text-xs font-bold uppercase tracking-wider shadow-md select-none shrink-0 ${badgeBgThemeMap[themeColor]}`}>
        <Megaphone className="w-3.5 h-3.5 animate-bounce" />
        <span className="whitespace-nowrap">
          {isTa ? "அறிவிப்புகள்" : "LATEST OFFERS"}
        </span>
      </div>

      {/* Ticker Gradient Overlay for Fade-In effect */}
      <div className="absolute top-0 bottom-0 left-[110px] md:left-[130px] w-8 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none"></div>

      {/* Marquee Area */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="animate-marquee-scroll">
          {displayOffers.map((offer, idx) => {
            const content = (
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wide px-6 whitespace-nowrap">
                <span>{offer.text}</span>
                <span className="text-[#b12222] dark:text-red-400 mx-2 select-none font-bold">★</span>
              </span>
            );

            return offer.link ? (
              <Link
                key={`${offer.id}-${idx}`}
                href={offer.link}
                className="hover:underline hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center"
              >
                {content}
              </Link>
            ) : (
              <div key={`${offer.id}-${idx}`} className="flex items-center">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
