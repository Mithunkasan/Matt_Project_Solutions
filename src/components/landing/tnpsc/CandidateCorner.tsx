"use client";

import React from "react";
import Link from "next/link";
import { User, UserPlus, LogIn, HelpCircle, Lock } from "lucide-react";

interface CandidateCornerProps {
  language: "en" | "ta";
  themeColor: "blue" | "red" | "green" | "black" | "grey";
}

export function CandidateCorner({ language, themeColor }: CandidateCornerProps) {
  const isTa = language === "ta";

  // Dynamic background themes
  const bgThemeMap = {
    blue: "bg-[#12498b]",
    red: "bg-[#b12222]",
    green: "bg-[#1e6b3c]",
    black: "bg-black",
    grey: "bg-slate-700",
  };

  const textThemeMap = {
    blue: "text-[#12498b] hover:bg-[#e6effc]",
    red: "text-[#b12222] hover:bg-[#fdebeb]",
    green: "text-[#1e6b3c] hover:bg-[#eaf7ee]",
    black: "text-black hover:bg-neutral-200",
    grey: "text-slate-700 hover:bg-slate-100",
  };

  // Button config
  const buttons = [
    {
      label: isTa ? "புதிய மாணவர் பதிவு" : "New Student Registration",
      href: "/register",
      icon: <UserPlus className="w-4 h-4 flex-shrink-0" />,
    },
    {
      label: isTa ? "மாணவர் உள்நுழைவு" : "Student Login",
      href: "/login",
      icon: <LogIn className="w-4 h-4 flex-shrink-0" />,
    },
    {
      label: isTa ? "மாணவர் ஐடி மறந்துவிட்டதா" : "Forgot Student ID",
      href: "/forgot-student-id",
      icon: <HelpCircle className="w-4 h-4 flex-shrink-0" />,
    },
    {
      label: isTa ? "கடவுச்சொல் மறந்துவிட்டதா" : "Forgot Password",
      href: "/forgot-password",
      icon: <Lock className="w-4 h-4 flex-shrink-0" />,
    },
  ];

  return (
    <div className={`w-full py-4 px-4 text-white shadow-inner transition-colors ${bgThemeMap[themeColor]}`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side Section Header */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="bg-white/15 p-2 rounded-full border border-white/20">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base tracking-wider uppercase leading-none">
              {isTa ? "மாணவர் பகுதி" : "STUDENT CORNER"}
            </h3>
            <p className="text-[10px] text-white/70 font-medium mt-0.5">
              {isTa ? "இணைப்புகள் மற்றும் சேவைகள்" : "Quick access to student portals & services"}
            </p>
          </div>
        </div>

        {/* Buttons List */}
        <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-center gap-3">
          {buttons.map((btn, idx) => (
            <Link
              key={idx}
              href={btn.href}
              className={`flex items-center justify-center space-x-2 bg-white px-4 py-2.5 rounded shadow-sm text-xs font-bold transition-all text-center ${textThemeMap[themeColor]}`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
