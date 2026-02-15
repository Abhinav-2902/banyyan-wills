"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFormContext, useWatch } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gavel } from "lucide-react";

export function Step9ResiduaryClause() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  // Watch beneficiaries and charities from previous steps
  const beneficiaries = useWatch({ name: "step6.beneficiaries" }) || [];
  const charities = useWatch({ name: "step7.charities" }) || [];
  
  // Watch current step data
  const selectedRecipients = watch("step9.selectedRecipients") || [];
  const distribution = watch("step9.distribution") || {};

  // Debug logging
  console.log("Step 9 Debug:", {
    beneficiariesCount: beneficiaries.length,
    charitiesCount: charities.length,
    selectedRecipients,
    distribution
  });

  // Combine beneficiaries and charities with type tags and index-based IDs
  const beneficiariesTagged = (beneficiaries || []).map((b: any, idx: number) => ({ 
    ...b,
    id: `beneficiary-${idx}`,
    __type: 'beneficiary',
    __index: idx
  }));
  const charitiesTagged = (charities || []).map((c: any, idx: number) => ({ 
    ...c,
    id: `charity-${idx}`,
    __type: 'charity',
    __index: idx
  }));
  const recipients = [...beneficiariesTagged, ...charitiesTagged];
  console.log("Recipients combined:", recipients);

  // Handle recipient selection toggle
  const handleToggleRecipient = (id: string, checked: boolean) => {
    console.log("Toggle recipient:", id, checked);
    
    const newSelected = checked
      ? [...selectedRecipients, id]
      : selectedRecipients.filter((rid: string) => rid !== id);
    
    console.log("New selected:", newSelected);
    setValue("step9.selectedRecipients", newSelected, { shouldDirty: true });

    // Update distribution
    const newDist = { ...distribution };
    if (checked) {
      if (newDist[id] === undefined) newDist[id] = 0;
    } else {
      delete newDist[id];
    }
    console.log("New distribution:", newDist);
    setValue("step9.distribution", newDist, { shouldDirty: true });
  };

  // Distribute evenly among selected recipients
  const handleDistributeEvenly = () => {
    console.log("Distribute evenly clicked");
    const selected = recipients.filter((r: any) => selectedRecipients.includes(r.id));
    const count = selected.length;
    console.log("Selected recipients for distribution:", selected, "Count:", count);
    
    if (count === 0) {
      console.log("No recipients selected");
      return;
    }

    // Calculate equal share, rounded to 2 decimals
    const equalShare = Math.floor((100 / count) * 100) / 100;
    const shares = Array(count).fill(equalShare);
    const total = shares.reduce((a, b) => a + b, 0);
    const remainder = Math.round((100 - total) * 100) / 100;
    shares[count - 1] += remainder;

    const newDist: Record<string, number> = {};
    selected.forEach((r: any, idx: number) => {
      newDist[r.id] = Number(shares[idx].toFixed(2));
    });

    console.log("Calculated distribution:", newDist);
    setValue("step9.distribution", newDist, { shouldDirty: true });
  };

  // Get recipient IDs by type
  const getRecipientIdsByType = (type: string) =>
    recipients
      .filter((r: any) => r && r.__type === type && r.id)
      .map((r: any) => r.id);

  // Check if all of a type are selected
  const areAllOfTypeSelected = (type: string) => {
    const typeIds = getRecipientIdsByType(type);
    if (typeIds.length === 0) return false;
    return typeIds.every((id: string) => selectedRecipients.includes(id));
  };

  // Toggle select all of a type
  const toggleSelectAllOfType = (type: string) => {
    console.log("Toggle select all:", type);
    const typeIds = getRecipientIdsByType(type);
    console.log("Type IDs:", typeIds);
    
    const allSelected = typeIds.length > 0 && typeIds.every((id: string) => selectedRecipients.includes(id));
    console.log("All selected?", allSelected);

    if (allSelected) {
      // Deselect all of this type
      const newSelected = selectedRecipients.filter((id: string) => !typeIds.includes(id));
      setValue("step9.selectedRecipients", newSelected, { shouldDirty: true });

      const newDist = { ...distribution };
      typeIds.forEach((id: string) => {
        delete newDist[id];
      });
      setValue("step9.distribution", newDist, { shouldDirty: true });
    } else {
      // Select all of this type
      const union = new Set([...selectedRecipients, ...typeIds]);
      setValue("step9.selectedRecipients", Array.from(union), { shouldDirty: true });

      const newDist = { ...distribution };
      typeIds.forEach((id: string) => {
        if (newDist[id] === undefined) newDist[id] = 0;
      });
      setValue("step9.distribution", newDist, { shouldDirty: true });
    }
  };

  // Calculate total distribution
  const total = recipients.reduce((acc: number, r: any) => 
    acc + (Number(distribution[r.id]) || 0), 0
  );
  const hasError = selectedRecipients.length > 0 && Math.abs(total - 100) > 0.01;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] px-6 py-4">
          <div className="flex items-center space-x-3">
            <Gavel className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Residuary Clause</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            The residuary clause covers all remaining assets not specifically mentioned elsewhere in your will. 
            This includes any assets acquired after creating your will or assets not covered by specific bequests. 
            Please distribute these remaining assets among your selected beneficiaries and charities.
          </p>

          {recipients.length === 0 ? (
            <div className="text-center py-12">
              <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Add beneficiaries or charities in previous steps to specify distribution.</p>
            </div>
          ) : (
            <>
              {/* Toolbar with Select/Deselect All and Distribute Evenly */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggleSelectAllOfType('beneficiary')}
                  >
                    {areAllOfTypeSelected('beneficiary') ? 'Deselect All Beneficiaries' : 'Select All Beneficiaries'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggleSelectAllOfType('charity')}
                  >
                    {areAllOfTypeSelected('charity') ? 'Deselect All Charities' : 'Select All Charities'}
                  </Button>
                </div>

                <Button
                  type="button"
                  onClick={handleDistributeEvenly}
                  className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] hover:from-[#7A6BAD] hover:to-[#381F64]"
                >
                  Distribute Evenly
                </Button>
              </div>

              {/* Recipients Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipients.map((recipient: any) => (
                  <div key={recipient.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={(e) => handleToggleRecipient(recipient.id, e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="flex-1 font-medium text-gray-900">
                        {recipient.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{recipient.relation || 'Charity'}</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={distribution[recipient.id] ?? ''}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                          setValue(`step9.distribution.${recipient.id}`, value);
                        }}
                        className="flex-1"
                        placeholder="% share"
                      />
                      <span className="text-gray-600 font-medium">%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Error Display */}
              {hasError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-medium">
                    Total must add up to 100%. Current total: {total.toFixed(2)}%
                  </p>
                </div>
              )}

              {/* Zod Validation Error */}
              {errors?.step9?.distribution && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-medium">
                    {(errors.step9 as any).distribution.message}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
