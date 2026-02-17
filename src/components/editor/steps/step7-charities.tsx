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
      <div className="mb-6 p-4 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-xl">
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          <strong className="text-rose-600">Optional:</strong> Specify charitable organizations you&apos;d like to support. You can add multiple charities or skip this step entirely if you don&apos;t wish to make charitable donations.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No charities added yet</p>
          <button
            type="button"
            onClick={addCharity}
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-lg shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Add Your First Charity
          </button>
        </div>
      ) : (
        <>
          {fields.map((field, index) => (
            <section key={field.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] rounded-xl shadow-lg shadow-rose-100">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Charity {index + 1}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => removeCharity(index)}
                  className="flex items-center gap-2 px-4 py-2 text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors font-semibold text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="space-y-6">
                {/* Charity Name and Identification Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`charity-${index}-name`} className="text-sm font-bold text-gray-700">
                      Charity Name *
                    </Label>
                    <Input
                      id={`charity-${index}-name`}
                      {...register(`step7.charities.${index}.name`)}
                      placeholder="Enter charity name"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                    {errors.step7?.charities?.[index]?.name && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{errors.step7.charities[index]?.name?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`charity-${index}-id`} className="text-sm font-bold text-gray-700">
                      Identification Number
                    </Label>
                    <Input
                      id={`charity-${index}-id`}
                      {...register(`step7.charities.${index}.identificationNumber`)}
                      placeholder="Optional"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor={`charity-${index}-phone`} className="text-sm font-bold text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id={`charity-${index}-phone`}
                      type="tel"
                      {...register(`step7.charities.${index}.phoneNumber`)}
                      placeholder="Optional"
                      className="w-full pl-10 pr-4 focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor={`charity-${index}-address`} className="text-sm font-bold text-gray-700">
                    Address
                  </Label>
                  <Input
                    id={`charity-${index}-address`}
                    {...register(`step7.charities.${index}.address`)}
                    placeholder="Optional"
                    className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`charity-${index}-city`} className="text-sm font-bold text-gray-700">
                      City
                    </Label>
                    <Input
                      id={`charity-${index}-city`}
                      {...register(`step7.charities.${index}.city`)}
                      placeholder="Optional"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`charity-${index}-state`} className="text-sm font-bold text-gray-700">
                      State
                    </Label>
                    <Input
                      id={`charity-${index}-state`}
                      {...register(`step7.charities.${index}.state`)}
                      placeholder="Optional"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                </div>

                {/* Country and Zip Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`charity-${index}-country`} className="text-sm font-bold text-gray-700">
                      Country
                    </Label>
                    <Input
                      id={`charity-${index}-country`}
                      {...register(`step7.charities.${index}.country`)}
                      placeholder="Optional"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`charity-${index}-zip`} className="text-sm font-bold text-gray-700">
                      Zip Code
                    </Label>
                    <Input
                      id={`charity-${index}-zip`}
                      {...register(`step7.charities.${index}.zipCode`)}
                      placeholder="Optional"
                      className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
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
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-lg shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98] mt-6"
          >
            <Plus className="h-5 w-5" />
            Add Another Charity
          </button>
        </>
      )}
    </div>
  );
}
