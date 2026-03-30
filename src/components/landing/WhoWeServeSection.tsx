"use client";

import { motion } from "framer-motion";

export function WhoWeServeSection() {
    const audiences = [
        "Diploma Students",
        "Engineering (BE / B.Tech)",
        "Arts & Science Students",
        "MCA / MBA / MSc Students",
        "Research Scholars (PG)"
    ];

    return (
        <section className="py-24 bg-slate-50 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Who We Serve</h2>
                    <p className="text-gray-600 dark:text-gray-400">Tailored solutions for students from various educational backgrounds.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {audiences.map((audience, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm text-lg font-bold text-[#12498b] dark:text-blue-400 hover:shadow-md transition-all"
                        >
                            {audience}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
