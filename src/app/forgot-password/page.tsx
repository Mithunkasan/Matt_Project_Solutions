"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound, Lock, Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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
        body: JSON.stringify({ email, purpose: "forgot-password" }),
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

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("New password is required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpVerified(true);
        setSuccess(data.message || "Password has been reset successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Verification failed. Check the OTP or try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setOtpSent(false);
    setOtpVerified(false);
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
                  ? "Password Reset"
                  : otpSent
                  ? "Reset Your Password"
                  : "Forgot Password"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                {otpVerified
                  ? "Your password has been successfully reset! Redirecting to login..."
                  : otpSent
                  ? `Enter the OTP sent to ${email} and choose your new password`
                  : "Enter your registered email address to receive a password reset OTP"}
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
              /* Success View - Loader to Login */
              <div className="flex flex-col items-center py-4">
                <div className="w-12 h-12 rounded-full border-4 border-t-[#12498b] border-gray-200 animate-spin mb-4" />
                <p className="text-xs text-gray-500">Routing you back to portal login...</p>
              </div>
            ) : otpSent ? (
              /* Step 2: Reset Password Form (Enter OTP + New Passwords) */
              <form className="space-y-4" onSubmit={handleResetPassword}>
                {/* OTP Input */}
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
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono tracking-widest text-center text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-[#12498b] hover:bg-[#18559e] shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
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