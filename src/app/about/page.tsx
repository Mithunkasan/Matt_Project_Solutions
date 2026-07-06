"use client";

import React, { useState } from "react";
import { UtilityHeader } from "@/components/landing/tnpsc/UtilityHeader";
import { IdentityHeader } from "@/components/landing/tnpsc/IdentityHeader";
import { AnnouncementBar } from "@/components/landing/tnpsc/AnnouncementBar";
import { NavigationMenu } from "@/components/landing/tnpsc/NavigationMenu";
import { RedesignedFooter } from "@/components/landing/tnpsc/RedesignedFooter";
import { Shield, Award, BookOpen, Briefcase, Check, Target } from "lucide-react";

export default function AboutPage() {
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

  const accentBgThemeMap = {
    blue: "bg-[#e6effc] text-[#12498b]",
    red: "bg-[#fdebeb] text-[#b12222]",
    green: "bg-[#eaf7ee] text-[#1e6b3c]",
    black: "bg-neutral-800 text-yellow-400",
    grey: "bg-slate-100 text-slate-700",
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${textThemeMap[themeColor]}`}>
            {isTa ? "எங்களைப் பற்றி" : "About Us"}
          </h2>
          <p className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-200 leading-snug">
            {isTa
              ? "புத்தாக்கம் மற்றும் கல்விச் சிறப்பின் மூலம் மாணவர்களை மேம்படுத்துதல்"
              : "Empowering Students Through Innovation and Academic Excellence"}
          </p>
          <div className="h-1.5 w-24 bg-yellow-400 mx-auto rounded-full mt-4"></div>
        </section>

        {/* Introduction Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            <p>
              <strong className={textThemeMap[themeColor]}>Matt Project Solutions</strong> is a technology-driven academic project and training platform dedicated to helping students successfully complete their academic projects with confidence. Our mission is to bridge the gap between classroom learning and real-world technology by providing high-quality project development, technical guidance, internship opportunities, and hands-on training.
            </p>
            <p>
              We specialize in developing innovative projects across multiple technologies, ensuring that every student receives practical knowledge along with professional project support. Whether it is a final-year engineering project, internship, technical workshop, or software development training, our experienced team is committed to delivering reliable and industry-relevant solutions.
            </p>
            <p>
              Our platform provides a seamless digital experience where students can register, securely access their personalized dashboard, monitor project progress, view payment details, receive class schedules, and stay updated with important announcements and learning resources. Administrators can efficiently manage projects, schedules, internship applications, and website content through a centralized management system.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Students Collaborating" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
        </section>

        {/* What We Offer & Why Choose Us */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* What We Offer */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                {isTa ? "நாங்கள் வழங்குபவை" : "What We Offer"}
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Final Year Academic Project Development",
                "IEEE Project Implementation",
                "Internship Programs",
                "Technical Training & Workshops",
                "Full Stack Web Development",
                "AI & Machine Learning Projects",
                "IoT and Embedded System Projects",
                "Blockchain Application Development",
                "Research and Documentation Support",
                "Project Maintenance and Technical Guidance"
              ].map((offer, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className={`p-0.5 rounded-full ${accentBgThemeMap[themeColor]} mt-1 flex-shrink-0`}>
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{offer}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                {isTa ? "ஏன் எங்களைத் தேர்ந்தெடுக்க வேண்டும்?" : "Why Choose Us?"}
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Experienced technical mentors and project experts",
                "Industry-standard technologies and development practices",
                "Personalized project monitoring through a secure student dashboard",
                "Real-time project status tracking and class scheduling",
                "Dedicated internship opportunities for skill development",
                "Continuous technical support throughout the project lifecycle",
                "Transparent project management and communication",
                "Student-focused learning with practical implementation"
              ].map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className={`p-0.5 rounded-full ${accentBgThemeMap[themeColor]} mt-1 flex-shrink-0`}>
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Vision, Mission, Commitment */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vision */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
                {isTa ? "எங்கள் பார்வை" : "Our Vision"}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 text-justify">
              To become one of the most trusted academic technology partners by empowering students with innovative learning experiences, practical technical skills, and high-quality project solutions that prepare them for successful careers in the technology industry.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
                {isTa ? "எங்கள் நோக்கம்" : "Our Mission"}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 text-justify">
              Our mission is to provide affordable, reliable, and innovative project development services while fostering practical learning through internships, technical training, and mentorship. We strive to help students transform their academic ideas into successful real-world solutions using modern technologies.
            </p>
          </div>

          {/* Commitment */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
                {isTa ? "எங்கள் அர்ப்பணிப்பு" : "Our Commitment"}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 text-justify">
              At Matt Project Solutions, we believe that every student deserves the opportunity to learn through practical experience. We are committed to delivering quality education, innovative project solutions, and continuous technical support that enables students to achieve academic excellence and professional growth.
            </p>
          </div>
        </section>
      </main>

      <RedesignedFooter language={language} themeColor={themeColor} />
    </div>
  );
}
