"use client";

import { useEffect } from "react";
import { useFormContext, useFieldArray, useWatch, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, User, AlertCircle } from "lucide-react";

export function Step4Beneficiaries() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step4.beneficiaries",
  });

  const beneficiaries = useWatch({
    control,
    name: "step4.beneficiaries",
  });

  // Calculate total percentage
  const totalPercentage = beneficiaries?.reduce((sum, b) => sum + (Number(b.sharePercentage) || 0), 0) || 0;

  // Update totalPercentage in form state for validation
  useEffect(() => {
    setValue("step4.totalPercentage", totalPercentage, { 
      shouldValidate: true,
      shouldDirty: true 
    });
  }, [totalPercentage, setValue]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Beneficiaries & Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Distribution Type Selection */}
          <div className="space-y-2">
            <Label>Distribution Type</Label>
            <Controller
              control={control}
              name="step4.distributionType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Distribution Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equal distribution">Equal distribution</SelectItem>
                    <SelectItem value="Percentage-based">Percentage-based</SelectItem>
                    <SelectItem value="Specific asset allocation">Specific asset allocation (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.step4?.distributionType && (
              <p className="text-sm text-destructive">{errors.step4.distributionType.message}</p>
            )}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative overflow-hidden bg-slate-50 border-slate-200">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" /> Beneficiary {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label>Full Name <span className="text-red-500">*</span></Label>
                      <Input 
                        {...register(`step4.beneficiaries.${index}.fullName`)} 
                        placeholder="Beneficiary's Name" 
                      />
                      {errors.step4?.beneficiaries?.[index]?.fullName && (
                        <p className="text-sm text-destructive">{errors.step4.beneficiaries[index]?.fullName?.message}</p>
                      )}
                    </div>

                    {/* Relationship */}
                    <div className="space-y-2">
                      <Label>Relationship <span className="text-red-500">*</span></Label>
                      <Controller
                        control={control}
                        name={`step4.beneficiaries.${index}.relationship`}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Son">Son</SelectItem>
                              <SelectItem value="Daughter">Daughter</SelectItem>
                              <SelectItem value="Father">Father</SelectItem>
                              <SelectItem value="Mother">Mother</SelectItem>
                              <SelectItem value="Brother">Brother</SelectItem>
                              <SelectItem value="Sister">Sister</SelectItem>
                              <SelectItem value="Friend">Friend</SelectItem>
                              <SelectItem value="Charity/Trust">Charity/Trust</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.step4?.beneficiaries?.[index]?.relationship && (
                        <p className="text-sm text-destructive">{errors.step4.beneficiaries[index]?.relationship?.message}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Controller
                        control={control}
                        name={`step4.beneficiaries.${index}.gender`}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input type="date" {...register(`step4.beneficiaries.${index}.dateOfBirth`)} />
                    </div>

                    {/* Share Percentage */}
                    <div className="space-y-2 bg-blue-50/50 p-2 rounded-md border border-blue-100">
                      <Label className="text-blue-900">Share Percentage (%) <span className="text-red-500">*</span></Label>
                      <Input 
                        type="number" 
                        min={0} 
                        max={100} 
                        {...register(`step4.beneficiaries.${index}.sharePercentage`, { valueAsNumber: true })} 
                        className="bg-white"
                      />
                       {errors.step4?.beneficiaries?.[index]?.sharePercentage && (
                        <p className="text-sm text-destructive">{errors.step4.beneficiaries[index]?.sharePercentage?.message}</p>
                      )}
                    </div>

                    {/* PAN Number */}
                    <div className="space-y-2">
                      <Label>PAN (Optional)</Label>
                      <Input 
                        {...register(`step4.beneficiaries.${index}.panNumber`)} 
                        placeholder="ABCDE1234F" 
                        className="uppercase"
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address <span className="text-red-500">*</span></Label>
                      <Input 
                        {...register(`step4.beneficiaries.${index}.address.addressLine1`)} 
                        placeholder="Address Line 1" 
                      />
                      {errors.step4?.beneficiaries?.[index]?.address?.addressLine1 && (
                        <p className="text-sm text-destructive">{errors.step4.beneficiaries[index]?.address?.addressLine1?.message}</p>
                      )}
                    </div>
                    
                    {/* City & State & Pin */}
                    <div className="grid grid-cols-3 gap-2 md:col-span-2">
                        <div className="space-y-2">
                            <Input placeholder="City" {...register(`step4.beneficiaries.${index}.address.city`)} />
                             {errors.step4?.beneficiaries?.[index]?.address?.city && (
                                <p className="text-xs text-destructive">{errors.step4.beneficiaries[index]?.address?.city?.message}</p>
                              )}
                        </div>
                        <div className="space-y-2">
                             <Input placeholder="State" {...register(`step4.beneficiaries.${index}.address.state`)} />
                             {errors.step4?.beneficiaries?.[index]?.address?.state && (
                                <p className="text-xs text-destructive">{errors.step4.beneficiaries[index]?.address?.state?.message}</p>
                              )}
                        </div>
                        <div className="space-y-2">
                             <Input placeholder="PIN Code" {...register(`step4.beneficiaries.${index}.address.pinCode`)} maxLength={6} />
                              {errors.step4?.beneficiaries?.[index]?.address?.pinCode && (
                                <p className="text-xs text-destructive">{errors.step4.beneficiaries[index]?.address?.pinCode?.message}</p>
                              )}
                        </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({
                fullName: "",
                relationship: "Other",
                gender: "Male",
                sharePercentage: 0,
                panNumber: "",
                aadhaarNumber: "",
                address: {
                    addressLine1: "",
                    city: "",
                    state: "",
                    pinCode: ""
                }
              })}
              className="w-full border-dashed"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Beneficiary
            </Button>
            
            {fields.length === 0 && (
                <p className="text-sm text-destructive text-center">Please add at least one beneficiary.</p>
            )}

            {/* Total Percentage Indicator */}
            <div className={`p-4 rounded-lg flex items-center justify-between border ${
                totalPercentage === 100 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}>
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Total Share Allocation</span>
                </div>
                <span className="text-xl font-bold">{totalPercentage}%</span>
            </div>
             {errors.step4?.totalPercentage && (
                <p className="text-sm text-destructive text-center font-medium mt-2">
                    Total allocation must equal exactly 100%. Ex: 50% + 50%
                </p>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
