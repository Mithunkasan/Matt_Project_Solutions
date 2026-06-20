"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact-form" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or need technical guidance? Reach out to our experts and start your engineering journey today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
          {/* Left Side: Map */}
          <div className="w-full h-[400px] lg:h-auto min-h-[450px] relative">
            <iframe
              src="https://maps.app.goo.gl/8LdJvoGXYkNZ81fE7"
              className="absolute inset-0 w-full h-full border-0 grayscale dark:invert dark:opacity-80 transition-all duration-500"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* Map Overlay info */}
            <div className="absolute top-6 left-6 p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl hidden sm:block max-w-xs">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="w-6 h-6 text-[#12498b]" />
                <div>
                  <span className="block font-bold text-gray-900 dark:text-white">Headquarters</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nagercoil, Tamil Nadu, India</span>
                </div>
              </div>
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 text-[#b12222]" />
                  <span>+91 94861 78103</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 text-[#b12222]" />
                  <span className="truncate">info@mattengineeringsolutions.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#12498b] outline-none transition-all dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#12498b] outline-none transition-all dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#12498b] outline-none transition-all dark:text-white"
                  placeholder="Inquiry about Final Year Project"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Message</label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#12498b] outline-none transition-all dark:text-white resize-none"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#12498b] hover:bg-[#b12222] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
