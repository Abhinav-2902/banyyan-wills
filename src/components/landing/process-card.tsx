"use client"

import { Check } from "lucide-react"

export function ProcessCard() {
  const steps = [
    { name: "Personal Information", progress: 100, completed: true },
    { name: "Asset Distribution", progress: 100, completed: true },
    { name: "Beneficiaries", progress: 100, completed: true },
  ]

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Will</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-400">
          <Check className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {step.name}
              </span>
              {step.completed && (
                <Check className="h-4 w-4 text-teal-400" />
              )}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full bg-[#FF6B6B] transition-all duration-300"
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="mt-6 rounded-md bg-teal-50 px-4 py-3">
        <div className="flex items-center">
          <Check className="h-4 w-4 text-teal-500 mr-2" />
          <span className="text-sm font-medium text-teal-700">
            Ready to finalize
          </span>
        </div>
      </div>
    </div>
  )
}
