"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, Shapes } from "lucide-react";

export function StatsSection() {
    const stats = [
        { label: "Years Experience", value: "10+", icon: <Star className="w-6 h-6 text-[#12498b]" /> },
        { label: "Successful Projects", value: "5000+", icon: <CheckCircle2 className="w-6 h-6 text-[#b12222]" /> },
        { label: "Customer Satisfaction", value: "100%", icon: <Star className="w-6 h-6 text-[#12498b]" /> },
        { label: "Total Domains", value: "15+", icon: <Shapes className="w-6 h-6 text-[#b12222]" /> }
    ];

    return (
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center p-6 group"
                        >
                            <div className="mx-auto w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                {stat.icon}
                            </div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
