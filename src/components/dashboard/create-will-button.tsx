"use client";

import { useState } from "react";
import { CreateWillDialog } from "./create-will-dialog";

export function CreateWillButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className="inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-200 bg-[#FF6B6B] text-white hover:bg-[#FF5555] shadow-md hover:shadow-lg px-6 py-3 whitespace-nowrap"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create New Will
      </button>

      <CreateWillDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
