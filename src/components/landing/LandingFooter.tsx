"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

export function LandingFooter() {
    return (
        <footer id="contact" className="bg-slate-950 pt-24 pb-12 text-slate-400">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl relative overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="Matt Project Solutions Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight leading-none">Matt Project<br/>Solutions</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Empowering students since 2014 with high-quality academic project solutions and expert guidance across all technical domains.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                             <Link href="#" className="w-9 h-9 rounded-full border border-slate-800 flex items-center justify-center hover:bg-[#12498b] hover:border-transparent hover:text-white transition-all">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-9 h-9 rounded-full border border-slate-800 flex items-center justify-center hover:bg-[#12498b] hover:border-transparent hover:text-white transition-all">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-9 h-9 rounded-full border border-slate-800 flex items-center justify-center hover:bg-[#12498b] hover:border-transparent hover:text-white transition-all">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-9 h-9 rounded-full border border-slate-800 flex items-center justify-center hover:bg-[#12498b] hover:border-transparent hover:text-white transition-all">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8">Quick Links</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/#home" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/#services" className="hover:text-white transition-colors">Our Services</Link></li>
                            <li><Link href="/#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8">Get in Touch</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[#b12222] mt-1" />
                                <div>
                                    <span className="block text-white font-semibold">Call Us</span>
                                    <a href="tel:+919486178103" className="hover:text-white transition-colors">+91 94861 78103</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-[#b12222] mt-1" />
                                <div>
                                    <span className="block text-white font-semibold">Email Us</span>
                                    <a href="mailto:info@mattengineeringsolutions.com" className="hover:text-white transition-colors break-all">info@mattengineeringsolutions.com</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8">Project Tracking</h4>
                        <p className="text-sm mb-6 leading-relaxed text-slate-400">Already a student? Log in to track your project progress, view schedules, and download reports.</p>
                        <Link
                            href="/login"
                            className="inline-block bg-[#12498b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Student Dashboard
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
