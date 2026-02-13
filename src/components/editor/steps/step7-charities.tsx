"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Plus, Trash2, Phone } from "lucide-react";

export function Step7Charities() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step7.charities",
  });

  const addCharity = () => {
    append({
      name: "",
      identificationNumber: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    });
  };

  const removeCharity = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
        <p className="text-sm text-gray-800">
          <strong>Optional:</strong> Specify charitable organizations you&apos;d like to support. You can add multiple charities or skip this step entirely if you don&apos;t wish to make charitable donations.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No charities added yet</p>
          <button
            type="button"
            onClick={addCharity}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BA7] hover:to-[#3A1F61] transition-all"
          >
            <Plus className="h-5 w-5" />
            Add Your First Charity
          </button>
        </div>
      ) : (
        <>
          {fields.map((field, index) => (
            <section key={field.id} className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#5E4B8C]">Charity {index + 1}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => removeCharity(index)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="space-y-6">
                {/* Charity Name and Identification Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor={`charity-${index}-name`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Charity Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`charity-${index}-name`}
                      {...register(`step7.charities.${index}.name`)}
                      placeholder="Enter charity name"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    />
                    {errors.step7?.charities?.[index]?.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.step7.charities[index]?.name?.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`charity-${index}-id`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Identification Number
                    </Label>
                    <Input
                      id={`charity-${index}-id`}
                      {...register(`step7.charities.${index}.identificationNumber`)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor={`charity-${index}-phone`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id={`charity-${index}-phone`}
                      type="tel"
                      {...register(`step7.charities.${index}.phoneNumber`)}
                      placeholder="Optional"
                      className="w-full pl-10 pr-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor={`charity-${index}-address`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Address
                  </Label>
                  <Input
                    id={`charity-${index}-address`}
                    {...register(`step7.charities.${index}.address`)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor={`charity-${index}-city`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      City
                    </Label>
                    <Input
                      id={`charity-${index}-city`}
                      {...register(`step7.charities.${index}.city`)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`charity-${index}-state`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      State
                    </Label>
                    <Input
                      id={`charity-${index}-state`}
                      {...register(`step7.charities.${index}.state`)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Country and Zip Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor={`charity-${index}-country`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Country
                    </Label>
                    <Input
                      id={`charity-${index}-country`}
                      {...register(`step7.charities.${index}.country`)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`charity-${index}-zip`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                      Zip Code
                    </Label>
                    <Input
                      id={`charity-${index}-zip`}
                      {...register(`step7.charities.${index}.zipCode`)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Add Another Charity Button */}
          <button
            type="button"
            onClick={addCharity}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            <Plus className="h-5 w-5" />
            Add Another Charity
          </button>
        </>
      )}
    </div>
  );
}
