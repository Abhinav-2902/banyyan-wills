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
  { number: 2, title: "Will Declaration", description: "Declaration statements" },
  { number: 3, title: "Will Executors", description: "Executor details" },
  { number: 4, title: "Dispute Resolver", description: "Optional dispute resolution" },
  { number: 5, title: "Witness Details", description: "Will signing witnesses" },
  { number: 6, title: "Executor", description: "Will executor details" },
  { number: 7, title: "Final Provisions", description: "Declarations & signatures" },
];

export function StepProgress({ currentStep, completedSteps }: StepProgressProps) {
  return (
    <div className="w-full mb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        {/* Mobile: Simple Progress Bar */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                Step {currentStep} of {STEPS.length}
              </span>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                {STEPS[currentStep - 1].title}
              </p>
            </div>
            <span className="text-sm font-medium text-gray-500">
              {Math.round((completedSteps.length / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#FF6B6B] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop: Horizontal Stepper */}
        <nav className="hidden lg:block py-4" aria-label="Progress">
          <ol className="flex items-center w-full">
            {STEPS.map((step, stepIdx) => {
              const isCompleted = completedSteps.includes(step.number);
              const isCurrent = currentStep === step.number;
              const isUpcoming = step.number > currentStep && !isCompleted;

              return (
                <li
                  key={step.number}
                  className={cn(
                    "relative flex flex-col items-center",
                    stepIdx !== STEPS.length - 1 ? "flex-1" : ""
                  )}
                >
                   {/* Connector Line (Behind circles) */}
                   {stepIdx !== STEPS.length - 1 && (
                    <div
                      className="absolute top-4 left-1/2 w-full h-[2px] -z-10 bg-gray-200"
                      aria-hidden="true"
                    >
                      <div
                        className={cn(
                          "h-full transition-all duration-500 ease-out bg-[#FF6B6B]",
                          isCompleted ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  )}

                  {/* Circle Indicator */}
                  <div 
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 bg-white z-10",
                      isCompleted && "border-[#FF6B6B] bg-[#FF6B6B] text-white",
                      isCurrent && "border-[#FF6B6B] ring-4 ring-rose-50 text-[#FF6B6B]",
                      isUpcoming && "border-gray-300 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      <span className="text-xs font-bold">{step.number}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="mt-2 text-center">
                    <span
                      className={cn(
                        "block text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                        isCurrent ? "text-[#FF6B6B]" : isCompleted ? "text-gray-900" : "text-gray-400"
                      )}
                    >
                      {step.title}
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
