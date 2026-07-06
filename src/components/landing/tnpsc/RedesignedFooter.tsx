"use client";

import React, { useState, useEffect } from "react";

interface RedesignedFooterProps {
  language: "en" | "ta";
  themeColor: "blue" | "red" | "green" | "black" | "grey";
}

export function RedesignedFooter({ language, themeColor }: RedesignedFooterProps) {
  const isTa = language === "ta";
  const [visitorCount, setVisitorCount] = useState(48660128);

  // Increment visitor counter randomly for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const bgThemeMap = {
    blue: "bg-[#0c3464] border-[#12498b]/20",
    red: "bg-[#801717] border-[#b12222]/20",
    green: "bg-[#144728] border-[#1e6b3c]/20",
    black: "bg-neutral-950 border-neutral-800",
    grey: "bg-slate-800 border-slate-700/20",
  };

  const bottomBgThemeMap = {
    blue: "bg-[#09264a]",
    red: "bg-[#611111]",
    green: "bg-[#0e331c]",
    black: "bg-black",
    grey: "bg-slate-900",
  };

  return (
    <footer className="w-full text-white/90 select-none">
      {/* Main Footer Banner */}
      <div className={`py-8 px-4 border-t transition-colors ${bgThemeMap[themeColor]}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
          
          {/* Left: Parent Company Website Link */}
          <a
            href="https://mattengineeringsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/15 border border-white/20 rounded px-4 py-2.5 flex items-center space-x-3 transition-colors flex-shrink-0"
          >
            {/* Brand Colors Strip */}
            <div className="flex flex-col w-1.5 h-8">
              <div className="bg-[#12498b] h-1/2 w-full" />
              <div className="bg-[#b12222] h-1/2 w-full" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold tracking-wider leading-none">mattengineeringsolutions.com</p>
              <p className="text-[8px] text-white/60 uppercase tracking-tighter leading-none mt-1">
                Our Parent Engineering Portal
              </p>
            </div>
          </a>

          {/* Center: Matt Project Solutions Info & visitor logs */}
          <div className="flex-1 max-w-2xl text-xs space-y-2">
            <p className="font-bold tracking-wide">
              {isTa
                ? "© மேட் ப்ராஜெக்ட் சொல்யூஷன்ஸ், சென்னை, தமிழ்நாடு-600003."
                : "© Matt Project Solutions, 3rd Floor, Pillars Gate, Vadasery, Nagercoil - 629001."}
            </p>
            <p className="text-white/70 font-semibold tracking-wide">
              {isTa ? "மின்னஞ்சல்: " : "Email: "}
              <span className="font-mono">info@mattengineeringsolutions.com</span>
            </p>
            {/* <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1 text-white/60 text-[11px] font-medium pt-1">
              <span>Version: 23.03/1</span>
              <span>•</span>
              <span>
                {isTa ? "கடைசியாக புதுப்பிக்கப்பட்டது: " : "Last Updated: "} 02-07-2026
              </span>
              <span>•</span>
              <span>
                {isTa ? "பார்வையாளர் எண்: " : "Visitor No.: "}{" "}
                <span className="font-bold text-white font-mono">{visitorCount.toLocaleString("en-US")}</span>
              </span>
            </div> */}
          </div>

          {/* Center-Right: Contact Support Phone */}
          <div className="flex-shrink-0 text-center lg:text-right border-y lg:border-y-0 lg:border-x border-white/10 py-4 lg:py-0 lg:px-8">
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">
              {isTa ? "தொடர்பு எண்" : "Support Help Desk"}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold tracking-wide mt-1 text-yellow-300 font-mono">
              +91 97916 58349
            </p>
          </div>

          {/* Right: Brand Logos & Estd Badge */}
          <div className="flex items-center space-x-4 flex-shrink-0 justify-center">
            {/* Matt Logo Emblem */}
            <div className="w-12 h-12 bg-white/5 rounded-full p-1.5 border border-white/10">
              <img
                src="/logo.png"
                alt="Matt Project Solutions"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Established year Text Badge */}
            <div className="border border-white/20 bg-white/10 rounded px-2.5 py-1 text-center max-w-[100px] leading-tight">
              <p className="text-[10px] font-extrabold tracking-tighter uppercase text-yellow-300">ESTD</p>
              <p className="text-[7px] font-bold tracking-tighter uppercase leading-none mt-0.5">
                2014
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Links Bar */}
      <div className={`py-4 px-4 text-center text-xs text-white/60 font-semibold tracking-wide transition-colors ${bottomBgThemeMap[themeColor]}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { label: isTa ? "பின்னூட்டம்" : "Feedback", href: "#" },
            { label: isTa ? "இணையக் கொள்கை" : "Web Policy", href: "#" },
            { label: isTa ? "பொறுப்புத் துறப்பு" : "Disclaimer", href: "#" },
            { label: isTa ? "எங்களைத் தொடர்பு கொள்ள" : "Contact Us", href: "#" },
          ].map((link, idx) => (
            <a key={idx} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
