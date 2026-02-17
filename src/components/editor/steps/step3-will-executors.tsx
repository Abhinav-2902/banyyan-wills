"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes } from "@/lib/constants/country-codes";
import { FileText } from "lucide-react";

export function Step3WillExecutors() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const [useProfessionalExecutor, setUseProfessionalExecutor] = useState(false);

  return (
    <div className="space-y-6">
      {/* Outer card like the screenshot */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] rounded-xl shadow-lg shadow-rose-100">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Will Executors</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6 font-medium">
          Choose trusted people to manage your estate and carry out your instructions after your death.
          Having a backup executor ensures your will can still be executed if the primary executor is unable to serve.
        </p>

        {/* Professional Executor Service (light coral card with toggle) */}
        <div className="mb-8 bg-rose-50/30 p-6 rounded-2xl border border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Professional Executor Service</h3>
              <p className="text-sm text-gray-600 font-medium">Let Banyyan Legacies handle your will execution professionally</p>
            </div>
            <Controller
              control={control}
              name="step3.useProfessionalExecutor"
              render={({ field }) => (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      setUseProfessionalExecutor(e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF6B6B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B6B]"></div>
                </label>
              )}
            />
          </div>
        </div>

        {/* Manual Executor Selection - formatted like screenshot */}
        {!useProfessionalExecutor && !watch("step3.useProfessionalExecutor") && (
          <>
            {/* Primary Will Executor */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4 px-1">Primary Will Executor</h3>
              <div className="bg-[#F8F9FA]/50 p-6 rounded-2xl border border-gray-100">
                {/* Row 1: Full Name | Relation to You */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="executor" className="text-sm font-bold text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="executor"
                      {...register("step3.executor")}
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                    {errors.step3?.executor && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{errors.step3.executor.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorRelationship" className="text-sm font-bold text-gray-700">
                      Relation to You
                    </Label>
                    <Input
                      id="executorRelationship"
                      {...register("step3.executorRelationship")}
                      placeholder="e.g., Mother, Friend, Lawyer"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 2: Father's Name | Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="executorFatherName" className="text-sm font-bold text-gray-700">
                      Father&apos;s Name
                    </Label>
                    <Input
                      id="executorFatherName"
                      {...register("step3.executorFatherName")}
                      placeholder="Enter father's name (optional)"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorDateOfBirth" className="text-sm font-bold text-gray-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="executorDateOfBirth"
                      type="date"
                      {...register("step3.executorDateOfBirth")}
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 3: Aadhaar Number | PAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="executorAadhaar" className="text-sm font-bold text-gray-700">
                      Aadhaar Number
                    </Label>
                    <Input
                      id="executorAadhaar"
                      {...register("step3.executorAadhaar")}
                      placeholder="12-digit Aadhaar number (optional)"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorPan" className="text-sm font-bold text-gray-700">
                      PAN
                    </Label>
                    <Input
                      id="executorPan"
                      {...register("step3.executorPan")}
                      placeholder="PAN (optional)"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 4: Phone Number | Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="executorPhoneNumber" className="text-sm font-bold text-gray-700">
                      Phone Number *
                    </Label>
                    <div className="flex gap-2">
                      <Controller
                        control={control}
                        name="step3.executorCountryCode"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "+91"}>
                            <SelectTrigger className="w-[100px] bg-white border-gray-300 focus:ring-[#FF6B6B] focus:border-[#FF6B6B]">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {countryCodes.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  {c.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        id="executorPhoneNumber"
                        {...register("step3.executorPhoneNumber")}
                        placeholder="Phone number"
                        className="flex-1 focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                      />
                    </div>
                    {errors.step3?.executorPhoneNumber && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{errors.step3.executorPhoneNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorEmail" className="text-sm font-bold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="executorEmail"
                      type="email"
                      {...register("step3.executorEmail")}
                      placeholder="name@example.com"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 5: Address (multiline) */}
                <div className="mt-6 space-y-2">
                  <Label htmlFor="executorAddress" className="text-sm font-bold text-gray-700">
                    Address
                  </Label>
                  <Textarea
                    id="executorAddress"
                    rows={3}
                    {...register("step3.executorAddress")}
                    placeholder="Residential address"
                    className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                  />
                </div>

                {/* Row 6: City | State | Country | Pin Code */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="executorCity" className="text-sm font-bold text-gray-700">City</Label>
                    <Input id="executorCity" {...register("step3.executorCity")} placeholder="City" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorState" className="text-sm font-bold text-gray-700">State</Label>
                    <Input id="executorState" {...register("step3.executorState")} placeholder="State" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorCountry" className="text-sm font-bold text-gray-700">Country</Label>
                    <Input id="executorCountry" {...register("step3.executorCountry")} placeholder="Country" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorPinCode" className="text-sm font-bold text-gray-700">Pin Code</Label>
                    <Input id="executorPinCode" {...register("step3.executorPinCode")} placeholder="Pin Code" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                </div>
              </div>
            </div>


            {/* Backup Will Executor */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4 px-1">Backup Will Executor</h3>
              <div className="bg-[#F8F9FA]/50 p-6 rounded-2xl border border-gray-100">
                {/* Row 1: Full Name | Relation to You */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutor" className="text-sm font-bold text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="backupExecutor"
                      {...register("step3.backupExecutor")}
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                    {errors.step3?.backupExecutor && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{errors.step3.backupExecutor.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorRelationship" className="text-sm font-bold text-gray-700">
                      Relation to You
                    </Label>
                    <Input
                      id="backupExecutorRelationship"
                      {...register("step3.backupExecutorRelationship")}
                      placeholder="e.g., Father, Friend"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 2: Father's Name | Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorFatherName" className="text-sm font-bold text-gray-700">
                      Father&apos;s Name
                    </Label>
                    <Input
                      id="backupExecutorFatherName"
                      {...register("step3.backupExecutorFatherName")}
                      placeholder="Enter father's name (optional)"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorDateOfBirth" className="text-sm font-bold text-gray-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="backupExecutorDateOfBirth"
                      type="date"
                      {...register("step3.backupExecutorDateOfBirth")}
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 3: Aadhaar Number | PAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorAadhaar" className="text-sm font-bold text-gray-700">
                      Aadhaar Number
                    </Label>
                    <Input
                      id="backupExecutorAadhaar"
                      {...register("step3.backupExecutorAadhaar")}
                      placeholder="12-digit Aadhaar number (optional)"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorPan" className="text-sm font-bold text-gray-700">
                      PAN
                    </Label>
                    <Input
                      id="backupExecutorPan"
                      {...register("step3.backupExecutorPan")}
                      placeholder="PAN (optional)"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 4: Phone Number | Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorPhoneNumber" className="text-sm font-bold text-gray-700">
                      Phone Number *
                    </Label>
                    <div className="flex gap-2">
                       <Controller
                        control={control}
                        name="step3.backupExecutorCountryCode"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "+91"}>
                            <SelectTrigger className="w-[100px] bg-white border-gray-300 focus:ring-[#FF6B6B] focus:border-[#FF6B6B]">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {countryCodes.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  {c.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        id="backupExecutorPhoneNumber"
                        {...register("step3.backupExecutorPhoneNumber")}
                        placeholder="Phone number"
                        className="flex-1 focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                      />
                    </div>
                    {errors.step3?.backupExecutorPhoneNumber && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{errors.step3.backupExecutorPhoneNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorEmail" className="text-sm font-bold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="backupExecutorEmail"
                      type="email"
                      {...register("step3.backupExecutorEmail")}
                      placeholder="name@example.com"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Row 5: Address (multiline) */}
                <div className="mt-6 space-y-2">
                  <Label htmlFor="backupExecutorAddress" className="text-sm font-bold text-gray-700">
                    Address
                  </Label>
                  <Textarea
                    id="backupExecutorAddress"
                    rows={3}
                    {...register("step3.backupExecutorAddress")}
                    placeholder="Residential address"
                    className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                  />
                </div>

                {/* Row 6: City | State | Country | Pin Code */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorCity" className="text-sm font-bold text-gray-700">City</Label>
                    <Input id="backupExecutorCity" {...register("step3.backupExecutorCity")} placeholder="City" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorState" className="text-sm font-bold text-gray-700">State</Label>
                    <Input id="backupExecutorState" {...register("step3.backupExecutorState")} placeholder="State" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorCountry" className="text-sm font-bold text-gray-700">Country</Label>
                    <Input id="backupExecutorCountry" {...register("step3.backupExecutorCountry")} placeholder="Country" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupExecutorPinCode" className="text-sm font-bold text-gray-700">Pin Code</Label>
                    <Input id="backupExecutorPinCode" {...register("step3.backupExecutorPinCode")} placeholder="Pin Code" className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Banyyan fallback executor opt-in */}
            <div className="mb-8 p-6 bg-rose-50/30 border border-rose-100 rounded-2xl">
              <Controller
                control={control}
                name="step3.banyyanFallbackExecutorOptIn"
                render={({ field }) => (
                  <label htmlFor="banyyanFallbackExecutorOptIn" className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      id="banyyanFallbackExecutorOptIn"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 data-[state=checked]:bg-[#FF6B6B] data-[state=checked]:border-[#FF6B6B]"
                    />
                    <span className="text-sm text-gray-700 font-medium leading-relaxed">
                      If both the primary and backup executors are unable or unwilling to execute this Will for any reason, I authorize Banyyan Legacies to step in and execute the Will.
                    </span>
                  </label>
                )}
              />
            </div>

            {/* Important Notes */}
            <div className="mb-0">
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
                <h3 className="text-base font-bold text-amber-900 mb-3 tracking-tight">
                  Important Notes:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-amber-800 leading-relaxed font-medium">
                  <li>Your executor should be someone you trust completely and who is capable of handling financial and legal matters</li>
                  <li>Consider choosing someone younger than you who is likely to outlive you</li>
                  <li>It&apos;s recommended to discuss this responsibility with your chosen executors beforehand</li>
                  <li>Your backup executor will only serve if your primary executor cannot or will not serve</li>
                </ul>
              </div>
            </div>
          </>
        )}

      </section>
    </div>
  );
}
