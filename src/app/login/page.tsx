"use client";

import { useState, FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        console.error("Login failed:", result.error);
      } else {
        const session = await getSession();
        if (session) {
          router.push("/home");
          router.refresh();
        }
      }
    } catch {
      setError("An unexpected error occurred");
      console.error("Login error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-8 sm:py-12 transition-colors">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-gray-800 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left Portion - Branding */}
          <div
            className="flex flex-col justify-center items-center px-8 sm:px-12 py-16 sm:py-24 text-center bg-[#12498b] dark:bg-slate-900 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/10 to-transparent"></div>
            <div className="relative z-10 max-w-sm">
              {/* Logo Container */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                </div>
              </div>

              {/* Left Content */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Student Portal
              </h1>
              <p className="text-base sm:text-lg text-blue-100/80 mb-8 leading-relaxed">
                Sign in to track your project progress and access schedules
              </p>
              <div className="text-blue-50/70 text-sm sm:text-base">
                <p className="mb-4">Don&apos;t have an account?</p>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all border border-white/20 backdrop-blur-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Right Portion - Login Form */}
          <div className="flex flex-col justify-center items-center px-8 sm:px-12 py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Student Login
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Personalize your access</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm animate-shake">
                  <p className="font-semibold">Login Failed</p>
                  <p>{error}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Field */}
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#12498b] dark:focus:ring-blue-500/50 transition-all"
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#b12222] dark:text-red-400 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#12498b] dark:focus:ring-blue-500/50 transition-all"
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center mt-8 bg-[#b12222] hover:bg-[#c1353d] dark:bg-red-600 dark:hover:bg-red-700 shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  By signing in, you agree to our{" "}
                  <Link href="#" className="font-semibold text-gray-700 dark:text-gray-300 hover:underline">
                    Terms
                  </Link>
                  {" "}and{" "}
                  <Link href="#" className="font-semibold text-gray-700 dark:text-gray-300 hover:underline">
                    Privacy Policy
                  </Link>
                </p>

                {/* <Link 
                  href="/admin" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#b12222] hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors uppercase tracking-widest bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-full border border-red-100 dark:border-red-900/20"
                >
                  Admin Access Portal
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}