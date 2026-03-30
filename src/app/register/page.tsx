"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isGoogle: false,
    message: ""
  });
  const router = useRouter();

  // Enhanced email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        isGoogle: false,
        message: "Please enter a valid email address"
      };
    }

    const googleDomains = ['gmail.com', 'googlemail.com', 'google.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    const isGoogleEmail = googleDomains.includes(domain);

    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
      'yopmail.com', 'throwaway.com', 'fakeinbox.com', 'trashmail.com',
      'temp-mail.org', 'getairmail.com', 'maildrop.cc', 'dispostable.com'
    ];

    if (disposableDomains.some(disposable => domain?.includes(disposable))) {
      return {
        isValid: false,
        isGoogle: false,
        message: "Temporary email addresses are not allowed"
      };
    }

    return {
      isValid: true,
      isGoogle: isGoogleEmail,
      message: isGoogleEmail ? "Valid Google email" : "Valid email"
    };
  };

  // Password validation function
  const validatePassword = (password: string, name: string) => {
    const errors: string[] = [];

    if (password.length < 8) errors.push("At least 8 characters long");
    if (!/(?=.*[a-z])/.test(password)) errors.push("At least one lowercase letter");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("At least one uppercase letter");
    if (!/(?=.*\d)/.test(password)) errors.push("At least one number");
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) errors.push("At least one special character");
    if (name && password.toLowerCase().includes(name.toLowerCase())) errors.push("Should not contain your name");

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email' && value) {
      setEmailValidation(validateEmail(value));
    }

    if (name === 'password' || name === 'name') {
      const passwordToValidate = name === 'password' ? value : formData.password;
      const nameToUse = name === 'name' ? value : formData.name;
      if (passwordToValidate) {
        setPasswordErrors(validatePassword(passwordToValidate, nameToUse));
      } else {
        setPasswordErrors([]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const emailVal = validateEmail(formData.email);
    if (!emailVal.isValid) {
      setError(emailVal.message);
      setLoading(false);
      return;
    }

    const passErrors = validatePassword(formData.password, formData.name);
    if (passErrors.length > 0) {
      setPasswordErrors(passErrors);
      setError("Please fix the password requirements");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setSuccess(true);
      setTimeout(() => router.push("/login?message=Registration successful"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-8 sm:py-12 transition-colors">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-gray-800 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left Portion - Branding */}
          <div className="flex flex-col justify-center items-center px-8 sm:px-12 py-16 sm:py-24 text-center bg-[#12498b] dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/10 to-transparent"></div>
            <div className="relative z-10 max-w-sm">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Create Account</h1>
              <p className="text-base sm:text-lg text-blue-100/80 mb-8 leading-relaxed">Join our engineering community and build your future</p>
              <div className="text-blue-50/70 text-sm sm:text-base">
                <p className="mb-4">Already a member?</p>
                <Link href="/login" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all border border-white/20 backdrop-blur-sm">
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Right Portion - Form */}
          <div className="flex flex-col justify-center items-center px-8 sm:px-12 py-10 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Register</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Personalize your journey</p>
              </div>

              {success && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 px-4 py-3 rounded text-sm animate-pulse">
                  <p className="font-semibold">Account Created!</p>
                  <p>Redirecting you to login...</p>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
                  <p className="font-semibold">Error</p>
                  <p>{error}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#12498b] transition-all outline-none" placeholder="John Doe" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between">
                      Email address
                      {emailValidation.message && (
                        <span className={`text-[10px] uppercase tracking-wider ${emailValidation.isValid ? 'text-green-500' : 'text-red-500'}`}>
                          {emailValidation.message}
                        </span>
                      )}
                    </label>
                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#12498b] transition-all outline-none" placeholder="john@example.com" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                      <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#12498b] transition-all outline-none" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm</label>
                      <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#12498b] transition-all outline-none" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                {passwordErrors.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-[11px] text-red-600 dark:text-red-400 leading-relaxed">
                    <p className="font-bold mb-1">Improve password:</p>
                    <ul className="grid grid-cols-2 gap-x-2">
                      {passwordErrors.map((e, i) => <li key={i}>• {e}</li>)}
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center mt-6 bg-[#b12222] hover:bg-[#c1353d] dark:bg-red-600 dark:hover:bg-red-700 shadow-xl shadow-red-500/10 disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-[10px] text-gray-400 mt-8">
                By registering, you agree to our Terms and Policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}