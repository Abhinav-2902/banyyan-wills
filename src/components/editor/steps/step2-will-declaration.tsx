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
      <div className="mb-6 p-4 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-lg">
        <p className="text-sm text-gray-700">
          Provide the essential details for your will document. These entries will be used directly in your legal will, so ensure the information is accurate and up to date.
        </p>
      </div>

      {/* Declaration Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] rounded-xl shadow-lg shadow-rose-100">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Declaration</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Make sure you are creating this will voluntarily and understand that confirming both statements below will revoke any previous wills.
        </p>
        <div className="space-y-4">
          <Controller
            control={control}
            name="step2.soundMind"
            render={({ field }) => (
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-gray-100 p-4 shadow-xs hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="soundMind"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1 data-[state=checked]:bg-[#FF6B6B] data-[state=checked]:border-[#FF6B6B]"
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="soundMind"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700"
                  >
                    I declare I am of sound mind and making this document of my own free will.
                  </Label>
                  {errors.step2?.soundMind && (
                    <p className="text-sm text-red-500 pt-1 font-medium">{errors.step2.soundMind.message}</p>
                  )}
                </div>
              </div>
            )}
          />

          <Controller
            control={control}
            name="step2.revokePriorWills"
            render={({ field }) => (
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-gray-100 p-4 shadow-xs hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="revokePriorWills"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1 data-[state=checked]:bg-[#FF6B6B] data-[state=checked]:border-[#FF6B6B]"
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="revokePriorWills"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700"
                  >
                    I revoke all prior Wills.
                  </Label>
                  {errors.step2?.revokePriorWills && (
                    <p className="text-sm text-red-500 pt-1 font-medium">{errors.step2.revokePriorWills.message}</p>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* Signing Details Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] rounded-xl shadow-lg shadow-rose-100">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Signing Details</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Provide when and where you will sign the will. These details help validate the document.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="signingDate" className="text-sm font-bold text-gray-700">
                Date of Signing
              </Label>
              <Input
                id="signingDate"
                type="date"
                {...register("step2.signingDate")}
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step2?.signingDate && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step2.signingDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signingPlace" className="text-sm font-bold text-gray-700">
                Place of Signing
              </Label>
              <Input
                id="signingPlace"
                placeholder="e.g., Mumbai, New Delhi"
                {...register("step2.signingPlace")}
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step2?.signingPlace && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step2.signingPlace.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
