"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export function FinalCTASection() {
    return (
        <section className="py-24 bg-[#12498b] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#12498b] to-[#0d3566] opacity-50"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#b12222]/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Let’s Build Your Project Today</h2>
                <p className="text-xl text-blue-50 mb-12 max-w-2xl mx-auto opacity-90">
                    Have a project idea or need expert guidance? Matt Project Solutions is here to help you succeed with confidence!
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="tel:+919778754400"
                        className="group flex items-center gap-3 bg-white text-[#12498b] px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl hover:scale-105 active:scale-95"
                    >
                        <Phone className="w-6 h-6" />
                        Contact Us Now
                    </Link>
                    <Link
                        href="/register"
                        className="flex items-center gap-2 bg-[#b12222] text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all border border-[#b12222]/30 hover:bg-[#8a1a1a] shadow-2xl"
                    >
                        Register as Student
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
