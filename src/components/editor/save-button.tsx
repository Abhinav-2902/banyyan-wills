"use client";

import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  onSave: () => void;
  isPending: boolean;
  isDirty: boolean;
}

export function SaveButton({ onSave, isPending, isDirty }: SaveButtonProps) {
  return (
    <Button
      type="button"
      onClick={onSave}
      disabled={!isDirty || isPending}
      className="min-w-[120px]"
    >
      {isPending ? "Saving..." : "Save Draft"}
    </Button>
  );
}
