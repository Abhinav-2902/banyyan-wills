"use client";

import { useFormContext, Controller, useWatch } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes } from "@/lib/constants/country-codes";

export function Step5WitnessDetails() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const witnessesKnown = useWatch({
    control,
    name: "step5.witnessesKnown",
    defaultValue: false,
  });

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
        <p className="text-sm text-gray-800">
          Witnesses are individuals who observe you signing your will and then sign it themselves to confirm its authenticity. 
          Most jurisdictions require at least two witnesses who are not beneficiaries of the will.
        </p>
      </div>

      {/* Toggle Section */}
      <section className="bg-white p-6 rounded-lg shadow-md border border-[#E6E1F4]">
        <div className="flex items-center space-x-3">
          <Controller
            control={control}
            name="step5.witnessesKnown"
            render={({ field }) => (
              <Checkbox
                id="witnessesKnown"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="h-5 w-5"
              />
            )}
          />
          <Label htmlFor="witnessesKnown" className="text-lg font-medium text-[#5E4B8C] cursor-pointer">
            I know who my witnesses will be
          </Label>
        </div>
        <p className="text-sm text-gray-600 mt-2 ml-8">
          Check this box if you have identified your witnesses and want to include their details now. 
          You can always add this information later.
        </p>
      </section>

      {witnessesKnown && (
        <>
          {/* Witness 1 Section */}
          <section className="bg-white p-8 rounded-lg shadow-md border border-[#E6E1F4]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#5E4B8C]">Witness 1</h2>
            </div>
            <div className="space-y-6">
              {/* Name and Aadhaar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="witness1Name" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Witness 1 Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1Name"
                    {...register("step5.witness1.name", { required: witnessesKnown })}
                    placeholder="Enter witness full name"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness1Aadhaar" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Aadhaar of Witness 1 (Optional)
                  </Label>
                  <Input
                    id="witness1Aadhaar"
                    {...register("step5.witness1.aadhaar")}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                  />
                  {errors.step5?.witness1?.aadhaar && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.aadhaar.message}</p>
                  )}
                </div>
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Phone Number of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Controller
                      control={control}
                      name="step5.witness1.phoneCountryCode"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || "+91"}>
                          <SelectTrigger className="w-[120px] bg-white border-[#8B7BB8] focus:ring-[#8B7BB8] focus:border-[#8B7BB8]">
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
                      id="witness1PhoneNumber"
                      {...register("step5.witness1.phoneNumber", { required: witnessesKnown })}
                      placeholder="Phone number"
                      className="flex-1 px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    />
                  </div>
                  {errors.step5?.witness1?.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.phoneNumber.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness1Email" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Email of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1Email"
                    type="email"
                    {...register("step5.witness1.email", { required: witnessesKnown })}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.email.message}</p>
                  )}
                </div>
              </div>

              {/* Father and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="witness1Father" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Father of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1Father"
                    {...register("step5.witness1.father", { required: witnessesKnown })}
                    placeholder="Enter father's name"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.father && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.father.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness1Address" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Address of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1Address"
                    {...register("step5.witness1.address", { required: witnessesKnown })}
                    placeholder="Enter full address"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.address.message}</p>
                  )}
                </div>
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="witness1City" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    City of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1City"
                    {...register("step5.witness1.city", { required: witnessesKnown })}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness1State" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    State of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1State"
                    {...register("step5.witness1.state", { required: witnessesKnown })}
                    placeholder="Enter state"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.state.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness1ZipCode" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Zip Code of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1ZipCode"
                    {...register("step5.witness1.zipCode", { required: witnessesKnown })}
                    placeholder="Enter zip code"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.zipCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.zipCode.message}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="witness1Country" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Country of Witness 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness1Country"
                    {...register("step5.witness1.country", { required: witnessesKnown })}
                    placeholder="Enter country"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness1?.country && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness1.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Witness 2 Section */}
          <section className="bg-white p-8 rounded-lg shadow-md border border-[#E6E1F4]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#5E4B8C]">Witness 2</h2>
            </div>
            <div className="space-y-6">
              {/* Name and Aadhaar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="witness2Name" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Witness 2 Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2Name"
                    {...register("step5.witness2.name", { required: witnessesKnown })}
                    placeholder="Enter witness full name"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness2Aadhaar" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Aadhaar of Witness 2 (Optional)
                  </Label>
                  <Input
                    id="witness2Aadhaar"
                    {...register("step5.witness2.aadhaar")}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                  />
                  {errors.step5?.witness2?.aadhaar && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.aadhaar.message}</p>
                  )}
                </div>
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Phone Number of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Controller
                      control={control}
                      name="step5.witness2.phoneCountryCode"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || "+91"}>
                          <SelectTrigger className="w-[120px] bg-white border-[#8B7BB8] focus:ring-[#8B7BB8] focus:border-[#8B7BB8]">
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
                      id="witness2PhoneNumber"
                      {...register("step5.witness2.phoneNumber", { required: witnessesKnown })}
                      placeholder="Phone number"
                      className="flex-1 px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    />
                  </div>
                  {errors.step5?.witness2?.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.phoneNumber.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness2Email" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Email of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2Email"
                    type="email"
                    {...register("step5.witness2.email", { required: witnessesKnown })}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.email.message}</p>
                  )}
                </div>
              </div>

              {/* Father and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="witness2Father" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Father of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2Father"
                    {...register("step5.witness2.father", { required: witnessesKnown })}
                    placeholder="Enter father's name"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.father && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.father.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness2Address" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Address of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2Address"
                    {...register("step5.witness2.address", { required: witnessesKnown })}
                    placeholder="Enter full address"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.address.message}</p>
                  )}
                </div>
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="witness2City" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    City of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2City"
                    {...register("step5.witness2.city", { required: witnessesKnown })}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness2State" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    State of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2State"
                    {...register("step5.witness2.state", { required: witnessesKnown })}
                    placeholder="Enter state"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.state.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="witness2ZipCode" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Zip Code of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2ZipCode"
                    {...register("step5.witness2.zipCode", { required: witnessesKnown })}
                    placeholder="Enter zip code"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.zipCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.zipCode.message}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="witness2Country" className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Country of Witness 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="witness2Country"
                    {...register("step5.witness2.country", { required: witnessesKnown })}
                    placeholder="Enter country"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                  {errors.step5?.witness2?.country && (
                    <p className="text-sm text-red-500 mt-1">{errors.step5.witness2.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
