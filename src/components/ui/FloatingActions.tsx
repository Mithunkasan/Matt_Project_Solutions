"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";

export function FloatingActions() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const whatsappNumber = "919791658349"; // Based on the footer phone number
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={scrollToTop}
                        className="w-12 h-12 bg-[#12498b] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#0d3566] transition-colors group"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* WhatsApp Button */}
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform relative group"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-8 h-8 fill-current" />
                <span className="absolute right-full mr-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with us
                </span>
                {/* Pulse effect */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
            </motion.a>
        </div>
    );
}
