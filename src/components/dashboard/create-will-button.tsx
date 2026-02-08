"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNewWillAction } from "@/server/actions/will";

export function CreateWillButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateWill = () => {
    startTransition(async () => {
      const result = await createNewWillAction();
      
      if (result.success && result.data) {
        // Redirect to the new Will editor
        router.push(`/editor/${result.data.id}`);
      } else {
        // Handle error
        alert(`Error: ${result.error || "Failed to create new will"}`);
      }
    });
  };

  return (
    <button
      onClick={handleCreateWill}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-200 bg-[#FF6B6B] text-white hover:bg-[#FF5555] shadow-md hover:shadow-lg px-6 py-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Will
        </>
      )}
    </button>
  );
}
