"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "@/types";
import { Building2, User, Calendar, DollarSign, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";

interface AddProjectFormProps {
  onProjectAdded: (project: Project) => void;
  onCancel: () => void;
}

// Format number to INR format
const formatINR = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export function AddProjectForm({ onProjectAdded, onCancel }: AddProjectFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    department: "",
    handler: "",
    team: "",
    student: "",
    studentEmail: "",
    date: "",
    amountPaid: 0,
    status: "pending" as "pending" | "ongoing" | "completed",
    finalAmount: 0
  });
  const [amountPaidDisplay, setAmountPaidDisplay] = useState("");
  const [finalAmountDisplay, setFinalAmountDisplay] = useState("");

  // Update display values when formData changes
  useEffect(() => {
    if (formData.amountPaid > 0) {
      setAmountPaidDisplay(formatINR(formData.amountPaid));
    } else {
      setAmountPaidDisplay("");
    }
  }, [formData.amountPaid]);

  useEffect(() => {
    if (formData.finalAmount > 0) {
      setFinalAmountDisplay(formatINR(formData.finalAmount));
    } else {
      setFinalAmountDisplay("");
    }
  }, [formData.finalAmount]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmountChange = (field: "amountPaid" | "finalAmount", value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') {
      setFormData(prev => ({ ...prev, [field]: 0 }));
      if (field === "amountPaid") {
        setAmountPaidDisplay("");
      } else {
        setFinalAmountDisplay("");
      }
      return;
    }

    const numValue = parseFloat(numericValue);
    setFormData(prev => ({ ...prev, [field]: numValue }));

    // Update display with INR format
    if (field === "amountPaid") {
      setAmountPaidDisplay(formatINR(numValue));
    } else {
      setFinalAmountDisplay(formatINR(numValue));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.date) {
      alert('Please select a project date');
      return;
    }

    if (formData.amountPaid < 0 || formData.finalAmount < 0) {
      alert('Amount values cannot be negative');
      return;
    }

    if (formData.amountPaid > formData.finalAmount) {
      alert('Amount paid cannot be greater than final amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        onProjectAdded(responseData);
        // Reset form
        setFormData({
          name: "",
          college: "",
          department: "",
          handler: "",
          team: "",
          student: "",
          studentEmail: "",
          date: "",
          amountPaid: 0,
          status: "pending",
          finalAmount: 0,
        });
        setAmountPaidDisplay("");
        setFinalAmountDisplay("");
        setStep(1);
      } else {
        alert(responseData.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = formData.name && formData.college && formData.department && formData.handler && formData.team;
  const paymentProgress = formData.finalAmount > 0 ? Math.round((formData.amountPaid / formData.finalAmount) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-0 sm:p-2">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${step === 1 ? 'text-[#12498b] dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
            Step 1: Basic Information
          </span>
          <span className={`text-sm font-medium ${step === 2 ? 'text-[#12498b] dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
            Step 2: Details & Payment
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
          <div
            className="bg-[#12498b] dark:bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#12498b]/5 to-transparent dark:from-blue-900/10 p-4 rounded-lg border-l-4 border-[#12498b] dark:border-blue-500">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#12498b] dark:text-blue-400" />
                Project Basic Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fill in the essential project details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-black dark:text-gray-200">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter project name"
                  className="w-full h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="college" className="text-sm font-semibold text-black dark:text-gray-200">
                  College Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="college"
                  type="text"
                  placeholder="Enter college name"
                  className="w-full h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold text-black dark:text-gray-200">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="Enter department name"
                  className="w-full h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handler" className="text-sm font-semibold text-black dark:text-gray-200">
                  Project Handler <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="handler"
                    type="text"
                    placeholder="Enter handler name"
                    className="w-full h-11 pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                    value={formData.handler}
                    onChange={(e) => handleInputChange("handler", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="team" className="text-sm font-semibold text-black dark:text-gray-200">
                  MATT Team <span className="text-red-500">*</span>
                </Label>
                <select
                  id="team"
                  className="w-full h-11 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#12498b]/20 outline-none transition-all cursor-pointer"
                  value={formData.team}
                  onChange={(e) => handleInputChange("team", e.target.value)}
                  required
                >
                  <option value="">Select team</option>
                  <option value="HR">HR</option>
                  <option value="AI">AI</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="JClicks">JClicks</option>
                  <option value="CAD Point">CAD Point</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2 || loading}
                className="w-full sm:w-auto bg-[#16539b] dark:bg-blue-600 hover:bg-[#1858a3] dark:hover:bg-blue-700 text-white"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#12498b]/5 to-transparent dark:from-blue-900/10 p-4 rounded-lg border-l-4 border-[#12498b] dark:border-blue-500">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#12498b] dark:text-blue-400" />
                Project Details & Payment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete the project information and payment details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="student" className="text-sm font-semibold text-black dark:text-gray-200">
                  Student Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="student"
                    type="text"
                    placeholder="Enter student name"
                    className="w-full h-11 pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                    value={formData.student}
                    onChange={(e) => handleInputChange("student", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentEmail" className="text-sm font-semibold text-black dark:text-gray-200">
                  Student Email (for tracking)
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="studentEmail"
                    type="email"
                    placeholder="student@example.com"
                    className="w-full h-11 pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                    value={formData.studentEmail}
                    onChange={(e) => handleInputChange("studentEmail", e.target.value)}
                  />
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-black dark:text-gray-200">
                  Project Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="date"
                    type="date"
                    className="w-full h-11 pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountPaid" className="text-sm font-semibold text-black dark:text-gray-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Amount Paid (INR)
                </Label>
                <Input
                  id="amountPaid"
                  type="text"
                  value={amountPaidDisplay}
                  onChange={(e) => handleAmountChange("amountPaid", e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setFormData(prev => ({ ...prev, amountPaid: 0 }));
                    }
                  }}
                  className="w-full h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                  placeholder="₹0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalAmount" className="text-sm font-semibold text-black dark:text-gray-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Final Amount (INR)
                </Label>
                <Input
                  id="finalAmount"
                  type="text"
                  value={finalAmountDisplay}
                  onChange={(e) => handleAmountChange("finalAmount", e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setFormData(prev => ({ ...prev, finalAmount: 0 }));
                    }
                  }}
                  className="w-full h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black dark:text-white"
                  placeholder="₹0"
                />
              </div>

              {formData.finalAmount > 0 && (
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Payment Progress</span>
                    <span className="font-semibold text-[#12498b] dark:text-blue-400">{paymentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#12498b] to-[#1a5ba8] dark:from-blue-600 dark:to-blue-400 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                    >
                      {paymentProgress > 10 && (
                        <span className="text-xs text-white font-semibold">{paymentProgress}%</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="status" className="text-sm font-semibold text-black dark:text-gray-200">
                  Project Status
                </Label>
                <select
                  id="status"
                  className="w-full h-11 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#12498b]/20 outline-none transition-all cursor-pointer"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-full sm:w-auto dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#16539b] dark:bg-blue-600 hover:bg-[#1858a3] dark:hover:bg-blue-700 text-white"
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
