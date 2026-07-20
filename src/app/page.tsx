"use client";

import React, { useEffect, useState } from "react";
import { UtilityHeader } from "@/components/landing/tnpsc/UtilityHeader";
import { IdentityHeader, QRCodeWithLogo } from "@/components/landing/tnpsc/IdentityHeader";
import { AnnouncementBar } from "@/components/landing/tnpsc/AnnouncementBar";
import { NavigationMenu } from "@/components/landing/tnpsc/NavigationMenu";
import { MainGrid } from "@/components/landing/tnpsc/MainGrid";
import { CandidateCorner } from "@/components/landing/tnpsc/CandidateCorner";
import { RedesignedFooter } from "@/components/landing/tnpsc/RedesignedFooter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LandingPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [themeColor, setThemeColor] = useState<"blue" | "red" | "green" | "black" | "grey">("blue");
  const [showRegistrationQr, setShowRegistrationQr] = useState(true);
  const [registrationUrl, setRegistrationUrl] = useState("");

  useEffect(() => {
    setRegistrationUrl(`${window.location.origin}/internship-register`);
  }, []);

  // Dynamic global sizing classes
  const fontSizeClassMap = {
    small: "text-base",
    medium: "text-lg",
    large: "text-xl",
  };

  // Dynamic base container styling for contrast mode
  const containerStyleMap = {
    blue: "bg-slate-50 text-gray-900",
    red: "bg-slate-50 text-gray-900",
    green: "bg-slate-50 text-gray-900",
    black: "bg-neutral-950 text-yellow-400 dark",
    grey: "bg-slate-100 text-slate-900",
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${fontSizeClassMap[fontSize]} ${containerStyleMap[themeColor]}`}
    >
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
      <MainGrid language={language} themeColor={themeColor} />
      <CandidateCorner language={language} themeColor={themeColor} />
      <RedesignedFooter language={language} themeColor={themeColor} />
      <Dialog open={showRegistrationQr} onOpenChange={setShowRegistrationQr}>
        <DialogContent className="w-auto max-w-[calc(100%-2rem)] p-6">
          <DialogHeader className="items-center text-center">
            <DialogTitle>Register for Internship or Course</DialogTitle>
          </DialogHeader>
          {registrationUrl && (
            <a
              href="/internship-register"
              className="mx-auto block"
              aria-label="Register for Internship or Course"
            >
              <QRCodeWithLogo text={registrationUrl} logoUrl="/logo.png" size={240} />
            </a>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
