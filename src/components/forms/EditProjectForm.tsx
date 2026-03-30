"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Calendar, DollarSign } from "lucide-react"
import { Project } from "@/types"

interface EditProjectFormProps {
  project: Project
  onSuccess: () => void
  onProjectUpdated?: (projectId: string, updatedData: Partial<Project>) => void
}

// Format number to INR format
const formatINR = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export function EditProjectForm({ project, onSuccess, onProjectUpdated }: EditProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: project.name || "",
    college: project.college || "",
    department: project.department || "",
    team: project.team || "",
    date: project.date?.split("T")[0] || "",
    status: project.status || "pending",
    amountPaid: project.amountPaid || 0,
    finalAmount: project.finalAmount || 0,
  })
  const [amountPaidDisplay, setAmountPaidDisplay] = useState("")
  const [finalAmountDisplay, setFinalAmountDisplay] = useState("")

  // Initialize display values on mount
  useEffect(() => {
    if (project.amountPaid && project.amountPaid > 0) {
      setAmountPaidDisplay(formatINR(project.amountPaid));
    }
    if (project.finalAmount && project.finalAmount > 0) {
      setFinalAmountDisplay(formatINR(project.finalAmount));
    }
  }, [project.amountPaid, project.finalAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Project updated successfully")
        if (onProjectUpdated) {
          onProjectUpdated(project.id, formData)
        }
        onSuccess()
      } else {
        alert("Failed to update project")
      }
    } catch {
      alert("An error occurred while updating the project")
    } finally {
      setLoading(false)
    }
  }

  const paymentProgress = formData.finalAmount > 0 ? Math.round((formData.amountPaid / formData.finalAmount) * 100) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 rounded-lg p-6 transition-colors">
      <div className="bg-gradient-to-r from-[#12498b]/5 to-transparent dark:from-blue-900/10 p-4 rounded-lg border-l-4 border-[#12498b] dark:border-blue-500 mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#12498b] dark:text-blue-400" />
          Edit Project Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Update project details and payment information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-black dark:text-gray-200">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            className="h-11 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="college" className="text-sm font-semibold text-black dark:text-gray-200">
            College <span className="text-red-500">*</span>
          </Label>
          <Input
            id="college"
            name="college"
            placeholder="College"
            value={formData.college}
            onChange={handleChange}
            className="h-11 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-semibold text-black dark:text-gray-200">
            Department <span className="text-red-500">*</span>
          </Label>
          <Input
            id="department"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="h-11 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team" className="text-sm font-semibold text-black dark:text-gray-200">
            Team <span className="text-red-500">*</span>
          </Label>
          <Input
            id="team"
            name="team"
            placeholder="Team"
            value={formData.team}
            onChange={handleChange}
            className="h-11 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-semibold text-black dark:text-gray-200 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Project Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="h-11 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-semibold text-black dark:text-gray-200">
            Status
          </Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full h-11 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#12498b]/20 outline-none transition-all cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountPaid" className="text-sm font-semibold text-black dark:text-gray-200 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Amount Paid (INR)
          </Label>
          <Input
            id="amountPaid"
            name="amountPaid"
            type="text"
            value={amountPaidDisplay}
            onChange={(e) => handleAmountChange("amountPaid", e.target.value)}
            onBlur={(e) => {
              if (e.target.value === '') {
                setFormData(prev => ({ ...prev, amountPaid: 0 }));
              }
            }}
            className="h-11 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black"
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
            name="finalAmount"
            type="text"
            value={finalAmountDisplay}
            onChange={(e) => handleAmountChange("finalAmount", e.target.value)}
            onBlur={(e) => {
              if (e.target.value === '') {
                setFormData(prev => ({ ...prev, finalAmount: 0 }));
              }
            }}
            className="h-11 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#12498b] dark:focus:border-blue-500 focus:ring-[#12498b]/20 transition-all text-black"
            placeholder="₹0"
          />
        </div>

        {formData.finalAmount > 0 && (
          <div className="sm:col-span-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Payment Progress</span>
              <span className="font-semibold text-[#12498b] dark:text-blue-400">{paymentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
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
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#12498b] dark:bg-blue-600 hover:bg-[#0d3566] dark:hover:bg-blue-700 text-white"
        >
          {loading ? "Updating..." : "Update Project"}
        </Button>
      </div>
    </form>
  )
}
