"use client";

import React, { useState } from "react";
import { UtilityHeader } from "@/components/landing/tnpsc/UtilityHeader";
import { IdentityHeader } from "@/components/landing/tnpsc/IdentityHeader";
import { AnnouncementBar } from "@/components/landing/tnpsc/AnnouncementBar";
import { NavigationMenu } from "@/components/landing/tnpsc/NavigationMenu";
import { RedesignedFooter } from "@/components/landing/tnpsc/RedesignedFooter";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
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

  const bgThemeMap = {
    blue: "bg-[#12498b]",
    red: "bg-[#b12222]",
    green: "bg-[#1e6b3c]",
    black: "bg-black",
    grey: "bg-slate-700",
  };

  // Inquiry form states
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", msg: "" });
    setTimeout(() => setSubmitted(false), 5000);
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
            {isTa ? "தொடர்பு கொள்ள" : "Contact Our Team"}
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {isTa 
              ? "வகுப்புகள், திட்ட வழிகாட்டுதல் அல்லது இன்டர்ன்ஷிப் பற்றிய உங்கள் கேள்விகளுக்கு எங்களைத் தொடர்பு கொள்ளவும்."
              : "Have questions about projects, pricing, or training schedules? Reach out to us directly."}
          </p>
        </section>

        {/* Contact Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-wider">{isTa ? "முகவரி விவரங்கள்" : "Office Address"}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-bold text-gray-800 dark:text-gray-200">Matt Engineering Solutions</p>
                    <p className="mt-1">12/4A High Road, near Court Junction,</p>
                    <p>Nagercoil, Kanyakumari District,</p>
                    <p>Tamil Nadu - 629001</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">+91 94423 XXXXX</span>
                </div>

                <div className="flex items-center space-x-3.5">
                  <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">info@mattprojects.com</span>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{isTa ? "பணி நேரம்" : "Office Timings"}</p>
                    <p className="mt-1">Mon - Sat: 9:00 AM - 6:30 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-wider">{isTa ? "செய்தி அனுப்பவும்" : "Send Us A Message"}</h3>
              
              {submitted && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 text-emerald-700 dark:text-emerald-400 p-3 rounded text-xs font-semibold">
                  {isTa ? "விசாரணை செய்தி வெற்றிகரமாக அனுப்பப்பட்டது! விரைவில் தொடர்புகொள்வோம்." : "Inquiry message received successfully! Our counselor will reach out shortly."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="e.g. Anand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="e.g. anand@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Inquiry Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.msg}
                    onChange={(e) => setForm({ ...form, msg: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
                    placeholder="e.g. I want to inquire about IoT final year batch timing..."
                  />
                </div>
                <button
                  type="submit"
                  className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-white font-bold text-xs uppercase tracking-wider ${bgThemeMap[themeColor]} shadow-md hover:scale-101 transition-all cursor-pointer`}
                >
                  <span>{isTa ? "அனுப்பு" : "Send Inquiry"}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <RedesignedFooter language={language} themeColor={themeColor} />
    </div>
  );
}
