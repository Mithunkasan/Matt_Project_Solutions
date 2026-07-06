"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";

export default function ForgotStudentIdPage() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [retrievedId, setRetrievedId] = useState<string>("");
  const [retrievedName, setRetrievedName] = useState<string>("");
  const [devOtp, setDevOtp] = useState<string>("");
  const router = useRouter();

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email address is required");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, purpose: "forgot-id" }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Verification code has been sent!");
        setOtpSent(true);
        if (data.otp) {
          setDevOtp(data.otp);
        }
      } else {
        setError(data.error || "Failed to send verification code. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpVerified(true);
        setRetrievedId(data.studentId);
        setRetrievedName(data.name);
        setSuccess("OTP Verified successfully!");
      } else {
        setError(data.error || "Incorrect or expired verification code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleResetForm = () => {
    setEmail("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setRetrievedId("");
    setRetrievedName("");
    setDevOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-8 sm:py-12 transition-colors relative">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md z-50"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-800 transition-colors">
        <div className="px-6 sm:px-8 py-10 sm:py-12">
          <div className="w-full max-w-sm mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md bg-[#12498b] dark:bg-slate-800 transition-colors">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {otpVerified
                  ? "Student ID Retrieved"
                  : otpSent
                  ? "Enter Verification Code"
                  : "Forgot Student ID"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                {otpVerified
                  ? `Hello ${retrievedName}, here is your registered login ID:`
                  : otpSent
                  ? `We've sent a 6-digit OTP to ${email}`
                  : "Enter your registered email address to retrieve your Student ID"}
              </p>
            </div>

            {/* Dev Helper Warning for Sandbox / Dev Mode */}
            {devOtp && (
              <div className="mb-4 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-400 px-4 py-2.5 rounded text-xs">
                <p className="font-semibold">Development Helper:</p>
                <p>OTP is: <strong className="font-mono">{devOtp}</strong></p>
              </div>
            )}

            {/* Success Box */}
            {success && (
              <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 px-4 py-3 rounded text-xs transition-colors">
                <p className="font-bold">Success!</p>
                <p className="opacity-95 mt-0.5">{success}</p>
              </div>
            )}

            {/* Error Box */}
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded text-xs transition-colors">
                <p className="font-bold">Error</p>
                <p className="opacity-95 mt-0.5">{error}</p>
              </div>
            )}

            {/* Forms Section */}
            {otpVerified ? (
              /* Success View - Show retrieved Student ID */
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 p-4 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
                    Your Student ID
                  </span>
                  <span className="text-base sm:text-lg font-bold text-[#12498b] dark:text-blue-400 select-all font-mono">
                    {retrievedId}
                  </span>
                </div>
                <button
                  onClick={handleBackToLogin}
                  className="w-full py-2.5 px-4 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-[#12498b] hover:bg-[#18559e] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Proceed to Login
                </button>
              </div>
            ) : otpSent ? (
              /* Step 2: Verify OTP Form */
              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <div>
                  <label htmlFor="otp" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Verification Code (OTP)
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono tracking-widest text-center text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-[#12498b] hover:bg-[#18559e] shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </form>
            ) : (
              /* Step 1: Send OTP Form */
              <form className="space-y-4" onSubmit={handleSendOtp}>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-[#12498b] hover:bg-[#18559e] shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer pt-2"
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            )}

            {/* Back Link */}
            {!otpVerified && (
              <div className="text-center mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
