"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, GraduationCap, Calendar, Mail, Phone, CheckCircle, Building2 } from "lucide-react";

export default function InternshipRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    collegeName: "",
    department: "",
    yearOfStudy: "1st Year",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.fullName || !formData.collegeName || !formData.yearOfStudy || !formData.email || !formData.phoneNumber) {
      setError("Please fill in all the required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/internship/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to submit application. Please try again.");
      }
    } catch {
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-12 transition-colors relative">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md z-50"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-gray-800 transition-colors">
        
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-[#12498b] to-[#b12222]" />

        <div className="px-6 sm:px-10 py-10 sm:py-12">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-18 h-18 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 shadow-md mb-4 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Matt Project Solutions Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#12498b] dark:text-blue-400 uppercase tracking-wide">
              Internship Registration
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm">
              Apply for our industry-guided internship programs at Matt Project Solutions
            </p>
          </div>

          {success ? (
            /* Success View */
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-950/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Application Submitted!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Thank you for applying. We will review your application and get in touch with you shortly.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#12498b] hover:bg-[#18559e] text-white font-bold text-xs tracking-wider uppercase rounded-lg shadow-md transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Notification */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3.5 rounded text-xs">
                  <p className="font-bold">Submission Error</p>
                  <p className="opacity-90 mt-0.5">{error}</p>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* College Name */}
              <div>
                <label htmlFor="collegeName" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  College Name
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="collegeName"
                    name="collegeName"
                    type="text"
                    required
                    placeholder="Enter your college name"
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="e.g. Computer Science, Mechanical"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Year of Study */}
              <div>
                <label htmlFor="yearOfStudy" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Year of Study
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm cursor-pointer transition-colors"
                    disabled={loading}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Other">Other / Post-Grad</option>
                  </select>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    placeholder="Enter your mobile number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-[#12498b] hover:bg-[#18559e] text-white font-bold text-xs tracking-wider uppercase rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
                <Link
                  href="/"
                  className="py-3 px-5 border border-gray-300 dark:border-gray-700 rounded-lg font-bold text-gray-700 dark:text-gray-300 text-xs tracking-wider uppercase flex items-center justify-center transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
