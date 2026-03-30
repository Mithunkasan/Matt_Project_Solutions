"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function MissionVisionSection() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-gray-900 overflow-hidden transition-colors">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Our Mission & Vision</h2>
                        <div className="space-y-6">
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                                <h3 className="text-xl font-bold text-[#12498b] dark:text-blue-400 mb-2">Our Mission</h3>
                                <p className="text-gray-600 dark:text-gray-300">To empower students by providing high-quality academic projects that enhance technical skills, boost confidence, and support academic success.</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                                <h3 className="text-xl font-bold text-[#b12222] dark:text-red-400 mb-2">Our Vision</h3>
                                <p className="text-gray-600 dark:text-gray-300">To become a leading student project solution provider, recognized for innovation, quality, and student satisfaction.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#12498b] to-[#b12222] rounded-2xl blur opacity-20 transition duration-1000 group-hover:duration-200"></div>
                            <Image
                                src="/image1.jpeg"
                                alt="Team working together"
                                width={1200}
                                height={800}
                                className="relative rounded-xl shadow-lg w-full h-auto"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
