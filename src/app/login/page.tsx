"use client";

import { FormEvent, useEffect, useState } from "react";
import { getProviders, getSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 10.023H12v3.955h5.62c-.242 1.274-.967 2.353-2.056 3.079v2.558h3.327c1.947-1.793 3.074-4.434 3.074-7.57 0-.674-.06-1.321-.16-2.022Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.79 0 5.13-.925 6.84-2.508l-3.327-2.558c-.925.62-2.105.986-3.513.986-2.699 0-4.984-1.822-5.8-4.272H2.76v2.639A10.33 10.33 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.2 13.648a6.2 6.2 0 0 1 0-3.948V7.06H2.76a10.33 10.33 0 0 0 0 9.227L6.2 13.648Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.08c1.518 0 2.882.523 3.955 1.55l2.966-2.967C17.126 2.988 14.786 2 12 2A10.33 10.33 0 0 0 2.76 7.06L6.2 9.7C7.016 7.252 9.3 6.08 12 6.08Z"
        fill="#EA4335"
      />
    </svg>
  );
}

const GOOGLE_CONFIG_MESSAGE =
  "Google Sign-In is not configured yet. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_URL in .env.";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [googleEnabled, setGoogleEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      const providers = await getProviders();

      if (isMounted) {
        setGoogleEnabled(Boolean(providers?.google));
      }
    };

    void loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const authError = searchParams.get("error");

    if (!authError) {
      return;
    }

    if (authError === "OAuthSignin" || authError === "OAuthCallback" || authError === "Callback") {
      setGoogleLoading(false);
      setError(GOOGLE_CONFIG_MESSAGE);
      void signOut({ redirect: false });
      return;
    }

    if (authError === "CredentialsSignin") {
      setError("Invalid email or password");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        const session = await getSession();
        if (session) {
          router.push("/home");
          router.refresh();
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleEnabled) {
      setError(GOOGLE_CONFIG_MESSAGE);
      return;
    }

    setGoogleLoading(true);
    setError("");

    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch {
      setGoogleLoading(false);
      setError("Google sign-in is unavailable right now");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-8 sm:py-12 transition-colors">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-gray-800 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="flex flex-col justify-center items-center px-8 sm:px-12 py-16 sm:py-24 text-center bg-[#12498b] dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/10 to-transparent"></div>
            <div className="relative z-10 max-w-sm">
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

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Student Portal
              </h1>
              <p className="text-base sm:text-lg text-blue-100/80 mb-8 leading-relaxed">
                Sign in with Google or your registered email to track project progress and access schedules
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

          <div className="flex flex-col justify-center items-center px-8 sm:px-12 py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Student Login
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Choose Google or sign in manually</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm animate-shake">
                  <p className="font-semibold">Login Failed</p>
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={!googleEnabled || googleLoading || formLoading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-gray-900 dark:text-white transition-all flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-xl shadow-slate-200/40 dark:shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {googleLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"></path>
                      </svg>
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <GoogleIcon />
                      Continue with Google
                    </>
                  )}
                </button>

                {!googleEnabled && (
                  <p className="text-center text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
                    Google Sign-In will appear after its `.env` values are added.
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                    Or
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
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
                      disabled={formLoading || googleLoading}
                    />
                  </div>

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
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#12498b] dark:focus:ring-blue-500/50 transition-all"
                      disabled={formLoading || googleLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading || googleLoading}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center mt-8 bg-[#b12222] hover:bg-[#c1353d] dark:bg-red-600 dark:hover:bg-red-700 shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {formLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
