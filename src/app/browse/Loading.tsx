"use client";

import Image from "next/image";

export function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center transition-colors">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>

        {/* Company Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Smaller version for inline loading
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const logoSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} border-4 border-red-200 dark:border-red-900/30 border-t-[#b12222] dark:border-t-red-500 rounded-full animate-spin`}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden p-1 shadow-sm">
          <Image
            src="/logo.png"
            alt="Logo"
            width={logoSizes[size]}
            height={logoSizes[size]}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
