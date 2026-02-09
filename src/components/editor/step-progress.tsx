"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepProgressProps {
  currentStep: number;
  completedSteps: number[];
}

const STEPS: Step[] = [
  { number: 1, title: "Testator Details", description: "Personal information" },
  { number: 2, title: "Family Details", description: "Spouse, children, parents" },
  { number: 3, title: "Asset Details", description: "Property, accounts, investments" },
  { number: 4, title: "Beneficiaries", description: "Distribution of assets" },
  { number: 5, title: "Guardianship", description: "For minor children" },
  { number: 6, title: "Executor", description: "Will executor details" },
  { number: 7, title: "Final Provisions", description: "Declarations & signatures" },
];

export function StepProgress({ currentStep, completedSteps }: StepProgressProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile: Current Step Only */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((completedSteps.length / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#FF6B6B] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-base font-semibold text-gray-900">
            {STEPS[currentStep - 1].title}
          </p>
          <p className="text-sm text-gray-600">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        {/* Desktop: All Steps */}
        <nav className="hidden lg:block" aria-label="Progress">
          <ol className="flex items-center justify-between">
            {STEPS.map((step, stepIdx) => {
              const isCompleted = completedSteps.includes(step.number);
              const isCurrent = currentStep === step.number;
              const isUpcoming = step.number > currentStep && !isCompleted;

              return (
                <li
                  key={step.number}
                  className={cn(
                    "relative",
                    stepIdx !== STEPS.length - 1 ? "pr-8 sm:pr-20 flex-1" : ""
                  )}
                >
                  {/* Connector Line */}
                  {stepIdx !== STEPS.length - 1 && (
                    <div
                      className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full"
                      aria-hidden="true"
                    >
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          isCompleted ? "bg-[#FF6B6B]" : "bg-gray-300"
                        )}
                      />
                    </div>
                  )}

                  {/* Step Circle */}
                  <div className="relative flex items-start group">
                    <span className="flex h-9 items-center">
                      <span
                        className={cn(
                          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                          isCompleted &&
                            "bg-[#FF6B6B] group-hover:bg-[#FF5555]",
                          isCurrent &&
                            "border-2 border-[#FF6B6B] bg-white ring-4 ring-[#FF6B6B]/20",
                          isUpcoming && "border-2 border-gray-300 bg-white"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              isCurrent && "text-[#FF6B6B]",
                              isUpcoming && "text-gray-500"
                            )}
                          >
                            {step.number}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span
                        className={cn(
                          "text-sm font-semibold transition-colors",
                          isCurrent && "text-[#FF6B6B]",
                          isCompleted && "text-gray-900",
                          isUpcoming && "text-gray-500"
                        )}
                      >
                        {step.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
