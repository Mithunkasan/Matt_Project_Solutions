"use client";

import React, { useState } from "react";
import { UtilityHeader } from "@/components/landing/tnpsc/UtilityHeader";
import { IdentityHeader } from "@/components/landing/tnpsc/IdentityHeader";
import { AnnouncementBar } from "@/components/landing/tnpsc/AnnouncementBar";
import { NavigationMenu } from "@/components/landing/tnpsc/NavigationMenu";
import { RedesignedFooter } from "@/components/landing/tnpsc/RedesignedFooter";
import { BookOpen, Layers, Terminal, Smartphone } from "lucide-react";

export default function CoursesPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [themeColor, setThemeColor] = useState<"blue" | "red" | "green" | "black" | "grey">("blue");

  const isTa = language === "ta";

  const fontSizeClassMap = {
    small: "text-base",
    medium: "text-lg",
    large: "text-xl",
  };

  const containerStyleMap = {
    blue: "bg-slate-50 text-gray-900",
    red: "bg-slate-50 text-gray-900",
    green: "bg-slate-50 text-gray-900",
    black: "bg-neutral-950 text-yellow-400 dark",
    grey: "bg-slate-100 text-slate-900",
  };

  const textThemeMap = {
    blue: "text-[#12498b]",
    red: "text-[#b12222]",
    green: "text-[#1e6b3c]",
    black: "text-black dark:text-white",
    grey: "text-slate-700 dark:text-slate-300",
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${fontSizeClassMap[fontSize]} ${containerStyleMap[themeColor]}`}>
      <UtilityHeader
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
      />
      <IdentityHeader language={language} themeColor={themeColor} />
      <AnnouncementBar language={language} themeColor={themeColor} />
      <NavigationMenu language={language} themeColor={themeColor} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <section className="text-center space-y-4">
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${textThemeMap[themeColor]}`}>
            {isTa ? "பயிற்சி வகுப்புகள்" : "Professional Training & Certifications"}
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {isTa 
              ? "மென்பொருள் துறையில் உங்கள் திறன்களை மேம்படுத்த பிரத்யேக பயிற்சி வகுப்புகள்."
              : "Boost your code writing skills with professional software development certifications engineered for students."}
          </p>
        </section>

        {/* Courses list */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-start space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 flex-shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider">{isTa ? "பைதான் முழு அடுக்கு மேம்பாடு" : "Python Full-Stack Web Dev"}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {isTa
                  ? "பைதான், ஜாங்கோ மற்றும் பின்தள தரவுத்தளங்கள் பற்றிய முழுமையான பயிற்சி வகுப்பு."
                  : "Master Python syntax, Django frameworks, SQLite/PostgreSQL connectors, and front-end Tailwind configs to design robust enterprise web apps."}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">Duration: 45 Days / 90 Hours</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-start space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider">{isTa ? "ஜாவா எண்டர்பிரைஸ் கட்டமைப்புகள்" : "Java & Spring Boot Framework"}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {isTa
                  ? "ஸ்பிரிங் பூட், மைக்ரோ சர்வீசஸ் மற்றும் ஹைபர்நேட் பற்றிய முழுமையான எண்டர்பிரைஸ் பயிற்சி."
                  : "Deep dive into Spring Boot, REST APIs, JPA Hibernate entities, microservices deployment, and mock testing architectures."}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">Duration: 60 Days / 120 Hours</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider">{isTa ? "ஆண்ட்ராய்டு செயலி உருவாக்கம்" : "Android App Development"}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {isTa
                  ? "கோட்லின் மற்றும் ஆண்ட்ராய்டு ஸ்டுடியோ மூலம் மொபைல் செயலிகளை உருவாக்குதல்."
                  : "Build responsive cross-device mobile applications using Android CLI, Gradle compiler, Kotlin scripting, and Google Firebase connectors."}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">Duration: 30 Days / 60 Hours</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-start space-x-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider">{isTa ? "இணைய வடிவமைப்பு (HTML / CSS)" : "UI/UX & Web Foundations"}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {isTa
                  ? "எச்டிஎம்எல், சிஎஸ்எஸ் மற்றும் ஜாவாஸ்கிரிப்ட் மூலம் இணையதளங்களை உருவாக்குதல்."
                  : "Beginner-friendly course covering HTML5 semantic layout styling, responsive flexbox/grid layout systems, vanilla JavaScript DOM manipulations, and animations."}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">Duration: 30 Days / 60 Hours</p>
            </div>
          </div>
        </section>
      </main>

      <RedesignedFooter language={language} themeColor={themeColor} />
    </div>
  );
}
