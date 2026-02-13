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
      <section className="bg-white p-8 rounded-lg shadow-md border border-[#E6E1F4]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#5E4B8C]">Will Executors</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Choose trusted people to manage your estate and carry out your instructions after your death.
          Having a backup executor ensures your will can still be executed if the primary executor is unable to serve.
        </p>

        {/* Professional Executor Service (light purple card with toggle) */}
        <div className="mb-8 bg-[#F8F7FC] p-6 rounded-lg border border-[#E6E1F4]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#5E4B8C]">Professional Executor Service</h3>
              <p className="text-sm text-gray-600">Let Banyyan Legacies handle your will execution professionally</p>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              )}
            />
          </div>
        </div>

        {/* Manual Executor Selection - formatted like screenshot */}
        {!useProfessionalExecutor && !watch("step3.useProfessionalExecutor") && (
          <>
            {/* Primary Will Executor */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#5E4B8C] mb-4">Primary Will Executor</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                {/* Row 1: Full Name | Relation to You */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="executor" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Full Name *
                    </Label>
                    <Input
                      id="executor"
                      {...register("step3.executor")}
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    />
                    {errors.step3?.executor && (
                      <p className="text-sm text-red-500 mt-1">{errors.step3.executor.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="executorRelationship" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Relation to You
                    </Label>
                    <Input
                      id="executorRelationship"
                      {...register("step3.executorRelationship")}
                      placeholder="e.g., Mother, Friend, Lawyer"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Row 2: Father's Name | Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="executorFatherName" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Father&apos;s Name
                    </Label>
                    <Input
                      id="executorFatherName"
                      {...register("step3.executorFatherName")}
                      placeholder="Enter father's name (optional)"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="executorDateOfBirth" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Date of Birth
                    </Label>
                    <Input
                      id="executorDateOfBirth"
                      type="date"
                      {...register("step3.executorDateOfBirth")}
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    />
                  </div>
                </div>

                {/* Row 3: Aadhaar Number | PAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="executorAadhaar" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Aadhaar Number
                    </Label>
                    <Input
                      id="executorAadhaar"
                      {...register("step3.executorAadhaar")}
                      placeholder="12-digit Aadhaar number (optional)"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="executorPan" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      PAN
                    </Label>
                    <Input
                      id="executorPan"
                      {...register("step3.executorPan")}
                      placeholder="PAN (optional)"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Row 4: Phone Number | Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="executorPhoneNumber" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Phone Number *
                    </Label>
                    <div className="flex gap-2">
                      <Controller
                        control={control}
                        name="step3.executorCountryCode"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "+91"}>
                            <SelectTrigger className="w-[120px] bg-white border-[#8B7BB8] focus:ring-[#8B7BB8] focus:border-[#8B7BB8]">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {countryCodes.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  {c.code} ({c.country})
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
                        className="flex-1 px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                      />
                    </div>
                    {errors.step3?.executorPhoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.step3.executorPhoneNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="executorEmail" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Email Address
                    </Label>
                    <Input
                      id="executorEmail"
                      type="email"
                      {...register("step3.executorEmail")}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Row 5: Address (multiline) */}
                <div className="mt-4">
                  <Label htmlFor="executorAddress" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Address
                  </Label>
                  <Textarea
                    id="executorAddress"
                    rows={3}
                    {...register("step3.executorAddress")}
                    placeholder="C4/94 Ground Floor, Safdarjung Development Area"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                  />
                </div>

                {/* Row 6: City | State | Country | Pin Code */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <Label htmlFor="executorCity" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      City
                    </Label>
                    <Input
                      id="executorCity"
                      {...register("step3.executorCity")}
                      placeholder="Delhi"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="executorState" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      State
                    </Label>
                    <Input
                      id="executorState"
                      {...register("step3.executorState")}
                      placeholder="Delhi"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="executorCountry" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Country
                    </Label>
                    <Input
                      id="executorCountry"
                      {...register("step3.executorCountry")}
                      placeholder="India"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="executorPinCode" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Pin Code
                    </Label>
                    <Input
                      id="executorPinCode"
                      {...register("step3.executorPinCode")}
                      placeholder="110016"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Backup Will Executor */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#5E4B8C] mb-4">Backup Will Executor</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                {/* Row 1: Full Name | Relation to You */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="backupExecutor" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Full Name *
                    </Label>
                    <Input
                      id="backupExecutor"
                      {...register("step3.backupExecutor")}
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    />
                    {errors.step3?.backupExecutor && (
                      <p className="text-sm text-red-500 mt-1">{errors.step3.backupExecutor.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="backupExecutorRelationship" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Relation to You
                    </Label>
                    <Input
                      id="backupExecutorRelationship"
                      {...register("step3.backupExecutorRelationship")}
                      placeholder="e.g., Father, Friend"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Row 2: Father's Name | Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="backupExecutorFatherName" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Father&apos;s Name
                    </Label>
                    <Input
                      id="backupExecutorFatherName"
                      {...register("step3.backupExecutorFatherName")}
                      placeholder="Enter father's name (optional)"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupExecutorDateOfBirth" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Date of Birth
                    </Label>
                    <Input
                      id="backupExecutorDateOfBirth"
                      type="date"
                      {...register("step3.backupExecutorDateOfBirth")}
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    />
                  </div>
                </div>

                {/* Row 3: Aadhaar Number | PAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="backupExecutorAadhaar" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Aadhaar Number
                    </Label>
                    <Input
                      id="backupExecutorAadhaar"
                      {...register("step3.backupExecutorAadhaar")}
                      placeholder="12-digit Aadhaar number (optional)"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupExecutorPan" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      PAN
                    </Label>
                    <Input
                      id="backupExecutorPan"
                      {...register("step3.backupExecutorPan")}
                      placeholder="PAN (optional)"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Row 4: Phone Number | Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="backupExecutorPhoneNumber" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Phone Number *
                    </Label>
                    <div className="flex gap-2">
                       <Controller
                        control={control}
                        name="step3.backupExecutorCountryCode"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "+91"}>
                            <SelectTrigger className="w-[120px] bg-white border-[#8B7BB8] focus:ring-[#8B7BB8] focus:border-[#8B7BB8]">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {countryCodes.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  {c.code} ({c.country})
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
                        className="flex-1 px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                      />
                    </div>
                    {errors.step3?.backupExecutorPhoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.step3.backupExecutorPhoneNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="backupExecutorEmail" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Email Address
                    </Label>
                    <Input
                      id="backupExecutorEmail"
                      type="email"
                      {...register("step3.backupExecutorEmail")}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Row 5: Address (multiline) */}
                <div className="mt-4">
                  <Label htmlFor="backupExecutorAddress" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Address
                  </Label>
                  <Textarea
                    id="backupExecutorAddress"
                    rows={3}
                    {...register("step3.backupExecutorAddress")}
                    placeholder="House/Flat No., Street Name"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                  />
                </div>

                {/* Row 6: City | State | Country | Pin Code */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <Label htmlFor="backupExecutorCity" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      City
                    </Label>
                    <Input
                      id="backupExecutorCity"
                      {...register("step3.backupExecutorCity")}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupExecutorState" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      State
                    </Label>
                    <Input
                      id="backupExecutorState"
                      {...register("step3.backupExecutorState")}
                      placeholder="State"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupExecutorCountry" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Country
                    </Label>
                    <Input
                      id="backupExecutorCountry"
                      {...register("step3.backupExecutorCountry")}
                      placeholder="Country"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupExecutorPinCode" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Pin Code
                    </Label>
                    <Input
                      id="backupExecutorPinCode"
                      {...register("step3.backupExecutorPinCode")}
                      placeholder="Pin Code"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Banyyan fallback executor opt-in */}
            <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Controller
                control={control}
                name="step3.banyyanFallbackExecutorOptIn"
                render={({ field }) => (
                  <label htmlFor="banyyanFallbackExecutorOptIn" className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      id="banyyanFallbackExecutorOptIn"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                    <span className="text-sm text-[#5E4B8C]">
                      If both the primary and backup executors are unable or unwilling to execute this Will for any reason, I authorize Banyyan Legacies to step in and execute the Will.
                    </span>
                  </label>
                )}
              />
            </div>

            {/* Important Notes – formatted per screenshot */}
            <div className="mb-6">
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                <h3 className="text-sm sm:text-base font-semibold text-[#5E4B8C] mb-1 tracking-[0.005em]">
                  Important Notes:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700 leading-6 marker:text-[#8B7BB8]">
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
