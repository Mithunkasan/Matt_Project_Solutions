"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface IdentityHeaderProps {
  language: "en" | "ta";
  themeColor: "blue" | "red" | "green" | "black" | "grey";
}

// Local QRCode component with Logo overlay at the center
function QRCodeWithLogo({ text, logoUrl, size = 80 }: { text: string; logoUrl: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !text) return;

    // Load qrcode dynamically only on client side to prevent server-side canvas module lookup crashes
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(
        canvasRef.current!,
        text,
        {
          width: size,
          margin: 1,
          color: {
            dark: "#0f172a", // Dark slate color
            light: "#ffffff",
          },
          errorCorrectionLevel: "H", // High error correction level (30%) allows logo overlay
        },
        (error) => {
          if (error) {
            console.error("QR Code Generation Error:", error);
            return;
          }

          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Load and draw center logo
          const img = new window.Image();
          img.src = logoUrl;
          img.onload = () => {
            const logoSize = size * 0.24; // 24% of QR code size
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;

            // Draw rounded border and background for the logo center
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            const r = 2; // border radius
            ctx.roundRect(x - 2, y - 2, logoSize + 4, logoSize + 4, r);
            ctx.fill();

            // Draw logo image
            ctx.drawImage(img, x, y, logoSize, logoSize);
          };
        }
      );
    });
  }, [text, logoUrl, size]);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-pointer border border-gray-200 dark:border-gray-800 rounded-lg p-1 bg-white hover:scale-105 transition-transform"
      width={size}
      height={size}
    />
  );
}

export function IdentityHeader({ themeColor }: IdentityHeaderProps) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrUrl(window.location.origin + "/internship-register");
    }
  }, []);

  // Dynamic colors for the notice link text
  const alertColorMap = {
    blue: "text-blue-600 hover:text-blue-800",
    red: "text-red-600 hover:text-red-800",
    green: "text-emerald-700 hover:text-emerald-900",
    black: "text-yellow-500 hover:text-yellow-400 font-bold",
    grey: "text-slate-800 hover:text-slate-900",
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-100 py-4 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center space-x-4">
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex-shrink-0">
            <img
              src="/logo.png"
              alt="MATT Project Solutions Logo"
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        {/* Center: Rebranded Title & Notice Ticker */}
        <div className="flex-1 text-center lg:px-4">
          <h1 className="text-[#12498b] dark:text-blue-400 font-extrabold text-xl sm:text-2xl md:text-3xl tracking-wide leading-none font-sans uppercase">
            MATT PROJECT SOLUTIONS
          </h1>
          <h2 className="text-[#b12222] dark:text-red-400 font-bold text-xs sm:text-sm md:text-base tracking-widest leading-none mt-2 font-sans uppercase opacity-90">
            Powered By MATT ENGINEERING SOLUTIONS
          </h2>

          {/* Alert Ticker Link */}
          <div className="mt-3 text-xs sm:text-sm font-semibold tracking-wide">
            <span className="text-gray-600 dark:text-gray-400">
              For all project-related information for the year 2026, visit the{" "}
            </span>
            <Link
              href="/login"
              className={`inline-flex items-center gap-1 transition-all underline ${alertColorMap[themeColor]}`}
            >
              <span>Project Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Right Side: QR Code + 12 Years Celebratory Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-6 flex-shrink-0">
          {/* Internship QR Code */}
          <Link
            href="/internship-register"
            className="flex flex-col items-center group text-center"
          >
            <QRCodeWithLogo
              text={qrUrl || "https://mattprojects.com/internship-register"}
              logoUrl="/logo.png"
              size={84}
            />
            <span className="text-[8px] font-bold text-gray-500 group-hover:text-blue-600 dark:text-gray-400 uppercase tracking-widest mt-1.5 transition-colors">
              Scan / Click for Internship
            </span>
          </Link>

          {/* 12 Years Celebratory Badge */}
          <div className="border-2 border-[#12498b]/20 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-2 flex items-center space-x-3 max-w-[280px]">
            {/* Badge year numbers */}
            <div className="flex flex-col items-center bg-[#12498b] text-white px-2.5 py-1 rounded font-bold text-center leading-none">
              <span className="text-[9px] uppercase tracking-wider font-normal">Celebrating</span>
              <span className="text-2xl font-extrabold my-0.5">12</span>
              <span className="text-[8px] tracking-tighter">YEARS</span>
              <span className="text-[7px] text-blue-200">2014-2026</span>
            </div>
            
            {/* Badge text */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#b12222] dark:text-red-400 uppercase tracking-tight leading-snug">
                MATT PROJECT SOLUTIONS
              </p>
              <p className="text-[8px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tighter mt-0.5 leading-none">
                OF TRUST THROUGH QUALITY & EXCELLENCE
              </p>
            </div>

            {/* Small brand logo emblem visual representation */}
            <div className="w-10 h-10 relative flex-shrink-0 opacity-80">
              <img
                src="/logo.png"
                alt="MATT Emblem"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
