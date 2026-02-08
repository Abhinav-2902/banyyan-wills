"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { WillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash, Plus } from "lucide-react";

/**
 * Beneficiaries step component for the Will Editor
 * Handles dynamic array of beneficiaries with percentage allocation
 */
export function BeneficiariesStep() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<WillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiaries",
  });

  const beneficiaries = watch("beneficiaries");
  const totalPercentage = beneficiaries?.reduce(
    (sum, b) => sum + (Number(b.percentage) || 0),
    0
  ) || 0;

  const handleAddBeneficiary = () => {
    append({
      fullName: "",
      relationship: "",
      percentage: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Beneficiaries</h2>
        <p className="text-sm text-gray-600 mt-1">
          Specify who will receive your assets and their allocation percentages
        </p>
      </div>

      {/* Total Percentage Indicator */}
      <div className={`p-4 rounded-lg border-2 ${
        totalPercentage === 100
          ? "bg-green-50 border-green-500"
          : totalPercentage > 100
          ? "bg-red-50 border-red-500"
          : "bg-yellow-50 border-yellow-500"
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total Allocation:</span>
          <span className={`text-lg font-bold ${
            totalPercentage === 100
              ? "text-green-700"
              : totalPercentage > 100
              ? "text-red-700"
              : "text-yellow-700"
          }`}>
            {totalPercentage}%
          </span>
        </div>
        {totalPercentage !== 100 && (
          <p className="text-sm mt-1 text-gray-600">
            {totalPercentage < 100
              ? `You need to allocate ${100 - totalPercentage}% more`
              : `You've over-allocated by ${totalPercentage - 100}%`}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No beneficiaries added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click the button below to add your first beneficiary
            </p>
          </div>
        )}

        {fields.map((field, index) => (
          <Card key={field.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Beneficiary #{index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor={`beneficiaries.${index}.fullName`}>
                  Full Name *
                </Label>
                <Input
                  id={`beneficiaries.${index}.fullName`}
                  {...register(`beneficiaries.${index}.fullName`)}
                  placeholder="Enter beneficiary's full name"
                  className={
                    errors.beneficiaries?.[index]?.fullName
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.beneficiaries?.[index]?.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.beneficiaries[index]?.fullName?.message}
                  </p>
                )}
              </div>

              {/* Relationship */}
              <div className="space-y-2">
                <Label htmlFor={`beneficiaries.${index}.relationship`}>
                  Relationship *
                </Label>
                <Input
                  id={`beneficiaries.${index}.relationship`}
                  {...register(`beneficiaries.${index}.relationship`)}
                  placeholder="e.g., Spouse, Child, Friend"
                  className={
                    errors.beneficiaries?.[index]?.relationship
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.beneficiaries?.[index]?.relationship && (
                  <p className="text-sm text-red-600">
                    {errors.beneficiaries[index]?.relationship?.message}
                  </p>
                )}
              </div>

              {/* Percentage */}
              <div className="space-y-2">
                <Label htmlFor={`beneficiaries.${index}.percentage`}>
                  Allocation Percentage (%) *
                </Label>
                <Input
                  id={`beneficiaries.${index}.percentage`}
                  type="number"
                  min="1"
                  max="100"
                  {...register(`beneficiaries.${index}.percentage`, {
                    valueAsNumber: true,
                  })}
                  placeholder="0"
                  className={
                    errors.beneficiaries?.[index]?.percentage
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.beneficiaries?.[index]?.percentage && (
                  <p className="text-sm text-red-600">
                    {errors.beneficiaries[index]?.percentage?.message}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddBeneficiary}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Beneficiary
        </Button>
      </div>

      {/* Global beneficiaries error (total must equal 100%) */}
      {errors.beneficiaries && typeof errors.beneficiaries.message === "string" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">{errors.beneficiaries.message}</p>
        </div>
      )}
    </div>
  );
}
