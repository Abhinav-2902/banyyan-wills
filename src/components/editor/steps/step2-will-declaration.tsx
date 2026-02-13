"use client";

import { useFormContext, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, FileText } from "lucide-react";

export function Step2WillDeclaration() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  return (
    <div className="space-y-6">
      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
        <p className="text-sm text-gray-800">
          Provide the essential details for your will document. These entries will be used directly in your legal will, so ensure the information is accurate and up to date.
        </p>
      </div>

      {/* Declaration Section */}
      <section className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#5E4B8C]">Declaration</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Make sure you are creating this will voluntarily and understand that confirming both statements below will revoke any previous wills.
        </p>
        <div className="space-y-4">
          <Controller
            control={control}
            name="step2.soundMind"
            render={({ field }) => (
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="soundMind"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="soundMind"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#5E4B8C]"
                  >
                    I declare I am of sound mind and making this document of my own free will.
                  </Label>
                  {errors.step2?.soundMind && (
                    <p className="text-sm text-red-500 pt-1">{errors.step2.soundMind.message}</p>
                  )}
                </div>
              </div>
            )}
          />

          <Controller
            control={control}
            name="step2.revokePriorWills"
            render={({ field }) => (
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="revokePriorWills"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="revokePriorWills"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#5E4B8C]"
                  >
                    I revoke all prior Wills.
                  </Label>
                  {errors.step2?.revokePriorWills && (
                    <p className="text-sm text-red-500 pt-1">{errors.step2.revokePriorWills.message}</p>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* Signing Details Section */}
      <section className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#5E4B8C]">Signing Details</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Provide when and where you will sign the will. These details help validate the document.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="signingDate" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Date of Signing
              </Label>
              <Input
                id="signingDate"
                type="date"
                {...register("step2.signingDate")}
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
              />
              {errors.step2?.signingDate && (
                <p className="text-sm text-red-500 mt-1">{errors.step2.signingDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="signingPlace" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Place of Signing
              </Label>
              <Input
                id="signingPlace"
                placeholder="e.g., Mumbai, New Delhi"
                {...register("step2.signingPlace")}
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
              />
              {errors.step2?.signingPlace && (
                <p className="text-sm text-red-500 mt-1">{errors.step2.signingPlace.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
