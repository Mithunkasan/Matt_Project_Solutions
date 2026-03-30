"use client";

import { motion } from "framer-motion";
import { Globe, Cpu, Phone, Database, Zap, Shapes, Code2 } from "lucide-react";

export function DomainsSection() {
    const domains = [
        { name: "Web Development", tech: "HTML, CSS, JS, React, Next.js", icon: <Globe className="w-6 h-6" /> },
        { name: "Python & Django", tech: "Scalable backend & AI integration", icon: <Cpu className="w-6 h-6" /> },
        { name: "Java & Android", tech: "Mobile apps & Enterprise solutions", icon: <Phone className="w-6 h-6" /> },
        { name: "Blockchain", tech: "Decentralized applications", icon: <Database className="w-6 h-6" /> },
        { name: "Machine Learning & AI", tech: "Smart algorithms & Data analysis", icon: <Zap className="w-6 h-6" /> },
        { name: "IoT & Embedded", tech: "Hardware & Sensor integration", icon: <Cpu className="w-6 h-6" /> },
        { name: "Database & Full-Stack", tech: "End-to-end data applications", icon: <Database className="w-6 h-6" /> },
        { name: "Other Tech", tech: "Custom technology requirements", icon: <Shapes className="w-6 h-6" /> }
    ];

    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
                <Code2 className="w-64 h-64 text-white" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Explore Our Domains</h2>
                    <p className="text-slate-400 max-w-2xl text-lg">
                        We offer specialized projects across multiple advanced technology areas to keep students ahead of the curve.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {domains.map((domain, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-[#12498b] transition-colors group"
                        >
                            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#12498b] transition-colors">
                                {domain.icon}
                            </div>
                            <h4 className="text-lg font-bold mb-1">{domain.name}</h4>
                            <p className="text-slate-400 text-sm">{domain.tech}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
