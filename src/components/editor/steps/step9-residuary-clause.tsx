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
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Residuary Clause</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">Distribute remaining assets</p>
            </div>
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
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggleSelectAllOfType('beneficiary')}
                    className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider"
                  >
                    {areAllOfTypeSelected('beneficiary') ? 'Deselect All Beneficiaries' : 'Select All Beneficiaries'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggleSelectAllOfType('charity')}
                    className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider"
                  >
                    {areAllOfTypeSelected('charity') ? 'Deselect All Charities' : 'Select All Charities'}
                  </Button>
                </div>

                <Button
                  type="button"
                  onClick={handleDistributeEvenly}
                  className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-lg shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98] px-6"
                >
                  Distribute Evenly
                </Button>
              </div>

              {/* Recipients Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipients.map((recipient: any) => {
                  const isSelected = selectedRecipients.includes(recipient.id);
                  return (
                    <div 
                      key={recipient.id} 
                      className={`relative group rounded-2xl p-6 transition-all border-2 ${
                        isSelected 
                          ? 'bg-rose-50/30 border-rose-200 shadow-md shadow-rose-100' 
                          : 'bg-white border-gray-100 hover:border-rose-100 hover:shadow-lg hover:shadow-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl transition-colors ${
                            isSelected ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleToggleRecipient(recipient.id, e.target.checked)}
                              className="w-5 h-5 cursor-pointer opacity-0 absolute"
                              id={`check-${recipient.id}`}
                            />
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                              {isSelected ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              )}
                            </svg>
                          </div>
                          <div>
                            <label htmlFor={`check-${recipient.id}`} className="font-bold text-gray-900 cursor-pointer block">
                              {recipient.name}
                            </label>
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                              {recipient.relation || 'Charity'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="relative flex-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={distribution[recipient.id] ?? ''}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                if (rawValue === "") {
                                  setValue(`step9.distribution.${recipient.id}`, 0);
                                } else {
                                  const numValue = parseFloat(rawValue);
                                  const limitedValue = Math.max(0, Math.min(100, numValue));
                                  // Round to 2 decimal places
                                  const roundedValue = Math.round(limitedValue * 100) / 100;
                                  setValue(`step9.distribution.${recipient.id}`, roundedValue);
                                }
                              }}
                              className="w-full pl-3 pr-8 py-2 bg-white border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] font-bold text-rose-600"
                              placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-rose-500">%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Error Display */}
              {(hasError || errors?.step9?.distribution) && (
                <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4">
                  <div className="w-1.5 h-12 bg-rose-500 rounded-full" />
                  <div>
                    {hasError && (
                      <p className="text-rose-600 font-bold">
                        Total must add up to 100%. Current total: {total.toFixed(2)}%
                      </p>
                    )}
                    {errors?.step9?.distribution && (
                      <p className="text-rose-600 font-bold">
                        {(errors.step9 as any).distribution.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
