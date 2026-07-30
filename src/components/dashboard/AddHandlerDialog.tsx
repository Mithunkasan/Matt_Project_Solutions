"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, Mail, User, CheckCircle2, AlertCircle } from "lucide-react";

export function AddHandlerDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email address is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/project-handlers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password setup email sent successfully!");
        setName("");
        setEmail("");
        // Wait briefly then close the dialog
        setTimeout(() => {
          setOpen(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(data.error || "Failed to send invitation.");
      }
    } catch (err) {
      console.error("Invite project handler error:", err);
      setError("Failed to invite handler. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form states when closing
      setName("");
      setEmail("");
      setError("");
      setSuccess("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 text-white bg-teal-600 hover:bg-teal-700 h-10 px-4 rounded-lg shadow-sm font-medium transition-all duration-200">
          <UserPlus className="h-4 w-4" />
          Add Handler
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Add New Handler
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Invite a project handler to setup their password and manage projects.
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-800 dark:text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 text-green-800 dark:text-green-300 text-sm animate-pulse">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="handlerName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Handler Name <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="handlerName"
                  type="text"
                  placeholder="Enter name"
                  className="w-full h-11 pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-teal-600/20 transition-all text-black dark:text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="handlerEmail" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Handler Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="handlerEmail"
                  type="email"
                  placeholder="handler@example.com"
                  className="w-full h-11 pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-teal-600/20 transition-all text-black dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-800 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
                className="px-4 py-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invite"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
