"use client";

import { useFormContext, useFieldArray, useWatch, Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash2 } from "lucide-react";

export function Step6Beneficiaries() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step6.beneficiaries",
  });

  const addBeneficiary = () => {
    append({
      name: "",
      relation: "",
      dateOfBirth: "",
      age: "",
      pan: "",
      aadhaar: "",
      guardianName: "",
      guardianRelation: "",
    });
  };

  const removeBeneficiary = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-xl">
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          Beneficiaries are the people or organizations who will receive your assets. Add each beneficiary with their full legal name, relationship, and date of birth. If a beneficiary is under 18, guardian details will be required automatically.
        </p>
      </div>

      {fields.map((field, index) => (
        <BeneficiaryCard
          key={field.id}
          index={index}
          control={control}
          register={register}
          setValue={setValue}
          errors={errors}
          removeBeneficiary={removeBeneficiary}
          canRemove={fields.length > 1}
        />
      ))}

      {/* Add Beneficiary Button */}
      <button
        type="button"
        onClick={addBeneficiary}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-lg shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98]"
      >
        <Plus className="h-5 w-5" />
        Add Another Beneficiary
      </button>
    </div>
  );
}

// Separate component for each beneficiary card
function BeneficiaryCard({
  index,
  control,
  register,
  setValue,
  errors,
  removeBeneficiary,
  canRemove,
}: {
  index: number;
  control: Control<CompleteWillFormData>;
  register: UseFormRegister<CompleteWillFormData>;
  setValue: UseFormSetValue<CompleteWillFormData>;
  errors: FieldErrors<CompleteWillFormData>;
  removeBeneficiary: (index: number) => void;
  canRemove: boolean;
}) {
  const age = useWatch({
    control,
    name: `step6.beneficiaries.${index}.age`,
    defaultValue: "",
  });
  const isMinor = parseInt(age || "0") < 18 && age !== "";

  const calculateAge = (dob: string): string => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? String(age) : "0";
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] rounded-xl shadow-lg shadow-rose-100">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Beneficiary {index + 1}</h2>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => removeBeneficiary(index)}
            className="flex items-center gap-2 px-4 py-2 text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors font-semibold text-sm"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 -mt-2 mb-4">
        Provide the beneficiary&apos;s full legal name, relation, and date of birth. If the person is under 18, guardian details will be required automatically.
      </p>

      <div className="space-y-4">
        {/* Name and Relation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor={`beneficiary-${index}-name`} className="text-sm font-bold text-gray-700">
              Name *
            </Label>
            <Input
              id={`beneficiary-${index}-name`}
              {...register(`step6.beneficiaries.${index}.name`)}
              placeholder="Enter full name"
              className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
            />
            {errors.step6?.beneficiaries?.[index]?.name && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.step6.beneficiaries[index]?.name?.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`beneficiary-${index}-relation`} className="text-sm font-bold text-gray-700">
              Relation *
            </Label>
            <Input
              id={`beneficiary-${index}-relation`}
              {...register(`step6.beneficiaries.${index}.relation`)}
              placeholder="e.g., Spouse, Son, Daughter"
              className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
            />
            {errors.step6?.beneficiaries?.[index]?.relation && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.step6.beneficiaries[index]?.relation?.message}</p>
            )}
          </div>
        </div>

        {/* PAN and Aadhaar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor={`beneficiary-${index}-pan`} className="text-sm font-bold text-gray-700">
              PAN (Optional)
            </Label>
            <Input
              id={`beneficiary-${index}-pan`}
              {...register(`step6.beneficiaries.${index}.pan`)}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="w-full uppercase focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              onChange={(e) => {
                const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                setValue(`step6.beneficiaries.${index}.pan`, cleaned);
              }}
            />
            {errors.step6?.beneficiaries?.[index]?.pan && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.step6.beneficiaries[index]?.pan?.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`beneficiary-${index}-aadhaar`} className="text-sm font-bold text-gray-700">
              Aadhaar (Optional)
            </Label>
            <Input
              id={`beneficiary-${index}-aadhaar`}
              {...register(`step6.beneficiaries.${index}.aadhaar`)}
              placeholder="12-digit Aadhaar"
              maxLength={12}
              inputMode="numeric"
              className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
                setValue(`step6.beneficiaries.${index}.aadhaar`, digits);
              }}
            />
            {errors.step6?.beneficiaries?.[index]?.aadhaar && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.step6.beneficiaries[index]?.aadhaar?.message}</p>
            )}
          </div>
        </div>

        {/* Date of Birth and Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor={`beneficiary-${index}-dob`} className="text-sm font-bold text-gray-700">
              Date of Birth *
            </Label>
            <Input
              type="date"
              id={`beneficiary-${index}-dob`}
              {...register(`step6.beneficiaries.${index}.dateOfBirth`, {
                onChange: (e) => {
                  const age = calculateAge(e.target.value);
                  setValue(`step6.beneficiaries.${index}.age`, age);
                },
              })}
              className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
            />
            {errors.step6?.beneficiaries?.[index]?.dateOfBirth && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.step6.beneficiaries[index]?.dateOfBirth?.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`beneficiary-${index}-age`} className="text-sm font-bold text-gray-700">
              Age
            </Label>
            <Input
              id={`beneficiary-${index}-age`}
              {...register(`step6.beneficiaries.${index}.age`)}
              readOnly
              className="w-full bg-gray-50 border-gray-200 text-gray-500"
            />
          </div>
        </div>

        {/* Guardian Information (conditional) */}
        {isMinor && (
          <div className="mt-8 p-6 bg-rose-50/30 border border-rose-100 rounded-2xl">
            <h3 className="text-lg font-bold text-rose-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-rose-400 rounded-full" />
              Guardian Information (Required for Minor)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`beneficiary-${index}-guardian-name`} className="text-sm font-bold text-gray-700">
                  Guardian Name *
                </Label>
                <Input
                  id={`beneficiary-${index}-guardian-name`}
                  {...register(`step6.beneficiaries.${index}.guardianName`)}
                  placeholder="Enter guardian's name"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors.step6?.beneficiaries?.[index]?.guardianName && (
                  <p className="text-sm text-red-500 mt-1 font-medium">{errors.step6.beneficiaries[index]?.guardianName?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`beneficiary-${index}-guardian-relation`} className="text-sm font-bold text-gray-700">
                  Relation to Beneficiary *
                </Label>
                <Input
                  id={`beneficiary-${index}-guardian-relation`}
                  {...register(`step6.beneficiaries.${index}.guardianRelation`)}
                  placeholder="e.g., Father, Mother"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors.step6?.beneficiaries?.[index]?.guardianRelation && (
                  <p className="text-sm text-red-500 mt-1 font-medium">{errors.step6.beneficiaries[index]?.guardianRelation?.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
