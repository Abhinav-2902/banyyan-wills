"use strict";
"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { DownloadPDFButton } from "@/components/editor/download-pdf-button";
import { WillDashboardDTO } from "@/types";

interface WillCardProps {
  will: WillDashboardDTO;
}

export function WillCard({ will }: WillCardProps) {
  const isCompleted = will.status === "COMPLETED" || will.status === "PAID";
  
  // Format date
  const lastEdited = new Date(will.lastEdited).toLocaleDateString();

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/5 transition-all group relative">
      <Link 
        href={`/editor/${will.id}`} 
        className="flex items-center gap-4 flex-1 min-w-0 mr-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-[#FF6B6B]/10">
          <FileText className="h-5 w-5 text-gray-600 group-hover:text-[#FF6B6B]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{will.title}</h3>
          <p className="text-sm text-gray-600">
            Last edited {lastEdited}
          </p>
        </div>
      </Link>
      
      <div className="flex items-center gap-3 shrink-0">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          will.status === "DRAFT" 
            ? "bg-orange-100 text-orange-700"
            : isCompleted
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}>
          {will.status === "DRAFT" ? "Draft" : will.status}
        </span>
        
        {isCompleted ? (
          <div onClick={(e) => e.stopPropagation()}>
            <DownloadPDFButton 
              willId={will.id} 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] p-0"
            >
              <span className="sr-only">Download PDF</span>
            </DownloadPDFButton>
          </div>
        ) : (
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#FF6B6B]" />
        )}
      </div>
    </div>
  );
}
