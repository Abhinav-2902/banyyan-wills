"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { willSchema, WillFormData } from "@/lib/validations/will";
import { saveWillAction } from "@/server/actions/will";
import { SaveButton } from "@/components/editor/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WillIntakeFormProps {
  initialData?: WillFormData;
  willId?: string;
}

export function WillIntakeForm({ initialData, willId }: WillIntakeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<WillFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(willSchema) as any,
    defaultValues: initialData || {
      fullName: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dob: undefined as any, // Force user to select a date
      residency: "",
      assets: [],
      beneficiaries: [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await saveWillAction(data, willId);

      if (result.success) {
        // Success feedback - using console.log for now (will add Toast later)
        console.log("✅ Draft saved successfully!", result.data);
        alert("Draft saved successfully!");
        
        // Reset dirty state after successful save
        form.reset(data);
      } else {
        // Handle errors
        if (result.fieldErrors) {
          // Set field-specific errors
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            form.setError(field as keyof WillFormData, {
              type: "manual",
              message: messages?.[0] || "Invalid value",
            });
          });
          console.error("❌ Validation errors:", result.fieldErrors);
        } else {
          // Generic error
          console.error("❌ Error:", result.error);
          alert(`Error: ${result.error}`);
        }
      }
    });
  });

  const isDirty = form.formState.isDirty;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Will Information</h2>
        
        {/* Temporary test inputs - will be replaced with full form sections */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            {...form.register("fullName")}
            placeholder="Enter your full legal name"
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-red-600">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="residency">Residency</Label>
          <Input
            id="residency"
            {...form.register("residency")}
            placeholder="Enter your state/country of residency"
          />
          {form.formState.errors.residency && (
            <p className="text-sm text-red-600">
              {form.formState.errors.residency.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            required
            {...form.register("dob")}
          />
          {form.formState.errors.dob && (
            <p className="text-sm text-red-600">
              {form.formState.errors.dob.message}
            </p>
          )}
        </div>

        {/* Display global form errors (e.g., beneficiaries total validation) */}
        {form.formState.errors.beneficiaries && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">
              {form.formState.errors.beneficiaries.message}
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <SaveButton
          onSave={handleSubmit}
          isPending={isPending}
          isDirty={isDirty}
        />
      </div>
    </form>
  );
}
