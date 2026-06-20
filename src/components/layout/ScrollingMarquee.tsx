"use client";

import { motion } from "framer-motion";
import { Zap, Code2, Rocket, Brain, Database, Shield } from "lucide-react";

const TOPICS = [
  { name: "Web Development", icon: <Code2 className="w-4 h-4" /> },
  { name: "AI & Machine Learning", icon: <Brain className="w-4 h-4" /> },
  { name: "Blockchain Tech", icon: <Shield className="w-4 h-4" /> },
  { name: "Python Projects", icon: <Rocket className="w-4 h-4" /> },
  { name: "Java & Spring Boot", icon: <Database className="w-4 h-4" /> },
  { name: "IoT Solutions", icon: <Zap className="w-4 h-4" /> },
  { name: "UG / PG Projects", icon: <Rocket className="w-4 h-4" /> },
  { name: "10+ Years Excellence", icon: <Zap className="w-4 h-4" /> },
];

import { usePathname } from "next/navigation";

const AUTH_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/admin",
]);

export function ScrollingMarquee() {
  const pathname = usePathname();

  if (AUTH_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-[#12498b] text-white border-b border-white/10 z-50 overflow-hidden flex items-center">
      <motion.div
        className="flex items-center space-x-12 whitespace-nowrap px-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        {/* Triple the items to ensure seamless loop */}
        {[...TOPICS, ...TOPICS, ...TOPICS].map((topic, i) => (
          <div key={i} className="flex items-center space-x-3 group">
            <span className="text-blue-300 group-hover:scale-125 transition-transform duration-300">
              {topic.icon}
            </span>
            <span className="text-[13px] font-semibold text-white tracking-wide hover:text-blue-100 transition-colors uppercase">
              {topic.name}
            </span>
            <span className="text-white/20 mx-4">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
