"use client";

import React, { useEffect, useState } from "react";
import { UtilityHeader } from "@/components/landing/tnpsc/UtilityHeader";
import { IdentityHeader } from "@/components/landing/tnpsc/IdentityHeader";
import { AnnouncementBar } from "@/components/landing/tnpsc/AnnouncementBar";
import { NavigationMenu } from "@/components/landing/tnpsc/NavigationMenu";
import { RedesignedFooter } from "@/components/landing/tnpsc/RedesignedFooter";
import { Images } from "lucide-react";

interface GalleryImage {
  name: string;
  src: string;
}

export default function GalleryPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [themeColor, setThemeColor] = useState<"blue" | "red" | "green" | "black" | "grey">("blue");
  const [images, setImages] = useState<GalleryImage[]>([]);

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

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          setImages(await res.json());
        }
      } catch (error) {
        console.error("Fetch gallery error:", error);
      }
    };

    fetchGallery();
  }, []);

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

      <main className="flex-1 w-full bg-slate-50 dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 ${accentBgThemeMap[themeColor]}`}>
                <Images className="w-4 h-4" />
                Gallery
              </div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${textThemeMap[themeColor]}`}>
                Gallery
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Add images to <span className="font-mono">public/gallery</span> or name top-level files <span className="font-mono">gallery-*.jpg</span>.
            </p>
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {images.map((image) => (
                <figure
                  key={image.src}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <img
                    src={image.src}
                    alt={image.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
              <Images className={`w-10 h-10 mx-auto mb-3 ${textThemeMap[themeColor]}`} />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">No gallery images found yet.</p>
            </div>
          )}
        </section>
      </main>

      <RedesignedFooter language={language} themeColor={themeColor} />
    </div>
  );
}
