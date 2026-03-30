"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Search } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
    session: Session | null;
}

export function HeroSection({ session }: HeroSectionProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8;
        }
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden transition-colors">
            {/* Video Background */}
            <div className="absolute inset-0 z-0 text-white">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/image1.jpeg"
                    className="w-full h-full object-cover"
                >
                    <source src="/company.mp4" type="video/mp4" />
                </video>
                {/* Advanced Overlay for Premium Look */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#12498b]/80 via-black/60 to-[#12498b]/90 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-8 border border-white/20 shadow-2xl"
                    >
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>Celebrating 10+ Years of Excellence</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-8xl font-extrabold text-white mb-6 tracking-tight leading-[1.05]"
                    >
                        Matt Project
                        <span className="text-[#b12222] drop-shadow-[0_0_15px_rgba(177,34,34,0.5)]"> Solutions</span>
                        <span className="block text-2xl md:text-3xl font-light text-blue-100 mt-6 tracking-wide uppercase opacity-90">
                            Turning Student Ideas into Reality Since 2014
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto font-light drop-shadow-md"
                    >
                        Premium project development for <span className="font-semibold text-white">Diploma, UG, and PG students</span>. 
                        Industry-grade quality tailored to university standards and future-ready technology.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                    >
                        {session ? (
                            <Link
                                href="/home"
                                className="group relative flex items-center gap-3 bg-[#b12222] text-white px-12 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(177,34,34,0.3)] hover:shadow-[0_0_40px_rgba(177,34,34,0.5)] overflow-hidden"
                            >
                                <span className="relative z-10">Track Your Progress</span>
                                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-[#b12222] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="group relative flex items-center gap-3 bg-white text-[#12498b] px-12 py-5 rounded-full font-extrabold text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
                                >
                                    <span className="relative z-10 text-[#12498b]">Get Started Now</span>
                                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                                    <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </Link>
                                <Link
                                    href="/login"
                                    className="group flex items-center gap-3 bg-white/10 backdrop-blur-lg text-white border-2 border-white/30 px-12 py-5 rounded-full font-bold text-xl transition-all hover:bg-white/20 hover:border-white/50 shadow-xl"
                                >
                                    Student Login
                                </Link>
                            </>
                        )}
                    </motion.div>

                    {/* Tracking Callout */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="p-5 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl inline-block transition-transform hover:scale-105"
                    >
                        <p className="text-base text-blue-100 font-medium flex items-center gap-3">
                            <Search className="w-5 h-5 text-blue-400 animate-pulse" />
                            <span>Are you a student? <span className="text-white underline underline-offset-4 decoration-blue-400">Log in</span> to track your project progress in real-time.</span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
