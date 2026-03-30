"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="bg-slate-950 pt-24 pb-12 text-slate-400">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl relative overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="Matt Project Solutions Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Matt ProjectSolutions</span>
                        </div>
                        <p className="leading-relaxed">
                            Empowering students since 2014 with high-quality academic project solutions and expert guidance across all technical domains.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="hover:text-[#12498b] transition-colors">Home</Link></li>
                            <li><Link href="#services" className="hover:text-[#12498b] transition-colors">Services</Link></li>
                            <li><Link href="/login" className="hover:text-[#12498b] transition-colors">Student Login</Link></li>
                            <li><Link href="/register" className="hover:text-[#12498b] transition-colors">Register</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[#b12222] mt-1" />
                                <div>
                                    <span className="block text-white font-semibold">Call Us</span>
                                    <a href="tel:+919791658349" className="hover:text-[#12498b] transition-colors">+91 97916 58349</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-[#b12222] mt-1" />
                                <div>
                                    <span className="block text-white font-semibold">Email Us</span>
                                    <a href="mailto:matt@mattengg.com" className="hover:text-[#12498b] transition-colors">matt@mattengg.com</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#b12222] mt-1" />
                                <div>
                                    <span className="block text-white font-semibold">Visit Us</span>
                                    <span>Nagercoil, Tamil Nadu</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8">Student Tracking</h4>
                        <p className="mb-6">Already have a project with us? Log in to your personal dashboard to see real-time progress.</p>
                        <Link
                            href="/login"
                            className="inline-block bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                        >
                            Track Project Status
                        </Link>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
                    <p>© {new Date().getFullYear()} Matt Project Solutions. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
