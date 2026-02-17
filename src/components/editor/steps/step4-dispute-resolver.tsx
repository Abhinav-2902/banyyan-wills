"use client";

import { useFormContext, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gavel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes } from "@/lib/constants/country-codes";
import { allNationalities } from "@/lib/constants/nationality-constants";

export function Step4DisputeResolver() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-xl">
        <p className="text-sm text-gray-700 font-medium">
          <strong>Optional but Recommended:</strong> Designate a trusted person to make final decisions in case of any disputes regarding your assets or will. This person should be impartial and respected by your beneficiaries.
        </p>
      </div>

      {/* Dispute Resolver Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] rounded-xl shadow-lg shadow-rose-100">
            <Gavel className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dispute Resolver Details</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6 font-medium">
          Provide details of the person who will resolve disputes. All fields are optional.
        </p>

        <div className="space-y-6">
          {/* Name and Relation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="disputeResolver" className="text-sm font-bold text-gray-700">
                Name of Dispute Resolver
              </Label>
              <Input
                id="disputeResolver"
                {...register("step4.disputeResolver")}
                placeholder="Enter full name (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolver && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolver.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeResolverRelation" className="text-sm font-bold text-gray-700">
                Relation to You
              </Label>
              <Input
                id="disputeResolverRelation"
                {...register("step4.disputeResolverRelation")}
                placeholder="e.g., father, brother, friend (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverRelation && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverRelation.message}</p>
              )}
            </div>
          </div>

          {/* Father's Name and Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="disputeResolverFather" className="text-sm font-bold text-gray-700">
                Father&apos;s Name
              </Label>
              <Input
                id="disputeResolverFather"
                {...register("step4.disputeResolverFather")}
                placeholder="Father's full name (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverFather && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverFather.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeResolverNationality" className="text-sm font-bold text-gray-700">
                Nationality
              </Label>
              <Controller
                control={control}
                name="step4.disputeResolverNationality"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-[#FF6B6B] focus:border-[#FF6B6B]">
                      <SelectValue placeholder="Select nationality (optional)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {allNationalities.map((nationality: string) => (
                        <SelectItem key={nationality} value={nationality}>
                          {nationality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.step4?.disputeResolverNationality && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverNationality.message}</p>
              )}
            </div>
          </div>

          {/* Aadhaar and PAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="disputeResolverAadhaar" className="text-sm font-bold text-gray-700">
                Aadhaar Number
              </Label>
              <Input
                id="disputeResolverAadhaar"
                {...register("step4.disputeResolverAadhaar")}
                placeholder="12-digit Aadhaar number (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverAadhaar && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverAadhaar.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeResolverPan" className="text-sm font-bold text-gray-700">
                PAN
              </Label>
              <Input
                id="disputeResolverPan"
                {...register("step4.disputeResolverPan")}
                placeholder="PAN (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverPan && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverPan.message}</p>
              )}
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">
                Phone Number
              </Label>
              <div className="flex gap-3">
                <Controller
                  control={control}
                  name="step4.disputeResolverPhoneCountryCode"
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
                  id="disputeResolverPhoneNumber"
                  type="tel"
                  {...register("step4.disputeResolverPhoneNumber")}
                  placeholder="Enter phone number (optional)"
                  className="flex-1 focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
              </div>
              {errors.step4?.disputeResolverPhoneNumber && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverPhoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="disputeResolverEmail" className="text-sm font-bold text-gray-700">
                Email Address
              </Label>
              <Input
                id="disputeResolverEmail"
                type="email"
                {...register("step4.disputeResolverEmail")}
                placeholder="Email address (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverEmail && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverEmail.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="disputeResolverAddress" className="text-sm font-bold text-gray-700">
              Address
            </Label>
            <Textarea
              id="disputeResolverAddress"
              {...register("step4.disputeResolverAddress")}
              placeholder="Full address (optional)"
              rows={3}
              className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
            />
            {errors.step4?.disputeResolverAddress && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverAddress.message}</p>
            )}
          </div>

          {/* City, State, Country, Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="disputeResolverCity" className="text-sm font-bold text-gray-700">
                City
              </Label>
              <Input
                id="disputeResolverCity"
                {...register("step4.disputeResolverCity")}
                placeholder="City (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverCity && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverCity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeResolverState" className="text-sm font-bold text-gray-700">
                State
              </Label>
              <Input
                id="disputeResolverState"
                {...register("step4.disputeResolverState")}
                placeholder="State (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverState && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverState.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeResolverCountry" className="text-sm font-bold text-gray-700">
                Country
              </Label>
              <Input
                id="disputeResolverCountry"
                {...register("step4.disputeResolverCountry")}
                placeholder="Country (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverCountry && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverCountry.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeResolverZipCode" className="text-sm font-bold text-gray-700">
                Zip Code
              </Label>
              <Input
                id="disputeResolverZipCode"
                {...register("step4.disputeResolverZipCode")}
                placeholder="Zip code (optional)"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors.step4?.disputeResolverZipCode && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errors.step4.disputeResolverZipCode.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
