"use client";

import { useFormContext, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
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
      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
        <p className="text-sm text-gray-800">
          <strong>Optional but Recommended:</strong> Designate a trusted person to make final decisions in case of any disputes regarding your assets or will. This person should be impartial and respected by your beneficiaries.
        </p>
      </div>

      {/* Dispute Resolver Section */}
      <section className="bg-white p-8 rounded-lg shadow-md border border-[#E6E1F4]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
            <Gavel className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#5E4B8C]">Dispute Resolver Details</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Provide details of the person who will resolve disputes. All fields are optional.
        </p>

        <div className="space-y-6">
          {/* Name and Relation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="disputeResolver" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Name of Dispute Resolver
              </Label>
              <Input
                id="disputeResolver"
                {...register("step4.disputeResolver")}
                placeholder="Enter full name (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolver && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolver.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="disputeResolverRelation" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Relation to You
              </Label>
              <Input
                id="disputeResolverRelation"
                {...register("step4.disputeResolverRelation")}
                placeholder="e.g., father, brother, friend (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverRelation && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverRelation.message}</p>
              )}
            </div>
          </div>

          {/* Father's Name and Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="disputeResolverFather" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Father&apos;s Name
              </Label>
              <Input
                id="disputeResolverFather"
                {...register("step4.disputeResolverFather")}
                placeholder="Father's full name (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverFather && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverFather.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="disputeResolverNationality" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Nationality
              </Label>
              <Controller
                control={control}
                name="step4.disputeResolverNationality"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-white border-[#8B7BB8] focus:ring-[#8B7BB8] focus:border-[#8B7BB8]">
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
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverNationality.message}</p>
              )}
            </div>
          </div>

          {/* Aadhaar and PAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="disputeResolverAadhaar" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Aadhaar Number
              </Label>
              <Input
                id="disputeResolverAadhaar"
                {...register("step4.disputeResolverAadhaar")}
                placeholder="12-digit Aadhaar number (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverAadhaar && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverAadhaar.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="disputeResolverPan" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                PAN
              </Label>
              <Input
                id="disputeResolverPan"
                {...register("step4.disputeResolverPan")}
                placeholder="PAN (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverPan && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverPan.message}</p>
              )}
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Phone Number
              </Label>
              <div className="flex gap-3">
                <Controller
                  control={control}
                  name="step4.disputeResolverPhoneCountryCode"
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
                  id="disputeResolverPhoneNumber"
                  type="tel"
                  {...register("step4.disputeResolverPhoneNumber")}
                  placeholder="Enter phone number (optional)"
                  className="flex-1 px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                />
              </div>
              {errors.step4?.disputeResolverPhoneNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverPhoneNumber.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="disputeResolverEmail" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Email Address
              </Label>
              <Input
                id="disputeResolverEmail"
                type="email"
                {...register("step4.disputeResolverEmail")}
                placeholder="Email address (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverEmail.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="disputeResolverAddress" className="block text-sm font-medium text-[#5E4B8C] mb-1">
              Address
            </Label>
            <textarea
              id="disputeResolverAddress"
              {...register("step4.disputeResolverAddress")}
              placeholder="Full address (optional)"
              rows={3}
              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
            />
            {errors.step4?.disputeResolverAddress && (
              <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverAddress.message}</p>
            )}
          </div>

          {/* City, State, Country, Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label htmlFor="disputeResolverCity" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                City
              </Label>
              <Input
                id="disputeResolverCity"
                {...register("step4.disputeResolverCity")}
                placeholder="City (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverCity && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverCity.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="disputeResolverState" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                State
              </Label>
              <Input
                id="disputeResolverState"
                {...register("step4.disputeResolverState")}
                placeholder="State (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverState && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverState.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="disputeResolverCountry" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Country
              </Label>
              <Input
                id="disputeResolverCountry"
                {...register("step4.disputeResolverCountry")}
                placeholder="Country (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverCountry && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverCountry.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="disputeResolverZipCode" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                Zip Code
              </Label>
              <Input
                id="disputeResolverZipCode"
                {...register("step4.disputeResolverZipCode")}
                placeholder="Zip code (optional)"
                className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
              />
              {errors.step4?.disputeResolverZipCode && (
                <p className="text-sm text-red-500 mt-1">{errors.step4.disputeResolverZipCode.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
