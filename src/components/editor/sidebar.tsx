"use client";

import { cn } from "@/lib/utils";
import { Check, FileText } from "lucide-react";
import { STEPS } from "./constants";
import type { Step } from "./constants";

interface SidebarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  className?: string; // Allow custom classes
}

export function Sidebar({ currentStep, completedSteps, onStepClick, className }: SidebarProps) {
  // Calculate progress percentage
  const progress = Math.round((completedSteps.length / (STEPS.length - 1)) * 100);

  return (
    <div className={cn("w-full h-full bg-white flex flex-col border-r border-gray-100", className)}>
      {/* Header Section */}
      <div className="p-8 border-b border-gray-50 bg-linear-to-b from-white to-gray-50/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#FF6B6B] p-2.5 rounded-xl shadow-lg shadow-rose-100 ring-4 ring-rose-50">
             <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-xl tracking-tight">Banyyan</h2>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Guide</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-gray-900">Total Progress</span>
            <span className="text-lg font-black text-[#FF6B6B] leading-none">{Math.min(progress, 100)}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden p-[2px]">
            <div 
              className="h-full bg-linear-to-r from-[#FF6B6B] to-[#FF8787] transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(255,107,107,0.3)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <Check className="w-3 h-3 text-green-500" />
            {completedSteps.length} of {STEPS.length} Steps Ready
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
        {STEPS.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = completedSteps.includes(step.number);
          const Icon = step.icon || FileText;

          return (
            <button
              key={step.number}
              onClick={() => onStepClick && onStepClick(step.number)}
              className={cn(
                "group relative flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 w-full text-left outline-none",
                isActive 
                  ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 border border-gray-50" 
                  : "hover:bg-gray-50/80"
              )}
            >
              {/* Active Marker */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6B6B] rounded-r-full" />
              )}

              {/* Icon Box */}
              <div className={cn(
                "flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 shrink-0 shadow-sm",
                isActive 
                  ? "bg-[#FF6B6B] text-white rotate-0 scale-100 shadow-rose-200" 
                  : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-[#FF6B6B] group-hover:shadow-md"
              )}>
                 <Icon className={cn("w-5.5 h-5.5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[14px] font-bold tracking-tight mb-0.5 transition-colors duration-300",
                  isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                )}>
                  {step.title}
                </p>
                <p className={cn(
                  "text-[11px] font-medium tracking-wide uppercase opacity-60",
                  isActive ? "text-[#FF6B6B]" : "text-gray-400"
                )}>
                  {step.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center shrink-0 ml-2">
                 {isCompleted ? (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive ? "bg-white ring-1 ring-gray-100" : "bg-green-50"
                    )}>
                        <Check className={cn("w-3.5 h-3.5", isActive ? "text-[#FF6B6B]" : "text-green-500")} />
                    </div>
                 ) : (
                    <div className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black tracking-tighter transition-all duration-300",
                        isActive ? "bg-[#FF6B6B]/10 text-[#FF6B6B]" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    )}>
                        {step.number.toString().padStart(2, '0')}
                    </div>
                 )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
