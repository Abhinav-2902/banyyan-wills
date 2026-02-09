"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createNewWillAction } from "@/server/actions/will";
import { Loader2 } from "lucide-react";

interface CreateWillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWillDialog({ open, onOpenChange }: CreateWillDialogProps) {
  const [willName, setWillName] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    // Validation
    if (!willName.trim()) {
      setError("Please enter a name for your will");
      return;
    }

    if (willName.length > 100) {
      setError("Will name must be less than 100 characters");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const result = await createNewWillAction(willName.trim());

      if (result.success && result.data) {
        // Close dialog and redirect to editor
        onOpenChange(false);
        router.push(`/editor/${result.data.id}`);
      } else {
        setError(result.error || "Failed to create will");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setWillName("");
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Create New Will
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Give your will a name to help you identify it later
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="will-name">Will Name *</Label>
            <Input
              id="will-name"
              placeholder="e.g., My Last Will and Testament"
              value={willName}
              onChange={(e) => {
                setWillName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isCreating) {
                  handleCreate();
                }
              }}
              disabled={isCreating}
              className="text-black"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Will"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
