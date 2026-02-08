"use client";

import { WillDashboardDTO } from "@/types";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteWillAction } from "@/server/actions/will";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WillCardStubProps {
  will: WillDashboardDTO;
}

export function WillCardStub({ will }: WillCardStubProps) {
  const [isDeleting, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: WillDashboardDTO["status"]) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "PAID":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Determine if the Will is editable/deletable
  const isEditable = will.status === "DRAFT";

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteWillAction(will.id);
      
      if (!result.success) {
        alert(`Error: ${result.error || "Failed to delete will"}`);
      }
      // On success, the page will automatically revalidate
      setOpen(false);
    });
  };

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-xl text-gray-900 line-clamp-2 flex-1 pr-4">
          {will.title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${getStatusColor(
              will.status
            )}`}
          >
            {will.status}
          </span>
          
          {/* Delete Button - Only for DRAFT */}
          {isEditable && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Will"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your Will draft
                    &ldquo;{will.title}&rdquo; and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      {/* Progress Section */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Progress</span>
          <span className="text-gray-900 font-semibold">{will.progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] rounded-full transition-all duration-300" 
            style={{ width: `${will.progress}%` }} 
          />
        </div>
      </div>

      {/* Last Edited */}
      <div className="flex items-center text-sm text-gray-500 mb-5 pb-5 border-b border-gray-100">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Last edited {will.lastEdited.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Action Button */}
      {isEditable ? (
        <Link
          href={`/editor/${will.id}`}
          className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[#FFF5F5] transition-all duration-200 uppercase tracking-wide text-center"
        >
          Edit Will
        </Link>
      ) : (
        <button 
          className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 uppercase tracking-wide cursor-not-allowed opacity-60"
          disabled
        >
          View Only
        </button>
      )}
    </div>
  );
}
