"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { WillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Plus } from "lucide-react";

const ASSET_TYPES = [
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "BANK_ACCOUNT", label: "Bank Account" },
  { value: "STOCK", label: "Stocks/Securities" },
  { value: "VEHICLE", label: "Vehicle" },
  { value: "OTHER", label: "Other" },
] as const;

/**
 * Assets step component for the Will Editor
 * Handles dynamic array of assets with add/remove functionality
 */
export function AssetsStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<WillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });

  const handleAddAsset = () => {
    append({
      type: "OTHER",
      description: "",
      estimatedValue: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Assets</h2>
        <p className="text-sm text-gray-600 mt-1">
          List all assets you wish to include in your will
        </p>
      </div>

      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No assets added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click the button below to add your first asset
            </p>
          </div>
        )}

        {fields.map((field, index) => (
          <Card key={field.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Asset #{index + 1}
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

              {/* Asset Type */}
              <div className="space-y-2">
                <Label htmlFor={`assets.${index}.type`}>Asset Type *</Label>
                <Select
                  defaultValue={field.type}
                  onValueChange={(value: string) => {
                    // Update the form value manually
                    const event = {
                      target: { value, name: `assets.${index}.type` },
                    };
                    register(`assets.${index}.type`).onChange(event);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assets?.[index]?.type && (
                  <p className="text-sm text-red-600">
                    {errors.assets[index]?.type?.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`assets.${index}.description`}>
                  Description *
                </Label>
                <textarea
                  id={`assets.${index}.description`}
                  {...register(`assets.${index}.description`)}
                  placeholder="Describe this asset in detail (minimum 10 characters)"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal ${
                    errors.assets?.[index]?.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.assets?.[index]?.description && (
                  <p className="text-sm text-red-600">
                    {errors.assets[index]?.description?.message}
                  </p>
                )}
              </div>

              {/* Estimated Value */}
              <div className="space-y-2">
                <Label htmlFor={`assets.${index}.estimatedValue`}>
                  Estimated Value (USD) *
                </Label>
                <Input
                  id={`assets.${index}.estimatedValue`}
                  type="number"
                  step="0.01"
                  {...register(`assets.${index}.estimatedValue`, {
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                  className={
                    errors.assets?.[index]?.estimatedValue
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.assets?.[index]?.estimatedValue && (
                  <p className="text-sm text-red-600">
                    {errors.assets[index]?.estimatedValue?.message}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddAsset}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>
    </div>
  );
}
