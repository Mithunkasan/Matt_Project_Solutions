"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Enhanced email validation
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
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Password reset link has been sent to your email!");
        setEmailSent(true);

        // In development mode, show the reset link directly
        if (data.resetLink) {
          setSuccess(prev => prev + " Check the console for development link.");
          console.log("Development Reset Link:", data.resetLink);
        }
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    await handleSubmit({ preventDefault: () => { } } as FormEvent<HTMLFormElement>);
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleTryDifferentEmail = () => {
    setEmail("");
    setEmailSent(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-8 sm:py-12 transition-colors">
      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-800 transition-colors">
        <div className="px-6 sm:px-8 py-12 sm:py-16">
          <div className="w-full max-w-sm mx-auto">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg bg-[#12498b] dark:bg-slate-800 transition-colors"
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {emailSent ? "Check Your Email" : "Forgot Password"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                {emailSent
                  ? `We've sent a password reset link to ${email}`
                  : "Enter your email to receive a password reset link"
                }
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 px-4 py-3 rounded text-sm transition-colors">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="opacity-90">{success}</p>
                    {emailSent && (
                      <div className="mt-2 text-xs">
                        <p>Didn&apos;t receive the email?</p>
                        <button
                          onClick={handleResendEmail}
                          disabled={loading}
                          className="text-green-700 dark:text-green-400 font-medium hover:underline transition duration-200"
                        >
                          Click to resend
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm transition-colors">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="opacity-90">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Sent Success View */}
            {emailSent ? (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We&apos;ve sent a password reset link to<br />
                    <strong className="text-gray-900 dark:text-white font-bold">{email}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={loading}
                    className="w-full py-2.5 px-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 text-sm transition-all flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Resend Email
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleTryDifferentEmail}
                    className="w-full py-2.5 px-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 text-sm transition-all hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
                  >
                    Use Different Email
                  </button>
                </div>
              </div>
            ) : (
              /* Email Input Form */
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all text-sm"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white text-sm transition-all flex items-center justify-center mt-6 bg-[#b12222] hover:bg-[#c1353d] dark:bg-red-600 dark:hover:bg-red-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleBackToLogin}
                className="text-sm font-medium transition-all inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}