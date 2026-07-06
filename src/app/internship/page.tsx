"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtilityHeader } from "@/components/landing/tnpsc/UtilityHeader";
import { IdentityHeader } from "@/components/landing/tnpsc/IdentityHeader";
import { AnnouncementBar } from "@/components/landing/tnpsc/AnnouncementBar";
import { NavigationMenu } from "@/components/landing/tnpsc/NavigationMenu";
import { RedesignedFooter } from "@/components/landing/tnpsc/RedesignedFooter";
import { 
  ArrowRight, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Briefcase,
  Sparkles,
  Users,
  Award,
  BookOpen,
  FileText
} from "lucide-react";

export default function InternshipPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [themeColor, setThemeColor] = useState<"blue" | "red" | "green" | "black" | "grey">("blue");

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const bgThemeMap = {
    blue: "bg-[#12498b] hover:bg-[#0f3d75]",
    red: "bg-[#b12222] hover:bg-[#961c1c]",
    green: "bg-[#1e6b3c] hover:bg-[#185530]",
    black: "bg-black hover:bg-neutral-900",
    grey: "bg-slate-700 hover:bg-slate-800",
  };

  const accentBgThemeMap = {
    blue: "bg-[#e6effc] text-[#12498b]",
    red: "bg-[#fdebeb] text-[#b12222]",
    green: "bg-[#eaf7ee] text-[#1e6b3c]",
    black: "bg-neutral-800 text-yellow-400",
    grey: "bg-slate-100 text-slate-700",
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How long is the internship?",
      answer: "The internship duration depends on the selected program and typically ranges from 1 to 6 months."
    },
    {
      question: "Is the internship online or offline?",
      answer: "Both online and offline modes may be available depending on the selected batch."
    },
    {
      question: "Will I receive a certificate?",
      answer: "Yes. A certificate is awarded upon successful completion of the internship."
    },
    {
      question: "Will I work on real projects?",
      answer: "Yes. Interns gain experience by working on real-time industry projects under mentor supervision."
    },
    {
      question: "Do you provide placement support?",
      answer: "Yes. Eligible candidates receive career guidance, resume support, and interview preparation."
    }
  ];

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
        <section className="text-center space-y-6 max-w-4xl mx-auto py-6">
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${textThemeMap[themeColor]} leading-tight`}>
            Launch Your Career with Our Industry-Focused Internship Program
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Gain practical experience by working on real-time projects under the guidance of experienced mentors. Build your technical skills, strengthen your resume, and prepare for a successful career in the IT industry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/internship-register"
              className={`px-8 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider ${bgThemeMap[themeColor]} shadow-md transition-all flex items-center space-x-2`}
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#benefits"
              className={`px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider ${accentBgThemeMap[themeColor]} border border-transparent hover:border-current transition-all`}
            >
              View Benefits
            </a>
          </div>
        </section>

        {/* About the Internship */}
        <section className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs max-w-4xl mx-auto text-center space-y-4">
          <div className={`p-3 rounded-full ${accentBgThemeMap[themeColor]} w-fit mx-auto`}>
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            About the Internship
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed text-justify sm:text-center">
            At <strong>Matt Project Solutions</strong>, we believe that practical learning is the key to professional success. Our internship program is designed for students and fresh graduates who want to bridge the gap between academic knowledge and industry requirements.
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed text-justify sm:text-center">
            Participants work on live projects, collaborate with experienced developers, and gain hands-on exposure to modern technologies and development practices.
          </p>
        </section>

        {/* Why Choose Our Internship & Internship Highlights */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Why Choose Our Internship? */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Why Choose Our Internship?
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Industry-oriented practical training",
                "Real-time project development experience",
                "Expert mentorship and guidance",
                "Daily coding practice and assignments",
                "Project-based learning approach",
                "Flexible learning schedule",
                "Internship completion certificate",
                "Career guidance and interview preparation",
                "Resume building assistance",
                "Placement support"
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

          {/* Internship Highlights */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Internship Highlights
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Live Project Experience",
                "One-to-One Mentor Support",
                "Weekly Performance Reviews",
                "Practical Assignments",
                "Git & GitHub Workflow",
                "API Development",
                "Database Design",
                "Deployment Guidance",
                "Team Collaboration",
                "Agile Development Process"
              ].map((highlight, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className={`p-0.5 rounded-full ${accentBgThemeMap[themeColor]} mt-1 flex-shrink-0`}>
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Technologies We Offer */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider ${textThemeMap[themeColor]}`}>
              Technologies We Offer
            </h3>
            <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Full Stack Development */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4">
              <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider border-b pb-2 text-gray-900 dark:text-white">
                Full Stack Development
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", "Express.js"].map((tech, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend Development */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4">
              <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider border-b pb-2 text-gray-900 dark:text-white">
                Backend Development
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {["Python", "Django", "Django REST Framework", "Java"].map((tech, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Database */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4">
              <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider border-b pb-2 text-gray-900 dark:text-white">
                Database
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {["PostgreSQL", "MySQL", "MongoDB", "Prisma ORM"].map((tech, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emerging Technologies */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4">
              <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider border-b pb-2 text-gray-900 dark:text-white">
                Emerging Technologies
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {[
                  "Blockchain Development",
                  "Solidity",
                  "Ethereum",
                  "Smart Contracts",
                  "Web3.js",
                  "IoT Integration",
                  "Artificial Intelligence Basics"
                ].map((tech, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Who Can Apply & Required Documents */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Who Can Apply? */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Who Can Apply?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              Our internship program is suitable for:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {["Diploma Students", "Undergraduate Students", "Postgraduate Students", "Final Year Students", "Recent Graduates", "Job Seekers", "Career Switchers"].map((group, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{group}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 italic pt-2 border-t">
              No prior industry experience is required. Basic programming knowledge is recommended.
            </p>
          </div>

          {/* Required Documents */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Required Documents
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              Applicants should keep the following ready:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {["College ID Card", "Passport Size Photograph", "Resume (Optional)", "Government ID Proof (if required)"].map((doc, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${accentBgThemeMap[themeColor]}`}>
                    {i + 1}
                  </span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Internship Process */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider ${textThemeMap[themeColor]}`}>
              Internship Process
            </h3>
            <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-8 max-w-4xl mx-auto pl-6 sm:pl-8">
            {[
              "Register through the Internship Application Form.",
              "Our team reviews your application.",
              "Receive confirmation and onboarding details.",
              "Attend the orientation session.",
              "Begin learning through structured training and live projects.",
              "Complete assessments and project evaluations.",
              "Receive your Internship Completion Certificate."
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {/* Step Circle */}
                <span className={`absolute -left-[39px] sm:-left-[47px] top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold text-white ${bgThemeMap[themeColor]} shadow-md`}>
                  {idx + 1}
                </span>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-2xs">
                  <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-gray-800 dark:text-white mb-1">
                    Step {idx + 1}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What You'll Learn & Benefits */}
        <section id="benefits" className="grid grid-cols-1 lg:grid-cols-2 gap-12 scroll-mt-20">
          {/* What You'll Learn */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                What You&apos;ll Learn
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {[
                "Professional Software Development",
                "Frontend Development",
                "Backend Development",
                "Database Management",
                "REST API Development",
                "Authentication & Authorization",
                "Version Control using Git",
                "Responsive Web Design",
                "Debugging Techniques",
                "Project Deployment",
                "Team Collaboration",
                "Software Development Life Cycle (SDLC)"
              ].map((skill, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className={`p-0.5 rounded-full ${accentBgThemeMap[themeColor]} mt-1 flex-shrink-0`}>
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${accentBgThemeMap[themeColor]}`}>
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Benefits
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {[
                "Practical Industry Exposure",
                "Real Project Portfolio",
                "Improved Coding Skills",
                "Better Problem-Solving Ability",
                "Professional Networking",
                "Internship Certificate",
                "Experience Letter (Based on Eligibility)",
                "Placement Assistance",
                "Interview Preparation Sessions"
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className={`p-0.5 rounded-full ${accentBgThemeMap[themeColor]} mt-1 flex-shrink-0`}>
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider ${textThemeMap[themeColor]}`}>
              Frequently Asked Questions
            </h3>
            <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-all"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 border-t border-gray-100 dark:border-gray-700/50">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action Card */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#12498b] to-[#12498b]/90 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide">
                Ready to Build Your Future?
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed">
                Take the first step toward your professional career by joining our internship program. Learn from industry experts, work on live projects, and gain the confidence to excel in today&apos;s competitive job market.
              </p>
              <div className="pt-4">
                <Link
                  href="/internship-register"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md transition-all hover:scale-103"
                >
                  <span>Apply for Internship</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <RedesignedFooter language={language} themeColor={themeColor} />
    </div>
  );
}
