"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function ProjectHandlerInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvite = async () => {
      if (!token) {
        setError("Invitation token is missing.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/project-handler/invite?token=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (res.ok) {
        setEmail(data.email);
        setName(data.name);
      } else {
        setError(data.error || "This invitation link is invalid or expired.");
      }

      setLoading(false);
    };

    loadInvite();
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/project-handler/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword })
    });
    const data = await res.json();

    if (res.ok) {
      router.push("/login");
      return;
    }

    setError(data.error || "Failed to set password.");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 mb-4">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {email ? `${name || "Project Handler"} - ${email}` : "Project Handler invitation"}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Checking invitation...</p>
        ) : error && !email ? (
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded text-sm">
            {error}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 rounded text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#12498b]"
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#12498b]"
                placeholder="Re-enter password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-[#b12222] hover:bg-[#c1353d] disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Set Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ProjectHandlerInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <ProjectHandlerInviteContent />
    </Suspense>
  );
}
